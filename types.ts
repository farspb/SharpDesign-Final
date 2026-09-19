
export type Language = 'fa' | 'en';
export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface Translations {
  nav: {
    home: string;
    crypto: string;
    stock: string;
    astrology: string;
    news: string;
    login: string;
    profile: string;
    logout: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_secondary: string;
    install_btn: string;
    launchpad: string;
  };
  auth: {
    login_title: string;
    signup_title: string;
    forgot_title: string;
    name_label: string;
    email_label: string;
    password_label: string;
    submit_login: string;
    submit_signup: string;
    submit_reset: string;
    google_btn: string;
    toggle_login: string;
    toggle_signup: string;
    forgot_password: string;
    back_to_login: string;
    success_login: string;
    success_signup: string;
    success_reset: string;
    error_generic: string;
  };
  common: {
    loading: string;
    read_more: string;
    updated_at: string;
    vip_access: string;
  };
  crypto_page: {
    title: string;
    subtitle: string;
    btc_target: string;
    eth_target: string;
  };
  stock_page: {
    title: string;
    subtitle: string;
    market_status: string;
    market_hours: string;
  };
  astrology_page: {
    title: string;
    subtitle: string;
    daily_horoscope: string;
  };
  news_page: {
    title: string;
    subtitle: string;
  };
  features: {
    fast_title: string;
    fast_desc: string;
    secure_title: string;
    secure_desc: string;
    mobile_title: string;
    mobile_desc: string;
  };
  footer: {
    rights: string;
    desc: string;
    contact_title: string;
    address_label: string;
    address_value: string;
    phone_label: string;
    email_label: string;
    whatsapp_label: string;
    github_label: string;
    design_by: string;
  }
}
