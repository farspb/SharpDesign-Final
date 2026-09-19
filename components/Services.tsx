import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Code2, Search, Palette, Server } from 'lucide-react';

const Services: React.FC = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <Search className="w-8 h-8 text-blue-500" />,
      title: t.services.seo_title,
      desc: t.services.seo_desc,
    },
    {
      icon: <Code2 className="w-8 h-8 text-green-500" />,
      title: t.services.web_title,
      desc: t.services.web_desc,
    },
    {
      icon: <Palette className="w-8 h-8 text-purple-500" />,
      title: t.services.uiux_title,
      desc: t.services.uiux_desc,
    },
    {
      icon: <Server className="w-8 h-8 text-orange-500" />,
      title: t.services.api_title,
      desc: t.services.api_desc,
    },
  ];

  return (
    <section id="services" className="py-24 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.services.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="mb-6 p-3 rounded-lg bg-white dark:bg-slate-700 w-fit shadow-sm group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;