import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Chrome, ArrowRight, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgot';

const Auth: React.FC = () => {
  const { t, dir } = useLanguage();
  const { login, signup, resetPassword, loginWithGoogle, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  const [view, setView] = useState<AuthView>('login');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
        navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    
    if (view === 'login') {
        success = await login(email, password);
    } else if (view === 'signup') {
        success = await signup(name, email, password);
    } else if (view === 'forgot') {
        success = await resetPassword(email);
        if (success) setResetSent(true);
    }
  };

  const handleGoogle = async () => {
      await loginWithGoogle();
  }

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B1120] transition-colors">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[100px]"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md bg-white dark:bg-[#151d2f] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 relative z-10">
            {/* Header */}
            <div className="p-8 pb-0 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-purple-600 text-white mb-6 shadow-lg shadow-primary-500/30">
                    {view === 'forgot' ? <KeyRound className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {view === 'login' && t.auth.login_title}
                    {view === 'signup' && t.auth.signup_title}
                    {view === 'forgot' && t.auth.forgot_title}
                </h2>
                <p className="text-gray-500 text-sm">
                   {view === 'forgot' && !resetSent ? 'Enter your email to receive recovery link.' : ''}
                   {view === 'forgot' && resetSent ? 'Check your inbox.' : ''}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-5">
                
                {/* Reset Password Success Message */}
                {view === 'forgot' && resetSent ? (
                    <div className="text-center py-6 animate-fade-in">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <p className="text-green-600 font-medium">{t.auth.success_reset}</p>
                        <button 
                            type="button"
                            onClick={() => { setView('login'); setResetSent(false); }}
                            className="mt-6 text-primary-600 font-bold hover:underline"
                        >
                            {t.auth.back_to_login}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Name Input (Signup only) */}
                        {view === 'signup' && (
                            <div className="space-y-1.5 animate-slide-in">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.name_label}</label>
                                <div className="relative group">
                                    <User className="absolute top-3.5 left-3 w-5 h-5 text-gray-400 rtl:right-3 rtl:left-auto group-focus-within:text-primary-500 transition-colors" />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full pl-10 rtl:pr-10 rtl:pl-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                        placeholder="..."
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.email_label}</label>
                            <div className="relative group">
                                <Mail className="absolute top-3.5 left-3 w-5 h-5 text-gray-400 rtl:right-3 rtl:left-auto group-focus-within:text-primary-500 transition-colors" />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 rtl:pr-10 rtl:pl-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                    placeholder="name@gmail.com"
                                />
                            </div>
                        </div>

                        {/* Password Input (Not for Forgot Password) */}
                        {view !== 'forgot' && (
                            <div className="space-y-1.5 animate-slide-in">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.password_label}</label>
                                    {view === 'login' && (
                                        <button 
                                            type="button" 
                                            onClick={() => setView('forgot')}
                                            className="text-xs text-primary-600 hover:text-primary-500 font-medium"
                                        >
                                            {t.auth.forgot_password}
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute top-3.5 left-3 w-5 h-5 text-gray-400 rtl:right-3 rtl:left-auto group-focus-within:text-primary-500 transition-colors" />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 rtl:pr-10 rtl:pl-3 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Connecting to #kala DB...</span>
                            ) : (
                                <>
                                    {view === 'login' && t.auth.submit_login}
                                    {view === 'signup' && t.auth.submit_signup}
                                    {view === 'forgot' && t.auth.submit_reset}
                                    <Arrow className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </>
                )}

                {view !== 'forgot' && (
                    <>
                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-[#151d2f] text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button 
                            type="button"
                            onClick={handleGoogle}
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Chrome className="w-5 h-5 text-red-500" />
                            {t.auth.google_btn}
                        </button>
                    </>
                )}

                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    {view === 'forgot' && !resetSent && (
                         <button 
                            type="button" 
                            onClick={() => setView('login')}
                            className="text-primary-600 hover:text-primary-700 font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                        >
                            <Arrow className="w-3 h-3 rotate-180" />
                            {t.auth.back_to_login}
                        </button>
                    )}
                    
                    {view !== 'forgot' && (
                        <button 
                            type="button" 
                            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                            className="text-primary-600 hover:text-primary-700 font-medium hover:underline"
                        >
                            {view === 'login' ? t.auth.toggle_signup : t.auth.toggle_login}
                        </button>
                    )}
                </div>
            </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;