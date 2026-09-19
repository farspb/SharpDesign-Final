import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Zap, Shield, Smartphone } from 'lucide-react';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: t.features.fast_title,
      desc: t.features.fast_desc
    },
    {
      icon: <Shield className="w-6 h-6 text-indigo-500" />,
      title: t.features.secure_title,
      desc: t.features.secure_desc
    },
    {
      icon: <Smartphone className="w-6 h-6 text-pink-500" />,
      title: t.features.mobile_title,
      desc: t.features.mobile_desc
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 rounded-full bg-white dark:bg-slate-800 shadow-md">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feat.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm px-4">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;