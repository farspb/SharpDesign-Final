# Ubuntu Linux Production Deployment Guide
## Stable, High-Performance Deployment for Ubuntu (20.04 / 22.04 / 24.04 LTS)

This guide provides step-by-step terminal instructions to deploy and stably run the application on an Ubuntu Linux server with zero-downtime, automated process recovery, Nginx reverse proxy / static asset optimization, and free Let's Encrypt SSL/TLS encryption.

---

## Table of Contents
1. [System Requirements & Architecture](#1-system-requirements--architecture)
2. [Step 1: Server Preparation & Security](#step-1-server-preparation--security)
3. [Step 2: Install Node.js (LTS) and Build Tools](#step-2-install-nodejs-lts-and-build-tools)
4. [Step 3: Deploy Application Code & Build](#step-3-deploy-application-code--build)
5. [Step 4: Option A — Nginx Production Static Hosting (Recommended)](#step-4-option-a--nginx-production-static-hosting-recommended)
6. [Step 5: Option B — PM2 Node.js Process Manager (Alternative)](#step-5-option-b--pm2-nodejs-process-manager-alternative)
7. [Step 6: SSL / TLS Setup with Certbot](#step-6-ssl--tls-setup-with-certbot)
8. [Step 7: Automated Updates & CI/CD Script](#step-7-automated-updates--cicd-script)
9. [Step 8: Monitoring, Logs & Troubleshooting](#step-8-monitoring-logs--troubleshooting)

---

## 1. System Requirements & Architecture

- **Operating System:** Ubuntu Server 20.04 LTS, 22.04 LTS, or 24.04 LTS
- **Hardware Minimums:**
  - CPU: 1 vCPU (2+ cores recommended for faster builds)
  - RAM: 1 GB minimum (2 GB+ recommended; if on 1 GB VPS, configure Swap as shown in Step 1)
  - Disk: 10 GB SSD
- **Architecture Overview:**
  - **Client-Side Framework:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Motion.
  - **Serving Strategy:** The production build generates high-speed static assets inside `dist/`. Nginx directly serves these pre-compiled assets with gzip/brotli compression and browser caching, providing sub-millisecond response times and virtually unlimited concurrency with minimal RAM usage.

---

## Step 1: Server Preparation & Security

Log into your server via SSH as `root` (or a sudo user):

```bash
ssh root@YOUR_SERVER_IP
```

### 1.1 Update Package Indexes
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common ufw build-essential
```

### 1.2 Setup Swap Space (Crucial for 1GB - 2GB RAM VPS)
Running `npm run build` with TypeScript and Vite requires RAM during bundle compilation. Prevent `Out of Memory` crashes by setting up a 2GB swap file:

```bash
# Check existing swap
sudo swapon --show

# If no swap exists, create a 2GB swap file:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swap aggressiveness
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### 1.3 Setup Dedicated Deployment User (Best Security Practice)
Avoid running applications under `root`:

```bash
# Create deployer user
sudo adduser --gecos "" deployer
sudo usermod -aG sudo deployer

# (Optional) Copy SSH keys from root to deployer
sudo mkdir -p /home/deployer/.ssh
sudo cp /root/.ssh/authorized_keys /home/deployer/.ssh/ 2>/dev/null || true
sudo chown -R deployer:deployer /home/deployer/.ssh
sudo chmod 700 /home/deployer/.ssh
sudo chmod 600 /home/deployer/.ssh/authorized_keys 2>/dev/null || true
```

### 1.4 Configure UFW Firewall
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh          # Port 22 (or your custom SSH port)
sudo ufw allow http         # Port 80
sudo ufw allow https        # Port 443
sudo ufw enable             # Press 'y' to confirm
sudo ufw status
```

---

## Step 2: Install Node.js (LTS) and Build Tools

Install Node.js 22 LTS or 20 LTS using the official NodeSource repository:

```bash
# Install NodeSource repository for Node.js 22 LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Install Node.js & npm
sudo apt install -y nodejs

# Verify installation
node -v   # Should output v22.x.x
npm -v    # Should output 10.x.x
```

---

## Step 3: Deploy Application Code & Build

### 3.1 Create Application Directory
```bash
sudo mkdir -p /var/www/sharpkala
sudo chown -R deployer:deployer /var/www/sharpkala
```

### 3.2 Switch to Deployer User
```bash
su - deployer
cd /var/www/sharpkala
```

### 3.3 Clone or Copy Your Codebase
Clone from your GitHub repository:
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git .
```

*Or, if transferring files from your local machine via SCP/rsync:*
```bash
# Run this on your local machine:
rsync -avz --exclude 'node_modules' --exclude 'dist' ./ deployer@YOUR_SERVER_IP:/var/www/sharpkala/
```

### 3.4 Install Dependencies & Build Production Bundle
```bash
cd /var/www/sharpkala

# Install dependencies cleanly
npm ci || npm install

# Build the optimized production bundle
npm run build
```

This compiles all TypeScript code, minimizes styles, and generates the production-ready assets in:
`/var/www/sharpkala/dist`

Check that the build completed:
```bash
ls -la /var/www/sharpkala/dist
# You will see index.html, assets/, and manifest.json
```

---

## Step 4: Option A — Nginx Production Static Hosting (Recommended)

Because Vite builds a Single-Page Application (SPA), Nginx is the fastest, most reliable, and lowest-resource web server to host it.

### 4.1 Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4.2 Create Nginx Configuration Block
Create a new site configuration file:
```bash
sudo nano /etc/nginx/sites-available/sharpkala
```

Paste the following production configuration (replace `yourdomain.com` with your actual domain or server IP):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/sharpkala/dist;
    index index.html;

    # Maximum file upload size
    client_max_body_size 20M;

    # Gzip Compression for Ultra-Fast Loading
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/x-javascript
        application/xml
        application/xml+rss
        image/svg+xml;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # SPA Routing: Fallback all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static Asset Caching (Vite adds content hashes to filenames)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Don't cache index.html or service workers
    location = /index.html {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Disable logging for favicon and robots.txt
    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }

    location = /robots.txt {
        access_log off;
        log_not_found off;
    }

    # Deny access to hidden files (.git, .env, etc.)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 4.3 Enable Configuration & Test Nginx
```bash
# Enable the site
sudo ln -sf /etc/nginx/sites-available/sharpkala /etc/nginx/sites-enabled/

# Remove default site if not needed
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx syntax
sudo nginx -t
```
Output must show: `syntax is ok` and `test is successful`.

### 4.4 Restart Nginx
```bash
sudo systemctl restart nginx
```

---

## Step 5: Option B — PM2 Node.js Process Manager (Alternative)

If you prefer running a Node.js daemon (for example, `vite preview` on port 3000, or if you attach a custom backend):

### 5.1 Install PM2 Globally
```bash
sudo npm install -g pm2
```

### 5.2 Create an Ecosystem Configuration File
Inside `/var/www/sharpkala/ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [
    {
      name: 'sharpkala-app',
      script: 'node_modules/vite/bin/vite.js',
      args: 'preview --host 0.0.0.0 --port 3000',
      cwd: '/var/www/sharpkala',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

### 5.3 Start with PM2 and Enable Startup on Boot
```bash
cd /var/www/sharpkala
pm2 start ecosystem.config.cjs

# Save process list
pm2 save

# Generate and execute startup hook for Ubuntu systemd
pm2 startup systemd
# Copy and run the sudo command PM2 prints in the terminal!
```

### 5.4 Configure Nginx as Reverse Proxy to PM2 (Port 3000)
In `/etc/nginx/sites-available/sharpkala`:
```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Step 6: SSL / TLS Setup with Certbot

To enable HTTPS and secure padlock using a free Let's Encrypt SSL certificate:

### 6.1 Install Certbot and the Nginx Plugin
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain & Install SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
- Provide your email address for renewal notices.
- Agree to the Terms of Service.
- Certbot will automatically edit your Nginx configuration and set up automatic HTTP -> HTTPS redirection.

### 6.3 Test Automatic SSL Renewal
Let's Encrypt certificates last 90 days. Ubuntu sets up an automated systemd timer:
```bash
sudo certbot renew --dry-run
```
If you see `Congratulations, all simulated renewals succeeded`, SSL is 100% automated and maintenance-free.

---

## Step 7: Automated Updates & CI/CD Script

To easily pull latest code, rebuild, and reload the server with zero friction, create an update script `/var/www/sharpkala/deploy.sh`:

```bash
nano /var/www/sharpkala/deploy.sh
```

Paste:
```bash
#!/usr/bin/env bash
set -e

echo "🚀 [1/4] Pulling latest changes from Git..."
cd /var/www/sharpkala
git pull origin main

echo "📦 [2/4] Installing dependencies..."
npm ci || npm install

echo "🛠️ [3/4] Building production bundle..."
npm run build

echo "🔄 [4/4] Reloading web server..."
# For Nginx static hosting:
sudo systemctl reload nginx

# If using PM2 (uncomment if using Option B):
# pm2 reload sharpkala-app || pm2 start ecosystem.config.cjs

echo "✅ Deployment completed successfully!"
```

Make it executable:
```bash
chmod +x /var/www/sharpkala/deploy.sh
```

Whenever you push updates to GitHub, simply run on your server:
```bash
/var/www/sharpkala/deploy.sh
```

---

## Step 8: Monitoring, Logs & Troubleshooting

### Check Service Status
```bash
# Nginx Status
sudo systemctl status nginx

# PM2 Status (if used)
pm2 status
pm2 logs sharpkala-app
```

### View Access and Error Logs
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Common Issues & Quick Fixes

1. **Blank page or 404 when reloading sub-routes (`/crypto`, `/stock`, etc.):**
   - Cause: Nginx is looking for a physical file matching the route path.
   - Fix: Ensure `try_files $uri $uri/ /index.html;` is present in `/etc/nginx/sites-available/sharpkala`.

2. **`npm run build` fails with `JavaScript heap out of memory`:**
   - Cause: Insufficient RAM on small VPS.
   - Fix: Ensure the 2GB Swap was created in Step 1.2, or set the Node heap limit:
     ```bash
     export NODE_OPTIONS="--max-old-space-size=1536"
     npm run build
     ```

3. **Permission denied errors in `/var/www/sharpkala`:**
   - Fix:
     ```bash
     sudo chown -R deployer:www-data /var/www/sharpkala
     sudo chmod -R 755 /var/www/sharpkala
     ```

4. **Port 80 or 443 already in use:**
   - Find what is occupying the port:
     ```bash
     sudo lsof -i :80
     sudo lsof -i :443
     ```
