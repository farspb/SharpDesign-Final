import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Send, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically integrate with an API like Formspree or your Render backend
    setTimeout(() => {
        setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-primary-600 dark:bg-primary-700 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
            
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t.contact.title}
            </h2>
          </div>

          {isSubmitted ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center animate-fade-in">
                <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">{t.contact.success}</h3>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-primary-100 mb-2">
                    {t.contact.name_label}
                    </label>
                    <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    placeholder="..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary-100 mb-2">
                    {t.contact.email_label}
                    </label>
                    <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    placeholder="name@example.com"
                    />
                </div>
                </div>
                <div>
                <label className="block text-sm font-medium text-primary-100 mb-2">
                    {t.contact.message_label}
                </label>
                <textarea
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all resize-none"
                    placeholder="..."
                ></textarea>
                </div>
                <div className="text-center">
                <button
                    type="submit"
                    className="inline-flex items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white transition-all shadow-lg transform hover:-translate-y-0.5"
                >
                    {t.contact.submit_btn}
                    <Send className={`w-5 h-5 ${useLanguage().dir === 'rtl' ? 'mr-2' : 'ml-2'}`} />
                </button>
                </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;