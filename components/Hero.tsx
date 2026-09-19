
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight, ArrowLeft, Database, Cpu, Download, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  onInstall?: () => void;
  showInstall?: boolean;
}

const Hero: React.FC<HeroProps> = ({ onInstall, showInstall }) => {
  const { t, dir, language } = useLanguage();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white pt-20 pb-32">
        {/* Dynamic Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary-500 opacity-20 blur-[100px]"></div>
        </div>

        {/* Floating Code Elements - Decorative */}
        <div className="absolute top-20 right-[10%] hidden lg:block opacity-20 animate-pulse delay-700">
            <div className="font-mono text-xs text-green-500 bg-black/50 p-4 rounded border border-green-900/30">
                {`> initiating_core_sequence...`} <br/>
                {`> connecting_to_db... success`} <br/>
                {`> optimization_level: 100%`}
            </div>
        </div>
        <div className="absolute bottom-40 left-[5%] hidden lg:block opacity-20">
             <div className="w-32 h-32 border border-blue-500/20 rounded-full flex items-center justify-center animate-spin-slow">
                <div className="w-24 h-24 border border-purple-500/20 rounded-full"></div>
             </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-start rtl:lg:text-right">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-primary-400 font-mono text-sm">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    {dir === 'rtl' ? 'نسخه نهایی v2.0 Live' : 'System Operational v2.0'}
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        {t.hero.title.split('#')[0]}
                    </span>
                    <span className="text-primary-500">#</span>
                    <span className="text-white">
                         {language === 'fa' ? 'کالا' : 'kala'}
                    </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                    {t.hero.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                    {/* Primary CTA */}
                    <Link to="/auth" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-primary-900/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group">
                        {t.hero.cta_primary}
                        <Arrow className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    {/* Install / Launchpad Button */}
                    {showInstall && onInstall && (
                         <button 
                            onClick={onInstall}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold backdrop-blur-sm transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
                         >
                            <Download className="w-5 h-5 text-primary-400 group-hover:text-white transition-colors" />
                            {t.hero.install_btn}
                        </button>
                    )}
                </div>
            </div>

            {/* Hero Visuals / Code Mockup */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
                <div className="relative rounded-2xl bg-[#0F172A] border border-gray-800 shadow-2xl overflow-hidden group">
                    {/* Header of Mockup */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#1E293B] border-b border-gray-800">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono ml-4">server.js — #kala-core</div>
                    </div>
                    
                    {/* Code Content */}
                    <div className="p-6 font-mono text-sm leading-6">
                        <div className="text-gray-400">
                            <span className="text-purple-400">const</span> <span className="text-blue-400">SharpKala</span> = <span className="text-purple-400">require</span>(<span className="text-green-400">'@core/mastery'</span>);
                        </div>
                        <div className="text-gray-400 mt-2">
                            <span className="text-purple-400">async function</span> <span className="text-yellow-400">initializeFuture</span>() {'{'}
                        </div>
                        <div className="pl-4 text-gray-400 border-l border-gray-800 ml-1">
                            <span className="text-purple-400">await</span> <span className="text-blue-400">SharpKala</span>.<span className="text-yellow-400">connect</span>({'{'}
                            <div className="pl-4">
                                <span className="text-red-400">security</span>: <span className="text-orange-400">'MILITARY_GRADE'</span>,
                                <br/>
                                <span className="text-red-400">performance</span>: <span className="text-orange-400">'QUANTUM'</span>,
                                <br/>
                                <span className="text-red-400">design</span>: <span className="text-orange-400">'STUNNING'</span>
                            </div>
                            {'}'});
                            <br/>
                            <span className="text-gray-500">// System ready for deployment</span>
                        </div>
                        <div className="text-gray-400">{'}'}</div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-green-500">Database Connected Successfully</span>
                        </div>
                    </div>

                    {/* Overlay Glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-purple-600 opacity-20 blur-xl -z-10 group-hover:opacity-30 transition-opacity duration-500"></div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -bottom-6 -right-6 bg-[#1E293B] p-4 rounded-xl border border-gray-700 shadow-xl flex items-center gap-3 animate-bounce-slow">
                    <Database className="w-8 h-8 text-blue-400" />
                    <div>
                        <div className="text-xs text-gray-400">Uptime</div>
                        <div className="text-lg font-bold text-white">99.99%</div>
                    </div>
                </div>
                 <div className="absolute -top-6 -left-6 bg-[#1E293B] p-4 rounded-xl border border-gray-700 shadow-xl flex items-center gap-3 animate-bounce-slow delay-150">
                    <Cpu className="w-8 h-8 text-purple-400" />
                    <div>
                        <div className="text-xs text-gray-400">Processing</div>
                        <div className="text-lg font-bold text-white">0.02ms</div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
