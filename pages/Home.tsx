
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { Download, X, Share, PlusSquare, Smartphone, Rocket } from 'lucide-react';

const Home: React.FC = () => {
  const { language, t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Check if user previously dismissed the banner
    const isDismissed = localStorage.getItem('installBannerDismissed');

    if (!isStandalone && !isDismissed) {
        setIsVisible(true);
    }

    // 4. Listen for Android/Desktop install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!isStandalone && !isDismissed) setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleDismiss = () => {
      setIsVisible(false);
      localStorage.setItem('installBannerDismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (isIOS) {
        // iOS doesn't support programmatic install, show guide
        setShowIOSGuide(true);
    } else if (deferredPrompt) {
      // Android / Desktop standard install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback if browser doesn't support PWA but isn't iOS (unlikely in modern Chrome/Edge)
      alert(language === 'fa' 
        ? "برای نصب، لطفاً از منوی مرورگر گزینه 'Install App' یا 'Add to Home Screen' را انتخاب کنید."
        : "To install, please select 'Install App' or 'Add to Home Screen' from your browser menu.");
    }
  };

  const isInstallable = !!deferredPrompt || isIOS;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Quick Install Banner (Top) */}
      {isVisible && (
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative z-40 shadow-lg animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm animate-pulse hidden sm:block">
                        <Download className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold flex items-center gap-2">
                            {language === 'fa' ? 'نصب اپلیکیشن' : 'Install App'}
                            <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full hidden sm:inline-block">PWA</span>
                        </span>
                        <span className="text-[10px] md:text-xs text-blue-100 opacity-90">
                            {language === 'fa' ? 'دسترسی سریع، بدون نیاز به فیلترشکن' : 'Faster access, fullscreen experience'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleInstallClick}
                        className="px-4 py-1.5 bg-white text-blue-600 text-xs font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap flex items-center gap-2"
                    >
                        <Smartphone className="w-3 h-3" />
                        {language === 'fa' ? 'نصب کنید' : 'Install'}
                    </button>
                    <button 
                        onClick={handleDismiss}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-white/80" />
                    </button>
                </div>
            </div>
        </div>
       )}

       {/* iOS Install Guide Modal */}
       {showIOSGuide && (
           <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowIOSGuide(false)}>
               <div className="bg-[#1a1a1a] border border-white/10 w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 text-white shadow-2xl transform transition-transform" onClick={e => e.stopPropagation()}>
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-lg font-bold">
                           {language === 'fa' ? 'راهنمای نصب در آیفون' : 'Install on iOS'}
                       </h3>
                       <button onClick={() => setShowIOSGuide(false)} className="bg-white/10 p-1 rounded-full"><X className="w-5 h-5"/></button>
                   </div>
                   
                   <div className="space-y-6">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                               <Share className="w-5 h-5 text-white" />
                           </div>
                           <div className="text-sm text-gray-300">
                               {language === 'fa' 
                                ? '۱. در نوار پایین مرورگر سافاری، روی دکمه Share بزنید.' 
                                : '1. Tap the Share button in Safari menu bar.'}
                           </div>
                       </div>
                       
                       <div className="w-px h-6 bg-white/10 mx-5"></div>

                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center shrink-0">
                               <PlusSquare className="w-5 h-5 text-white" />
                           </div>
                           <div className="text-sm text-gray-300">
                               {language === 'fa'
                                ? "۲. گزینه 'Add to Home Screen' را انتخاب کنید."
                                : "2. Scroll down and select 'Add to Home Screen'."}
                           </div>
                       </div>
                   </div>

                   <div className="mt-8 text-center">
                       <button onClick={() => setShowIOSGuide(false)} className="text-blue-400 text-sm font-bold hover:underline">
                           {language === 'fa' ? 'متوجه شدم' : 'Got it'}
                       </button>
                   </div>
                   
                   <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#1a1a1a] sm:hidden"></div>
               </div>
           </div>
       )}

      <Header />
      <main className="flex-grow">
        {/* Pass Install Logic to Hero */}
        <Hero onInstall={handleInstallClick} showInstall={isInstallable} />
        <Features />
      </main>
      <Footer />

      {/* Floating Launchpad Button (Bottom Right) */}
      {isInstallable && (
          <button 
            onClick={handleInstallClick}
            className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl shadow-purple-900/40 hover:scale-110 active:scale-95 transition-all group border border-white/20 animate-bounce-slow"
            title={t.hero.launchpad}
          >
              <div className="relative">
                  <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050505]"></span>
              </div>
              <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
                  {t.hero.launchpad}
              </span>
          </button>
      )}
    </div>
  );
};

export default Home;
