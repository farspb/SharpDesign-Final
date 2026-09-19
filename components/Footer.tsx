import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, MapPin, Hash, ShieldCheck, Server, Github, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const CONTACT_INFO = {
    email: 'Farzad.azizi@gmail.com',
    phone: '+989114904898',
    whatsapp_url: 'https://wa.me/989114904898',
    github_url: 'https://github.com/farspb'
  };

  return (
    <footer className="bg-[#050505] text-white pt-20 pb-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
               <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-600 text-white">
                   <Hash className="w-6 h-6" />
               </div>
              <span className="text-3xl font-bold tracking-tighter text-white">
                {language === 'fa' ? 'کالا' : 'kala'}
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {t.footer.desc}
            </p>
            
            {/* GitHub Info Section */}
            <div className="pt-4 border-t border-white/5">
                <a 
                  href={CONTACT_INFO.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group text-gray-400 hover:text-white transition-all"
                >
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-primary-500/50 transition-colors">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary-500">{t.footer.github_label}</div>
                    <div className="text-sm font-mono flex items-center gap-1 group-hover:underline">
                      farspb <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </a>
            </div>

            <div className="flex gap-4 pt-2">
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    Secure DB
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-1">
                    <Server className="w-3 h-3 text-blue-500" />
                    24/7 Uptime
                </div>
            </div>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-white relative inline-block">
              {t.footer.contact_title}
              <span className="absolute -bottom-2 right-0 left-0 h-1 bg-gradient-to-r from-primary-600 to-transparent rounded-full rtl:bg-gradient-to-l"></span>
            </h4>
            <div className="space-y-4 text-gray-400 text-sm">
              <div className="flex items-start gap-4 group">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5 group-hover:text-white transition-colors" />
                <span className="group-hover:text-gray-200 transition-colors">{t.footer.address_label} {t.footer.address_value}</span>
              </div>
              <div className="flex items-center gap-4 group">
                <Mail className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
                <span className="group-hover:text-gray-200 transition-colors font-mono">{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center gap-4 group">
                <Phone className="w-5 h-5 text-primary-500 group-hover:text-white transition-colors" />
                <span dir="ltr" className={`group-hover:text-gray-200 transition-colors font-mono ${language === 'fa' ? 'text-right' : ''}`}>{CONTACT_INFO.phone}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp / Action Column */}
          <div className="flex flex-col items-start md:items-end justify-center space-y-6">
             <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-2xl border border-gray-800 w-full md:w-auto">
                 <p className="text-gray-400 text-sm mb-4 text-center md:text-start rtl:md:text-right">Start your digital transformation today.</p>
                 <a 
                    href={CONTACT_INFO.whatsapp_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:-translate-y-1 w-full"
                 >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>{t.footer.whatsapp_label}</span>
                 </a>
             </div>
          </div>

        </div>

        {/* Copyright & Designer */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} {language === 'fa' ? '#کالا' : '#kala'}. {t.footer.rights}
          </div>
          <div className="font-mono text-gray-500 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
            {t.footer.design_by}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;