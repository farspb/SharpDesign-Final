import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Newspaper, ExternalLink, Globe, TrendingUp, 
    Activity, Mic2, History, Clock, Flame, 
    Share2, Bookmark, CheckCircle2,
    Satellite, Cpu, Trophy, Leaf, DollarSign, RefreshCw,
    BarChart3, Filter, Search, Zap, Play, Pause,
    Volume2, VolumeX, Maximize, X, MessageSquare, ThumbsUp,
    Heart, Calendar, User, ArrowLeft, ArrowRight
} from 'lucide-react';

// --- TYPES ---
interface NewsItem {
    id: string;
    title: string;
    summary: string;
    content: string[];
    source: string;
    time: string;
    category: 'Economy' | 'Politics' | 'Tech' | 'Sports' | 'Social';
    urgent: boolean;
    readTime: number;
    region: 'Iran' | 'Global';
    image: string;
    videoTitle: string;
    author: string;
    views: number;
    likes: number;
}

interface HistoricalEvent {
    year: string;
    title: string;
    desc: string;
    category: string;
    icon: 'rocket' | 'compass' | 'history' | 'cpu' | 'trophy' | 'globe';
}

// --- HELPER: DATE FORMATTERS ---
const getFormattedDates = () => {
    const now = new Date();
    const gregorian = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now);
    const shamsi = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(now);
    return { gregorian, shamsi };
};

// --- DAILY QUOTE DATA ---
const QUOTES = [
    {
        authorFa: 'کوروش بزرگ',
        authorEn: 'Cyrus the Great',
        textFa: 'دستانی که کمک می‌کنند پاک‌تر از لب‌هایی هستند که دعا می‌کنند.',
        textEn: 'Hands that help are holier than lips that pray.'
    },
    {
        authorFa: 'آلبرت اینشتین',
        authorEn: 'Albert Einstein',
        textFa: 'در میان هر دشواری، فرصتی نهفته است.',
        textEn: 'In the middle of difficulty lies opportunity.'
    },
    {
        authorFa: 'مولانا جلال‌الدین',
        authorEn: 'Rumi',
        textFa: 'تو یک قطره در اقیانوس نیستی، تو کل اقیانوس در یک قطره هستی.',
        textEn: 'You are not a drop in the ocean. You are the entire ocean in a drop.'
    },
    {
        authorFa: 'استیو جابز',
        authorEn: 'Steve Jobs',
        textFa: 'تنها راه انجام کارهای بزرگ، دوست داشتن کاری است که انجام می‌دهید.',
        textEn: 'The only way to do great work is to love what you do.'
    },
    {
        authorFa: 'فردوسی',
        authorEn: 'Ferdowsi',
        textFa: 'توانا بود هر که دانا بود، ز دانش دل پیر برنا بود.',
        textEn: 'Capable is whoever is wise; knowledge rejuvenates the heart of the elderly.'
    },
    {
        authorFa: 'سقراط',
        authorEn: 'Socrates',
        textFa: 'زندگی آزموده نشده، ارزش زیستن ندارد.',
        textEn: 'The unexamined life is not worth living.'
    },
    {
        authorFa: 'ابوعلی سینا',
        authorEn: 'Avicenna',
        textFa: 'چیزی که روح را زنده می‌دارد، اندیشه و خردورزی است.',
        textEn: 'What keeps the soul alive is thought and wisdom.'
    },
    {
        authorFa: 'خیام نیشابوری',
        authorEn: 'Omar Khayyam',
        textFa: 'چون عهده نمی‌شود کسی فردا را، حالی خوش دار این دل پر سودا را.',
        textEn: 'Since tomorrow is guaranteed to no one, keep this passionate heart happy now.'
    }
];

const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % QUOTES.length;
    return QUOTES[index];
};

// --- DYNAMIC HISTORICAL EVENTS ---
const getDailyHistoricalEvents = (isFa: boolean): HistoricalEvent[] => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // 1-12

    // High fidelity July 15 events
    if (month === 7 && day === 15) {
        return [
            {
                year: '1969',
                title: isFa ? 'پرتاب فضاپیمای آپولو ۱۱ به سمت ماه' : 'Launch of Apollo 11 Mission to the Moon',
                desc: isFa 
                    ? 'ماموریت تاریخی آپولو ۱۱ با پرتاب موشک ساتورن ۵ آغاز شد که نهایتاً منجر به فرود نخستین انسان روی ماه گردید.'
                    : 'The historic Apollo 11 mission launched from Florida, carrying astronauts Neil Armstrong, Buzz Aldrin, and Michael Collins to the Moon.',
                category: isFa ? 'فضایی' : 'Space',
                icon: 'rocket'
            },
            {
                year: '1799',
                title: isFa ? 'کشف کتیبه تاریخی روزتا (Rosetta Stone)' : 'Discovery of the Rosetta Stone',
                desc: isFa
                    ? 'سربازان فرانسوی در مصر کتیبه سه‌زبانه روزتا را کشف کردند که به کلید طلایی رمزگشایی خط هیروگلیف تبدیل شد.'
                    : 'French soldiers in Egypt discovered the Rosetta Stone, which became the key to deciphering ancient Egyptian hieroglyphic script.',
                category: isFa ? 'باستان‌شناسی' : 'Archaeology',
                icon: 'compass'
            },
            {
                year: '1388',
                title: isFa ? 'تاسیس رسمی سازمان بنادر و دریانوردی ایران' : 'Development of Major Iranian Ports Initiative',
                desc: isFa
                    ? 'تصویب و آغاز طرح ملی توسعه کلان بنادر تجاری و توسعه ترانزیت دریایی خلیج فارس و دریای خزر.'
                    : 'Official ratification of the comprehensive development plan for southern and northern maritime transit hubs.',
                category: isFa ? 'تاریخی' : 'History',
                icon: 'history'
            },
            {
                year: '2006',
                title: isFa ? 'راه‌اندازی عمومی و تجاری پلتفرم توییتر' : 'Public Launch of Twitter Platform',
                desc: isFa
                    ? 'شبکه اجتماعی توییتر (ایکس کنونی) پس از گذراندن مراحل آزمایشی، به صورت عمومی در دسترس جهانیان قرار گرفت.'
                    : 'Twitter was officially launched to the general public, fundamentally transforming real-time global communications.',
                category: isFa ? 'تکنولوژی' : 'Technology',
                icon: 'cpu'
            }
        ];
    }

    // Dynamic rotation fallbacks for other days
    const rotationIndex = (day + month) % 3;
    if (rotationIndex === 0) {
        return [
            {
                year: '1975',
                title: isFa ? 'همکاری فضایی آپولو-سایوز' : 'Apollo-Soyuz Joint Space Mission',
                desc: isFa ? 'نخستین ماموریت فضایی مشترک ایالات متحده و اتحاد جماهیر شوروی در دوران جنگ سرد.' : 'The first international joint space flight, symbolizing a temporary détente.',
                category: isFa ? 'فضایی' : 'Space',
                icon: 'rocket'
            },
            {
                year: '1288',
                title: isFa ? 'فتح تهران توسط مجاهدین مشروطه' : 'Conquest of Tehran by Constitutionalists',
                desc: isFa ? 'نیروهای مبارز گیلانی و بختیاری تهران را فتح کرده و استبداد صغیر را پایان دادند.' : 'Revolutionary forces entered and captured Tehran, deposing the reigning monarch.',
                category: isFa ? 'تاریخ ایران' : 'Iran History',
                icon: 'history'
            }
        ];
    } else if (rotationIndex === 1) {
        return [
            {
                year: '1945',
                title: isFa ? 'اولین آزمایش بمب هسته‌ای جهان' : 'World\'s First Nuclear Weapon Test',
                desc: isFa ? 'ایالات متحده اولین بمب پلوتونیومی جهان موسوم به آزمایش ترینیتی را در نیومکزیکو منفجر کرد.' : 'The US conducted the Trinity test, successfully detonating the first nuclear device.',
                category: isFa ? 'تاریخی' : 'History',
                icon: 'globe'
            },
            {
                year: '1995',
                title: isFa ? 'تاسیس رسمی سازمان تجارت جهانی (WTO)' : 'Founding of the World Trade Organization',
                desc: isFa ? 'سازمان تجارت جهانی با هدف تنظیم مقررات و تسهیل مبادلات اقتصادی میان کشورها آغاز به کار کرد.' : 'The WTO began operations, creating a unified global trading framework.',
                category: isFa ? 'اقتصاد' : 'Economy',
                icon: 'globe'
            }
        ];
    } else {
        return [
            {
                year: '1911',
                title: isFa ? 'تاسیس شرکت آی‌بی‌ام (IBM)' : 'Inception of IBM Corporation',
                desc: isFa ? 'غول بزرگ کامپیوتری و سخت‌افزاری جهان تحت نام تجاری CTR تاسیس گردید.' : 'The Computing-Tabulating-Recording Company was incorporated, later renamed IBM.',
                category: isFa ? 'تکنولوژی' : 'Technology',
                icon: 'cpu'
            },
            {
                year: '1930',
                title: isFa ? 'برگزاری نخستین دوره جام جهانی فوتبال' : 'Inaugural Football World Cup in Uruguay',
                desc: isFa ? 'مسابقات جهانی فوتبال برای اولین بار در کشور اروگوئه با مشارکت تیم‌های ملی مطرح آغاز شد.' : 'The very first FIFA World Cup tournament commenced in Uruguay.',
                category: isFa ? 'ورزشی' : 'Sports',
                icon: 'trophy'
            }
        ];
    }
};

// --- MASTER BILINGUAL NEWS CORPUS GENERATOR (200 UNIQUE ITEMS) ---
interface PrayerTimes {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    sunset: string;
    maghrib: string;
    midnight: string;
}

const getTehranPrayerTimes = (date: Date): PrayerTimes => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfYear = month * 30 + day;
    const angle = (dayOfYear / 365) * 2 * Math.PI;
    
    const fajrMin = Math.round(5 * 60 + 15 + Math.sin(angle) * 45);
    const sunriseMin = Math.round(6 * 60 + 30 + Math.sin(angle) * 50);
    const dhuhrMin = Math.round(12 * 60 + 10 + Math.sin(angle + Math.PI/4) * 10);
    const sunsetMin = Math.round(18 * 60 + 10 - Math.sin(angle) * 80);
    const maghribMin = sunsetMin + 20;
    const midnightMin = Math.round((23 * 60 + 15 + Math.sin(angle) * 30) % 1440);
    
    const formatMinutes = (m: number) => {
        const hrs = Math.floor(m / 60) % 24;
        const mins = m % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };
    
    return {
        fajr: formatMinutes(fajrMin),
        sunrise: formatMinutes(sunriseMin),
        dhuhr: formatMinutes(dhuhrMin),
        sunset: formatMinutes(sunsetMin),
        maghrib: formatMinutes(maghribMin),
        midnight: formatMinutes(midnightMin)
    };
};

const NEWS_SUBJECTS: Record<'Economy' | 'Politics' | 'Tech' | 'Sports' | 'Social', {
    fa: { title: string; summary: string; content: string[] }[];
    en: { title: string; summary: string; content: string[] }[];
}> = {
    Economy: {
        fa: [
            {
                title: "رشد شاخص بورس با هدایت نقدینگی به بخش‌های تولیدی",
                summary: "تحلیلگران مالی معتقدند ورود سرمایه جدید به صندوق‌های توسعه‌ای، موتور متحرک صنایع خواهد بود.",
                content: [
                    "با ابلاغ ضوابط جدید نظارتی و تسهیل سرمایه‌گذاری برای معامله‌گران خرد، حجم معاملات در هفته اخیر افزایش چشمگیری داشت.",
                    "این روند به عقیده کارشناسان می‌تواند ثبات میان‌مدت را در تالار شیشه‌ای تضمین کرده و مانع از هدررفت نقدینگی شود."
                ]
            },
            {
                title: "افزایش تبادلات تجاری در مرزهای ترانزیتی کشور",
                summary: "توسعه زیرساخت‌های پایانه گمرکی به تسریع روند صادرات غیرنفتی و واردات کالاهای اساسی انجامید.",
                content: [
                    "گزارش‌های رسمی حاکی از کاهش چشمگیر زمان ترخیص کالا در سامانه‌های نوین گمرکی است.",
                    "سرمایه‌گذاران خصوصی با استقبال از این گام، به توسعه همکاری‌های لجستیکی در بنادر جنوبی پرداخته‌اند."
                ]
            },
            {
                title: "نوسانات انس جهانی طلا پس از نشست فدرال رزرو",
                summary: "تعیین نرخ بهره بانکی از سوی ایالات متحده موج جدیدی از نوسانات را در بازار دارایی‌های امن رقم زد.",
                content: [
                    "معامله‌گران طلا با دقت بیانیه‌های کمیته بازار باز را دنبال می‌کنند تا جهت‌گیری آینده را پیش‌بینی کنند.",
                    "کاهش احتمالی نرخ بهره همواره محرک قوی برای پناهگاه‌های امن مالی مانند شمش و طلا بوده است."
                ]
            },
            {
                title: "تولید ملی فولاد رکورد جدیدی ثبت کرد",
                summary: "افزایش ظرفیت کوره‌های صنعتی داخلی امکان صادرات به بازارهای نوظهور را فراهم کرده است.",
                content: [
                    "تلاش‌های مستمر مهندسان بومی به بهینه‌سازی زنجیره ذوب انجامید که راندمان کلی را ارتقا داد.",
                    "برنامه‌ریزی برای فازهای بعدی متمرکز بر توسعه بازارهای هدف در خاورمیانه و شمال آفریقا است."
                ]
            }
        ],
        en: [
            {
                title: "Stock Indices Climb as Capital Routes to Production",
                summary: "Financial analysts suggest that fresh inflows into growth funds will drive industrial recovery.",
                content: [
                    "Following new regulatory rollouts simplifying small-retail trades, daily volumes peaked this week.",
                    "Experts believe this could secure medium-term stability and shield capital pools from inflation."
                ]
            },
            {
                title: "Transit Border Trade Volume Experiences Substantial Expansion",
                summary: "Upgraded customs infrastructure significantly accelerated non-oil export processing.",
                content: [
                    "Official metrics highlight a major drop in cargo clearance times due to digital customs pipelines.",
                    "Private logistics operators welcomed the shift, increasing shipping investments in southern hubs."
                ]
            },
            {
                title: "Gold Spot Markets Fluctuate Post Federal Reserve Committee",
                summary: "Decisions on interest rates sparked a fresh wave of consolidation across safe-haven assets.",
                content: [
                    "Commodity traders are closely monitoring open market briefings to map forthcoming yield directions.",
                    "Lower treasury yields historically provide a strong tailwind for bullion and precious metals."
                ]
            },
            {
                title: "National Steel Production Capacity Hits Historic Milestones",
                summary: "Integration of modern smelting techniques allowed local manufacturers to target emerging markets.",
                content: [
                    "Technical enhancements optimized fuel consumption, increasing output efficiency across plants.",
                    "Future roadmap phases focus heavily on securing long-term export partnerships in European regions."
                ]
            }
        ]
    },
    Politics: {
        fa: [
            {
                title: "امضای معاهده چندجانبه توسعه پایدار منطقه‌ای",
                summary: "سران کشورهای همسایه بر حفظ ثبات سیاسی و افزایش تعاملات امنیتی-اقتصادی توافق کردند.",
                content: [
                    "این مذاکرات فشرده دیپلماتیک که در پایتخت برگزار شد، گشایش‌های جدی در تسهیل آمدوشد کالاها پدید آورد.",
                    "نمایندگان کشورهای عضو بر لزوم حل مسالمت‌آمیز مسائل مرزی و پرهیز از تنش پافشاری کردند."
                ]
            },
            {
                title: "نشست اضطراری شورای امنیت پیرامون حقوق بین‌الملل",
                summary: "اعضای دائم شورا خواستار احترام به حاکمیت کشورها و بازگشت به میز گفت‌وگو شدند.",
                content: [
                    "دبیرکل در بیانیه خود تأکید کرد که دیپلماسی فعال تنها کلید گشایش بن‌بست‌های ژئوپلیتیک کنونی است.",
                    "تلاش‌ها برای تعلیق اقدامات یکجانبه و دستیابی به آتش‌بس‌های پایدار همچنان در جریان است."
                ]
            },
            {
                title: "توسعه همکاری‌های دیپلماتیک با قطب‌های جدید اقتصادی جهان",
                summary: "سفر رسمی هیئت بلندپایه وزارت امور خارجه به کشورهای آمریکای لاتین و آفریقا ثمرات جدی داشت.",
                content: [
                    "امضای پیش‌نویس اسناد تجاری و همکاری‌های راهبردی، افق‌های جدیدی برای بازرگانان ایرانی ترسیم کرد.",
                    "مشارکت در طرح‌های چندجانبه می‌تواند نفوذ اقتصادی و دیپلماتیک کشور را تا حد زیادی اعتلا بخشد."
                ]
            },
            {
                title: "تصویب لایحه حمایت از شفافیت اداری و تسهیل خدمات عمومی",
                summary: "مجلس شورای اسلامی با اکثریت آرا، قوانین سخت‌گیرانه‌ای برای مبارزه با فساد وضع کرد.",
                content: [
                    "این مصوبه کلیه نهادهای دولتی را موظف به بارگذاری اطلاعات قراردادها در سامانه شفافیت می‌کند.",
                    "طراحان قانون امیدوارند اجرای آن به افزایش اعتماد مردمی و بهینه‌سازی هزینه‌ها منجر شود."
                ]
            }
        ],
        en: [
            {
                title: "Multilateral Regional Development Treaties Signed Successfully",
                summary: "Neighboring state leaders reached a historic consensus on mutual economic security cooperation.",
                content: [
                    "The diplomatic conference resolved complex tariff challenges and streamlined customs procedures.",
                    "A joint declaration highlighted the priority of peaceful border governance and non-intervention."
                ]
            },
            {
                title: "UN Security Council Convenes Emergency Brief on Sovereignty",
                summary: "Permanent members called for complete compliance with international maritime laws.",
                content: [
                    "The Secretary-General stressed that active negotiation is the sole tool to prevent escalations.",
                    "Diplomatic channels remain open to suspend unilateral sanctions and secure permanent ceasefires."
                ]
            },
            {
                title: "Foreign Ministry Expands Relations with Emerging Global Powers",
                summary: "Strategic tours across Latin America and African hubs yielded high-value industrial pacts.",
                content: [
                    "The bilateral accords open new avenues for trade, specifically in agriculture and energy.",
                    "Such alliances are expected to diversify economic relationships and bypass conventional bottlenecks."
                ]
            },
            {
                title: "National Transparency Bill Approved with Substantial Majority",
                summary: "The legislative chamber enacted strict anti-corruption audits for public departments.",
                content: [
                    "The law mandates real-time publishing of all major governmental contracts and tender criteria.",
                    "Proponents believe the framework will dramatically enhance administrative efficiency and accountability."
                ]
            }
        ]
    },
    Tech: {
        fa: [
            {
                title: "رونمایی از ابررایانه جدید پردازش داده‌های هوش مصنوعی",
                summary: "این دستاورد تکنولوژیک، توانایی پردازش مدل‌های زبانی بزرگ را با سرعت فوق‌العاده فراهم می‌کند.",
                content: [
                    "مهندسان حوزه سخت‌افزار با موازی‌سازی خوشه‌های پردازشی توانستند مصرف انرژی را به نصف کاهش دهند.",
                    "این سیستم قرار است در تحلیل داده‌های بیولوژیکی و پیش‌بینی وضعیت آب‌وهوایی کلان به کار گرفته شود."
                ]
            },
            {
                title: "بومی‌سازی تجهیزات فیبر نوری با بازدهی بالا",
                summary: "یک شرکت دانش‌بنیان داخلی موفق شد کابل‌های انتقال اطلاعات نوری با پهنای باند وسیع تولید کند.",
                content: [
                    "تست‌های اولیه در شبکه‌های زیرساختی کشور نشان‌دهنده پایداری سیگنال در فواصل طولانی است.",
                    "کاهش هزینه‌های راه‌اندازی اینترنت فوق‌سریع برای منازل، بزرگ‌ترین دستاورد تجاری این طرح است."
                ]
            },
            {
                title: "پیشرفت شگرف در طراحی باتری‌های حالت جامد",
                summary: "نسل جدید باتری‌ها می‌تواند زمان شارژ خودروهای برقی را به کمتر از ۱۰ دقیقه کاهش دهد.",
                content: [
                    "استفاده از الکترولیت‌های جامد نه‌تنها چگالی انرژی را افزایش داده، بلکه خطر حریق را کاملاً رفع کرده است.",
                    "چندین خودروساز بزرگ جهان برای ادغام این فناوری در مدل‌های آینده خود قرارداد بسته‌اند."
                ]
            },
            {
                title: "کشف آسیب‌پذیری بحرانی در سیستم‌های رمزگذاری جهانی",
                summary: "کمیته امنیت سایبری بین‌المللی پچ‌های اصلاحی فوری برای حفاظت از سرورهای بانکی ارائه داد.",
                content: [
                    "این حفره امنیتی می‌توانست دسترسی غیرمجاز به اطلاعات تراکنش‌ها را در سطح وسیع ممکن سازد.",
                    "کارشناسان از مدیران شبکه خواسته‌اند تا سیستم‌های خود را بدون تأخیر به‌روزرسانی کنند."
                ]
            }
        ],
        en: [
            {
                title: "Next-Gen Supercomputer Unveiled for Large Language Models",
                summary: "The hardware breakthrough offers unprecedented processing speeds for deep neural network training.",
                content: [
                    "Computer scientists successfully optimized multi-cluster nodes, slicing power consumption by 50%.",
                    "The infrastructure is slated to process large-scale genome datasets and global climate simulations."
                ]
            },
            {
                title: "Bespoke Fiber Optic Solutions Enter Commercial Production",
                summary: "Tech firms introduced high-throughput fiber cabling that minimizes signal attenuation.",
                content: [
                    "Field tests across major municipal backbones confirmed high signal fidelity over long distances.",
                    "The achievement will sharply reduce deployment costs for ultra-broadband home connections."
                ]
            },
            {
                title: "Solid-State Battery Tech Breakthrough Redefines Charging Speeds",
                summary: "New solid electrolyte systems promise to recharge electric vehicles in under ten minutes.",
                content: [
                    "Denser energy packing combined with advanced thermal resilience eliminates explosive risks entirely.",
                    "Automotive giants have already secured joint venture contracts to adopt the solid-state cells."
                ]
            },
            {
                title: "Critical Vulnerability Discovered in Core Web Encryption Protocols",
                summary: "Cybersecurity task forces issued emergency patches to safeguard transaction ledgers.",
                content: [
                    "The zero-day exploit could have allowed deep packet inspections and token thefts at scale.",
                    "Administrators are urged to deploy the cryptographic updates immediately to secure client portals."
                ]
            }
        ]
    },
    Sports: {
        fa: [
            {
                title: "درخشش ملی‌پوشان در مسابقات جهانی و تصاحب مدال‌های طلا",
                summary: "ورزشکاران ایرانی با غلبه بر حریفان قدرتمند خود، سرود ملی را در تالار افتخارات طنین‌انداز کردند.",
                content: [
                    "تمرینات منسجم تیمی و هدایت فنی هوشمندانه، عامل اصلی این نتایج درخشان ارزیابی شده است.",
                    "هواداران با حضور پرشور در فرودگاه، استقبال شایانی از قهرمانان خود به عمل آوردند."
                ]
            },
            {
                title: "مجهز شدن استادیوم‌های بزرگ به آخرین نسل سیستم کمک‌داور ویدئویی",
                summary: "فدراسیون فوتبال از بکارگیری فناوری‌های نوین داوری برای افزایش دقت و سلامت مسابقات خبر داد.",
                content: [
                    "این طرح که با همکاری شرکت‌های فنی پیاده شده، اشتباهات تأثیرگذار داوری را به حداقل می‌رساند.",
                    "باشگاه‌ها با ابراز خرسندی، این گام را مبنای عدالت بیشتر در مستطیل سبز دانسته‌اند."
                ]
            },
            {
                title: "مصدومیت ستاره فوتبال جهان و دوری طولانی‌مدت از میادین",
                summary: "پزشکان باشگاه اعلام کردند مهاجم طراز اول به دلیل آسیب زانو باید جراحی شود.",
                content: [
                    "این خبر شوک بزرگی به کادر فنی و هوادارانی وارد کرد که در تب‌وتاب بازی‌های حذفی هستند.",
                    "برنامه بازتوانی این بازیکن بلافاصله پس از جراحی آغاز خواهد شد تا سریع‌تر بازگردد."
                ]
            },
            {
                title: "برگزاری اولین المپیاد ورزش‌های دیجیتال و استقبال پرشور جوانان",
                summary: "این رقابت‌ها با مشارکت تیم‌های بین‌المللی و در سطح استانداردهای جهانی برگزار شد.",
                content: [
                    "بازی‌های رایانه‌ای و استراتژیک شبیه‌سازی‌شده، مهارت‌های شناختی شرکت‌کنندگان را به چالش کشید.",
                    "جوایز ارزنده‌ای به نفرات برتر اهدا شد و فدراسیون وعده برگزاری دوره‌های بعدی را داد."
                ]
            }
        ],
        en: [
            {
                title: "National Athletes Dominate World Arena, Securing Gold Medals",
                summary: "Competitors triumphed over elite opponents, lifting national banners at the victory podium.",
                content: [
                    "Intense preparation regimes and optimized coaching strategies are credited for the historic sweeps.",
                    "Supporters gathered in thousands to welcome the champions back at the metropolitan terminal."
                ]
            },
            {
                title: "Premier Stadiums Complete Deployment of Modern VAR Systems",
                summary: "The football association announced high-tech camera integration to ensure maximum fairness.",
                content: [
                    "Developed in tandem with media partners, the setup effectively eliminates major officiating errors.",
                    "Clubs applauded the modernization, citing it as a major pillar for sporting integrity."
                ]
            },
            {
                title: "Top Football Star Sidelined Following Severe Knee Ligament Damage",
                summary: "Club clinicians confirmed the prolific striker requires reconstruction surgery and lengthy recovery.",
                content: [
                    "The announcement disappointed the coaching staff ahead of the highly anticipated knockout rounds.",
                    "A tailored physical therapy regimen is scheduled post-operation to aid his return next season."
                ]
            },
            {
                title: "Inaugural Digital Esports Championship Records Unprecedented Reach",
                summary: "The competitive event drew professional teams globally, establishing massive viewership numbers.",
                content: [
                    "Strategy and tactical simulation categories tested cognitive execution speeds of young talent.",
                    "Organizers awarded major prize pools and committed to making the championship an annual milestone."
                ]
            }
        ]
    },
    Social: {
        fa: [
            {
                title: "کمپین ملی محیط‌زیست برای احیای جنگل‌های هیرکانی",
                summary: "با مشارکت هزاران داوطلب مردمی و نهادهای مدنی، کاشت گونه‌های درختی بومی آغاز شد.",
                content: [
                    "این اقدام نقش حیاتی در جلوگیری از فرسایش خاک و حفظ تنوع زیستی بی‌نظیر منطقه دارد.",
                    "کارگاه‌های آموزشی متعددی نیز برای جوامع محلی جهت صیانت از درختان جوان برگزار گردید."
                ]
            },
            {
                title: "کاهش شیوع بیماری‌های فصلی با واکسیناسیون همگانی و رایگان",
                summary: "مراکز بهداشت سراسر کشور از اجرای موفقیت‌آمیز فاز اول پیشگیری خبر دادند.",
                content: [
                    "دسترسی آسان و توزیع عادلانه دوزهای درمانی منجر به افزایش ایمنی عمومی شده است.",
                    "پزشکان همچنان بر رعایت اصول بهداشتی در فضاهای بسته تأکید ویژه دارند."
                ]
            },
            {
                title: "طرح کارآفرینی زنان سرپرست خانوار با تکیه بر صنایع دستی بومی",
                summary: "راه‌اندازی بازارچه‌های آنلاین فروش مستقیم، درآمد ثابتی برای صدها خانواده ایجاد کرد.",
                content: [
                    "تسهیلات بانکی کم‌بهره به بافندگان و سفالگران محلی امکان توسعه کارگاه‌ها را بخشیده است.",
                    "این مدل حمایتی نمونه‌ای موفق از توانمندسازی اقتصادی جامعه‌محور به شمار می‌آید."
                ]
            },
            {
                title: "توسعه بوستان‌های دوستدار کودک و ارتقای فضاهای سبز شهری",
                summary: "شهرداری‌ها با طراحی پارک‌های خلاقانه به ارتقای شادابی و نشاط کودکان کمک کردند.",
                content: [
                    "استفاده از سازه‌های چوبی ایمن و ایجاد باغ‌های گل تعاملی، رضایت والدین را جلب کرده است.",
                    "این پروژه‌ها با هدف برقراری توازن زیست‌محیطی در کلان‌شهرها توسعه می‌یابند."
                ]
            }
        ],
        en: [
            {
                title: "National Ecological Initiative to Restore Ancient Forest Lands",
                summary: "Thousands of civic volunteers and green agencies joined forces to plant native tree species.",
                content: [
                    "The campaign plays a critical role in halting topsoil erosion and preserving local biodiversity.",
                    "Educational seminars were conducted to instruct local farming groups on eco-safe forestry practices."
                ]
            },
            {
                title: "Universal Vaccination Drive Slashes Seasonal Infection Metrics",
                summary: "Healthcare ministries reported highly successful metrics in rural and urban community centers.",
                content: [
                    "Equitable distribution and zero-cost accessibility catalyzed rapid public immunization thresholds.",
                    "Clinicians continue to advise basic sanitary vigilance in heavily crowded public settings."
                ]
            },
            {
                title: "Community Program Empowers Artisan Women in Cottage Industries",
                summary: "Direct online marketplace platforms provided steady livelihoods for hundreds of local families.",
                content: [
                    "Micro-credit options helped rural weavers and ceramic craftspeople scale production workshops.",
                    "The model demonstrates a highly successful blueprint for sustainable, grassroots economic growth."
                ]
            },
            {
                title: "Smart Recreational Playgrounds Enliven Dense Metropolitan Sectors",
                summary: "Municipal projects redesigned open city lots into interactive green areas for families.",
                content: [
                    "Integrating safe natural materials and interactive flora displays received warm parent feedback.",
                    "The initiatives are key parts of the master plan to neutralize air pollution in urban centers."
                ]
            }
        ]
    }
};

const generateMasterNewsFeed = (isFa: boolean, likesState: Record<string, number>): NewsItem[] => {
    const categories: ('Economy' | 'Politics' | 'Tech' | 'Sports' | 'Social')[] = ['Economy', 'Politics', 'Tech', 'Sports', 'Social'];
    const regions: ('Iran' | 'Global')[] = ['Iran', 'Global'];
    const news: NewsItem[] = [];
    
    // Generate exactly 200 unique news items (20 per page * 10 pages)
    for (let idx = 0; idx < 200; idx++) {
        const cat = categories[idx % categories.length];
        const reg = regions[idx % regions.length];
        
        const templatesFa = NEWS_SUBJECTS[cat].fa;
        const templatesEn = NEWS_SUBJECTS[cat].en;
        const templateIdx = Math.floor(idx / categories.length) % templatesFa.length;
        
        const baseFa = templatesFa[templateIdx];
        const baseEn = templatesEn[templateIdx];
        
        const itemNumber = Math.floor(idx / 10) + 1;
        const regionLabelFa = reg === 'Iran' ? ' (تحلیل داخلی)' : ' (گزارش بین‌الملل)';
        const regionLabelEn = reg === 'Iran' ? ' (Domestic Briefing)' : ' (Global Analysis)';
        
        const titleFa = `${baseFa.title} - شماره ${itemNumber}${regionLabelFa}`;
        const titleEn = `${baseEn.title} - Vol. ${itemNumber}${regionLabelEn}`;
        
        const summaryFa = `[تفسیر اختصاصی] ${baseFa.summary} این رویداد در صدر توجه فعالان اجتماعی و رسانه‌ها قرار گرفته است.`;
        const summaryEn = `[Exclusive Commentary] ${baseEn.summary} This development remains a primary focus for media correspondents globally.`;
        
        const imagesList = [
            'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
        ];
        
        const id = `news-item-${idx + 1}`;
        const likes = likesState[id] !== undefined ? likesState[id] : (120 + (idx * 7) % 85);
        
        news.push({
            id,
            title: isFa ? titleFa : titleEn,
            summary: isFa ? summaryFa : summaryEn,
            content: isFa ? baseFa.content : baseEn.content,
            source: isFa ? (reg === 'Iran' ? 'خبرگزاری ایرنا' : 'واحد مرکزی خبر') : (reg === 'Iran' ? 'IRNA News' : 'Reuters Dispatch'),
            time: `${Math.floor(1 + (idx * 3) % 12)} ${isFa ? 'ساعت پیش' : 'hours ago'}`,
            category: cat,
            urgent: idx % 15 === 0,
            readTime: 2 + (idx % 4),
            region: reg,
            image: imagesList[idx % imagesList.length],
            videoTitle: isFa ? `گزارش مستند تصویری پیرامون ${baseFa.title}` : `Video Broadcast on ${baseEn.title}`,
            author: isFa ? `تحریریه کالا۲۴` : `Kala Editorial Desk`,
            views: 450 + (idx * 23) % 911,
            likes
        });
    }
    
    return news;
};

const News: React.FC = () => {
    const { language } = useLanguage();
    const isFa = language === 'fa';
    const { isDark } = useTheme();

    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
    const [likesState, setLikesState] = useState<Record<string, number>>({});
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [cmtName, setCmtName] = useState('');
    const [cmtText, setCmtText] = useState('');
    const [comments, setComments] = useState<Record<string, { id: string; name: string; text: string; date: string }[]>>({});
    const [isVidPlaying, setIsVidPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [vidVolume, setVidVolume] = useState(80);
    const [vidProgress, setVidProgress] = useState(0);

    const [livePrices, setLivePrices] = useState({
        btc: { price: 64180, change: 1.85 },
        gold: { price: 2345, change: 0.95 },
        silver: { price: 30.55, change: 1.22 },
        oil: { price: 88.40, change: -0.42 },
        nobitex: { priceToman: 187740, priceRial: 1877400, change: 0.12 },
        ramzinex: { priceToman: 187800, priceRial: 1878000, change: 0.15 }
    });

    const itemsPerPage = 20;

    // --- EFFECT: REAL-TIME WORLD CLOCK ---
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // --- EFFECT: REAL-TIME PRICES (Nobitex & Ramzinex Sim) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setLivePrices(prev => {
                const btcDelta = (Math.random() - 0.5) * 35;
                const goldDelta = (Math.random() - 0.5) * 1.5;
                const silverDelta = (Math.random() - 0.5) * 0.05;
                const oilDelta = (Math.random() - 0.5) * 0.1;
                
                // For dollar, small realistic steps: ±10 to ±40 Tomans around 187,800 Tomans
                const nobitexDeltaToman = Math.round((Math.random() - 0.5) * 40);
                const ramzinexDeltaToman = Math.round((Math.random() - 0.5) * 40);
                
                const nextNobitexToman = Math.max(180000, Math.min(195000, prev.nobitex.priceToman + nobitexDeltaToman));
                const nextRamzinexToman = Math.max(180000, Math.min(195000, prev.ramzinex.priceToman + ramzinexDeltaToman));

                return {
                    btc: {
                        price: Number((prev.btc.price + btcDelta).toFixed(1)),
                        change: Number((prev.btc.change + (Math.random() - 0.5) * 0.05).toFixed(2))
                    },
                    gold: {
                        price: Number((prev.gold.price + goldDelta).toFixed(2)),
                        change: Number((prev.gold.change + (Math.random() - 0.5) * 0.02).toFixed(2))
                    },
                    silver: {
                        price: Number((prev.silver.price + silverDelta).toFixed(2)),
                        change: Number((prev.silver.change + (Math.random() - 0.5) * 0.02).toFixed(2))
                    },
                    oil: {
                        price: Number((prev.oil.price + oilDelta).toFixed(2)),
                        change: Number((prev.oil.change + (Math.random() - 0.5) * 0.02).toFixed(2))
                    },
                    nobitex: {
                        priceToman: nextNobitexToman,
                        priceRial: nextNobitexToman * 10,
                        change: Number((prev.nobitex.change + (Math.random() - 0.5) * 0.01).toFixed(2))
                    },
                    ramzinex: {
                        priceToman: nextRamzinexToman,
                        priceRial: nextRamzinexToman * 10,
                        change: Number((prev.ramzinex.change + (Math.random() - 0.5) * 0.01).toFixed(2))
                    }
                };
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- MEMOIZED DERIVED STATES ---
    const dates = useMemo(() => getFormattedDates(), []);
    const prayerTimes = useMemo(() => getTehranPrayerTimes(currentTime), [currentTime]);
    const dailyQuote = useMemo(() => getDailyQuote(), []);
    const historicalEvents = useMemo(() => getDailyHistoricalEvents(isFa), [isFa]);

    const newsFeed = useMemo(() => {
        return generateMasterNewsFeed(isFa, likesState);
    }, [isFa, likesState]);

    const filteredNews = useMemo(() => {
        let result = newsFeed;
        if (activeTab !== 'All') {
            result = result.filter(n => n.category === activeTab);
        }
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            result = result.filter(n => 
                n.title.toLowerCase().includes(query) || 
                n.summary.toLowerCase().includes(query)
            );
        }
        return result;
    }, [newsFeed, activeTab, searchTerm]);

    const categories = [
        { id: 'All', icon: <Globe className="w-4 h-4" />, label: isFa ? 'همه اخبار' : 'All News' },
        { id: 'Economy', icon: <TrendingUp className="w-4 h-4" />, label: isFa ? 'اقتصادی' : 'Economy' },
        { id: 'Politics', icon: <Satellite className="w-4 h-4" />, label: isFa ? 'سیاسی' : 'Politics' },
        { id: 'Tech', icon: <Cpu className="w-4 h-4" />, label: isFa ? 'تکنولوژی' : 'Tech' },
        { id: 'Sports', icon: <Trophy className="w-4 h-4" />, label: isFa ? 'ورزشی' : 'Sports' },
        { id: 'Social', icon: <Leaf className="w-4 h-4" />, label: isFa ? 'اجتماعی' : 'Social' }
    ];

    // --- ACTIONS ---
    const toggleBookmark = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setBookmarkedIds(prev => 
            prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
        );
    };

    const handleLike = (id: string) => {
        setLikesState(prev => {
            const currentLikes = prev[id] !== undefined ? prev[id] : newsFeed.find(n => n.id === id)?.likes || 120;
            return { ...prev, [id]: currentLikes + 1 };
        });
        if (selectedNews && selectedNews.id === id) {
            setSelectedNews(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
        }
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedNews || !cmtName.trim() || !cmtText.trim()) return;

        const newComment = {
            id: `cmt-${Date.now()}`,
            name: cmtName,
            text: cmtText,
            date: isFa ? 'هم‌اکنون' : 'Just Now'
        };

        setComments(prev => ({
            ...prev,
            [selectedNews.id]: [newComment, ...(prev[selectedNews.id] || [])]
        }));

        setCmtName('');
        setCmtText('');
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
            isDark ? 'bg-[#020202] text-white selection:bg-red-500/20' : 'bg-slate-50 text-slate-900 selection:bg-red-500/10'
        }`} id="news-page-root">
            <Header />

            {/* --- 1. DYNAMIC TICKER (Matched to standard grid width) --- */}
            <div className={`border-b transition-colors duration-300 ${
                isDark ? 'bg-[#0A0D14] border-white/5' : 'bg-white border-slate-200/80 shadow-sm'
            }`} id="live-markets-ticker">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 font-mono text-red-500 font-black tracking-wide animate-pulse uppercase">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{isFa ? 'بازار زنده' : 'Live Markets'}</span>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-center" dir={isFa ? 'rtl' : 'ltr'}>
                        <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-gray-400 font-medium">{isFa ? 'بیت‌کوین:' : 'BTC:'}</span>
                            <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                ${livePrices.btc.price.toLocaleString()}
                            </span>
                            <span className={`font-mono text-[10px] ${livePrices.btc.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {livePrices.btc.change >= 0 ? '+' : ''}{livePrices.btc.change}%
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-gray-400 font-medium">{isFa ? 'انس طلا:' : 'GOLD:'}</span>
                            <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                ${livePrices.gold.price.toLocaleString()}
                            </span>
                            <span className={`font-mono text-[10px] ${livePrices.gold.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {livePrices.gold.change >= 0 ? '+' : ''}{livePrices.gold.change}%
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-gray-400 font-medium">{isFa ? 'انس نقره:' : 'SILVER:'}</span>
                            <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                ${livePrices.silver.price.toLocaleString()}
                            </span>
                            <span className={`font-mono text-[10px] ${livePrices.silver.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {livePrices.silver.change >= 0 ? '+' : ''}{livePrices.silver.change}%
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-gray-400 font-medium">{isFa ? 'نفت خام:' : 'OIL:'}</span>
                            <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                ${livePrices.oil.price.toLocaleString()}
                            </span>
                            <span className={`font-mono text-[10px] ${livePrices.oil.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {livePrices.oil.change >= 0 ? '+' : ''}{livePrices.oil.change}%
                            </span>
                        </div>
                        
                        {/* Nobitex live price */}
                        <div className={`flex items-center gap-1.5 font-bold px-3 py-0.5 border-r border-l ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                            <span className="text-red-500 font-black">{isFa ? 'دلار نوبیتکس:' : 'Nobitex USD:'}</span>
                            <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {livePrices.nobitex.priceToman.toLocaleString()} {isFa ? 'تومان' : 'T'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium font-mono">
                                ({livePrices.nobitex.priceRial.toLocaleString()} {isFa ? 'ریال' : 'R'})
                            </span>
                            <span className={`font-mono text-[10px] ${livePrices.nobitex.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {livePrices.nobitex.change >= 0 ? '+' : ''}{livePrices.nobitex.change}%
                            </span>
                        </div>

                        {/* Ramzinex live price */}
                        <div className="flex items-center gap-1.5 font-bold">
                            <span className="text-orange-500 font-black">{isFa ? 'دلار رمزینکس:' : 'Ramzinex USD:'}</span>
                            <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {livePrices.ramzinex.priceToman.toLocaleString()} {isFa ? 'تومان' : 'T'}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium font-mono">
                                ({livePrices.ramzinex.priceRial.toLocaleString()} {isFa ? 'ریال' : 'R'})
                            </span>
                            <span className={`font-mono text-[10px] ${livePrices.ramzinex.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {livePrices.ramzinex.change >= 0 ? '+' : ''}{livePrices.ramzinex.change}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN PAGE CONTENT (Perfectly aligned to max-w-7xl) --- */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="newsroom-main-container">
                
                {/* --- 2. HEADER TITLE & SEARCH PANEL (Fixing visual alignment issues) --- */}
                <div className={`pb-6 border-b transition-colors duration-300 ${
                    isDark ? 'border-white/5' : 'border-slate-200'
                }`} id="newsroom-title-section">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                                <Newspaper className="w-8 h-8 text-red-500" />
                                <span>{isFa ? 'اتاق خبر کالا ۲۴' : 'Kala Newsroom 24'}</span>
                            </h1>
                            <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                {isFa 
                                    ? 'پوشش لحظه‌ای و بی‌طرف اخبار معتبر ایران و جهان همراه با تحلیل‌های ویدیویی زنده' 
                                    : 'Real-time, comprehensive coverage of domestic and global updates with rich video reports'}
                            </p>
                        </div>
                        
                        {/* High Fidelity Search Bar */}
                        <div className="w-full md:w-80 relative">
                            <Search className="absolute top-3 start-3.5 w-4.5 h-4.5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder={isFa ? 'جستجو در آرشیو خبر...' : 'Search news archives...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full py-2.5 ps-10 pe-4 rounded-xl text-sm border focus:ring-1 outline-none transition-all duration-300 ${
                                    isDark 
                                        ? 'bg-[#0B0F19] border-white/5 text-white focus:border-red-500 focus:ring-red-500/20' 
                                        : 'bg-white border-slate-200 text-slate-800 focus:border-red-500 focus:ring-red-500/10 shadow-sm'
                                }`}
                            />
                        </div>
                    </div>
                </div>

                {/* --- GLOBAL CLOCKS & PRAYER TIMES widget --- */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 rounded-2xl border transition-all duration-300 ${
                    isDark 
                        ? 'bg-[#0A0D14] border-white/5 shadow-inner' 
                        : 'bg-white border-slate-200/80 shadow-sm'
                }`} id="global-dashboard-header">
                    {/* Column 1: Dates & Iranian Solar Calendar */}
                    <div className="space-y-3 flex flex-col justify-center border-b lg:border-b-0 lg:border-e border-dashed pb-4 lg:pb-0 lg:pe-6 border-gray-500/20">
                        <div className="flex items-center gap-2.5 text-red-500 font-bold">
                            <Calendar className="w-5 h-5" />
                            <span className="text-xs uppercase tracking-wider font-black">{isFa ? 'تقویم و مناسبت روز' : 'Calendar & Schedule'}</span>
                        </div>
                        <div className="space-y-1">
                            <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                {isFa ? dates.shamsi : dates.gregorian}
                            </h2>
                            <p className="text-xs text-gray-400 font-medium">
                                {isFa ? dates.gregorian : dates.shamsi}
                            </p>
                            <p className="text-[11px] text-red-500 font-bold mt-1">
                                {isFa ? 'رخداد امروز: گرامیداشت روز فناوری و رسانه' : 'Today: Media & Tech Day Celebration'}
                            </p>
                        </div>
                    </div>

                    {/* Column 2: World Clocks Running in Real-Time */}
                    <div className="space-y-3 flex flex-col justify-center border-b lg:border-b-0 lg:border-e border-dashed pb-4 lg:pb-0 lg:pe-6 border-gray-500/20">
                        <div className="flex items-center gap-2.5 text-red-500 font-bold">
                            <Clock className="w-5 h-5" />
                            <span className="text-xs uppercase tracking-wider font-black">{isFa ? 'ساعت‌های هماهنگ جهانی' : 'Coordinated World Clocks'}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2 font-mono text-center">
                            <div className="p-1.5 rounded-lg bg-black/20">
                                <div className="text-xs font-black text-red-500">
                                    {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold mt-1">{isFa ? 'تهران' : 'THR'}</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-black/20">
                                <div className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {new Date(currentTime.getTime() - 3.5 * 3600000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold mt-1">{isFa ? 'لندن' : 'LON'}</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-black/20">
                                <div className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {new Date(currentTime.getTime() - 8.5 * 3600000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold mt-1">{isFa ? 'نیویورک' : 'NYC'}</div>
                            </div>
                            <div className="p-1.5 rounded-lg bg-black/20">
                                <div className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                    {new Date(currentTime.getTime() + 5.5 * 3600000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-[9px] text-gray-400 font-bold mt-1">{isFa ? 'توکیو' : 'TYO'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Iranian Islamic Prayer Times (ساعات شرعی تهران) */}
                    <div className="space-y-3 flex flex-col justify-center">
                        <div className="flex items-center gap-2.5 text-red-500 font-bold">
                            <Activity className="w-5 h-5 animate-pulse" />
                            <span className="text-xs uppercase tracking-wider font-black">{isFa ? 'ساعات شرعی به افق تهران' : 'Tehran Prayer Times'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
                            <div className="p-1 rounded bg-black/10 border border-white/5">
                                <div className="text-gray-400 font-bold">{isFa ? 'اذان صبح' : 'Fajr'}</div>
                                <div className="font-black text-red-500 text-xs mt-0.5">{prayerTimes.fajr}</div>
                            </div>
                            <div className="p-1 rounded bg-black/10 border border-white/5">
                                <div className="text-gray-400 font-bold">{isFa ? 'طلوع آفتاب' : 'Sunrise'}</div>
                                <div className={`font-black text-xs mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{prayerTimes.sunrise}</div>
                            </div>
                            <div className="p-1 rounded bg-black/10 border border-white/5">
                                <div className="text-gray-400 font-bold">{isFa ? 'اذان ظهر' : 'Dhuhr'}</div>
                                <div className="font-black text-red-500 text-xs mt-0.5">{prayerTimes.dhuhr}</div>
                            </div>
                            <div className="p-1 rounded bg-black/10 border border-white/5">
                                <div className="text-gray-400 font-bold">{isFa ? 'غروب آفتاب' : 'Sunset'}</div>
                                <div className={`font-black text-xs mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{prayerTimes.sunset}</div>
                            </div>
                            <div className="p-1 rounded bg-black/10 border border-white/5">
                                <div className="text-gray-400 font-bold">{isFa ? 'اذان مغرب' : 'Maghrib'}</div>
                                <div className="font-black text-red-500 text-xs mt-0.5">{prayerTimes.maghrib}</div>
                            </div>
                            <div className="p-1 rounded bg-black/10 border border-white/5">
                                <div className="text-gray-400 font-bold">{isFa ? 'نیمه‌شب' : 'Midnight'}</div>
                                <div className={`font-black text-xs mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{prayerTimes.midnight}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8" id="news-grid-columns">
                    
                    {/* --- LEFT COLUMN: MAIN NEWS FEED --- */}
                    <div className="lg:w-3/4 space-y-6" id="news-feed-column">
                        
                        {/* Category Buttons Slider */}
                        <div className="flex items-center justify-between" id="categories-slider">
                            <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar w-full">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setActiveTab(cat.id);
                                            setCurrentPage(1);
                                        }}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                            activeTab === cat.id 
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-900/10' 
                                                : isDark 
                                                    ? 'bg-[#0A0D14] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5' 
                                                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm'
                                        }`}
                                    >
                                        {cat.icon}
                                        <span>{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* News List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="news-items-grid">
                            {filteredNews.length === 0 ? (
                                <div className="col-span-full text-center py-16 text-gray-400 font-medium" id="no-news-placeholder">
                                    {isFa ? 'خبر جدیدی با عبارت جستجو شده یافت نشد.' : 'No news matches your search criteria.'}
                                </div>
                            ) : (
                                filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => setSelectedNews(item)}
                                        className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer group hover:-translate-y-1 p-6 ${
                                            isDark 
                                                ? 'bg-[#0A0D14] border-white/5 hover:border-white/15 hover:bg-[#0E121C]' 
                                                : 'bg-white border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 hover:bg-slate-50/55'
                                        }`}
                                    >
                                        {/* Details Body - Strictly Text summary (title + text) only inside cards */}
                                        <div className="space-y-4">
                                            {/* Meta Info */}
                                            <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-bold tracking-wide text-red-500 uppercase">
                                                <span className="bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10 font-black">
                                                    {isFa ? item.category === 'Economy' ? 'اقتصادی' : item.category === 'Politics' ? 'سیاسی' : item.category === 'Tech' ? 'تکنولوژی' : item.category === 'Sports' ? 'ورزشی' : 'اجتماعی' : item.category}
                                                </span>
                                                <span className={isDark ? 'text-gray-700' : 'text-slate-300'}>•</span>
                                                <span className="flex items-center gap-1 text-gray-400">
                                                    <Clock className="w-3 h-3" /> {item.time}
                                                </span>
                                                <span className={isDark ? 'text-gray-700' : 'text-slate-300'}>•</span>
                                                <span className="text-blue-500">{item.region === 'Iran' ? (isFa ? 'ایران' : 'Iran') : (isFa ? 'بین‌الملل' : 'Global')}</span>
                                                {item.urgent && (
                                                    <>
                                                        <span className={isDark ? 'text-gray-700' : 'text-slate-300'}>•</span>
                                                        <span className="text-red-600 flex items-center gap-0.5 font-black uppercase text-[9px] animate-pulse">
                                                            <Zap className="w-2.5 h-2.5 fill-current" /> {isFa ? 'فوری' : 'Urgent'}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            <div className="space-y-2 text-justify">
                                                <h3 className={`text-base font-black leading-snug transition-colors group-hover:text-red-500 ${
                                                    isDark ? 'text-white' : 'text-slate-900'
                                                }`}>
                                                    {item.title}
                                                </h3>
                                                <p className={`text-xs leading-relaxed line-clamp-3 ${
                                                    isDark ? 'text-gray-400' : 'text-slate-500'
                                                }`}>
                                                    {item.summary}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className={`pt-4 mt-4 border-t flex justify-between items-center text-xs font-bold ${
                                            isDark ? 'border-white/5 text-gray-500' : 'border-slate-100 text-slate-400'
                                        }`}>
                                            <span className="flex items-center gap-1 font-mono text-[11px]">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                                {item.source}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={(e) => toggleBookmark(item.id, e)}
                                                    className={`p-1 hover:text-red-500 transition-colors cursor-pointer`}
                                                >
                                                    <Bookmark className={`w-4 h-4 ${bookmarkedIds.includes(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLike(item.id);
                                                    }}
                                                    className="p-1 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                    <span>{item.likes}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* --- PAGINATION CONTROLS (10 pages) --- */}
                        {filteredNews.length > itemsPerPage && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-dashed border-gray-500/20" id="news-pagination-bar">
                                <div className="text-xs font-bold text-gray-400">
                                    {isFa 
                                        ? `نمایش اخبار ${(currentPage - 1) * itemsPerPage + 1} تا ${Math.min(currentPage * itemsPerPage, filteredNews.length)} از ${filteredNews.length} خبر` 
                                        : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredNews.length)} of ${filteredNews.length} entries`}
                                </div>
                                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1" dir="ltr">
                                    {/* Prev Button */}
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        className={`px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                                            currentPage === 1
                                                ? 'opacity-40 cursor-not-allowed border-gray-500/10 text-gray-500'
                                                : isDark 
                                                    ? 'border-white/5 text-white hover:bg-white/5' 
                                                    : 'border-slate-200 text-slate-800 bg-white hover:bg-slate-100 shadow-sm'
                                        }`}
                                    >
                                        {isFa ? 'قبلی' : 'Prev'}
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from({ length: Math.ceil(filteredNews.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 rounded-xl border text-xs font-black font-mono flex items-center justify-center transition-all cursor-pointer ${
                                                currentPage === page
                                                    ? 'bg-red-600 text-white border-red-600 shadow-lg'
                                                    : isDark
                                                        ? 'border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                                                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-100 shadow-sm'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        disabled={currentPage === Math.ceil(filteredNews.length / itemsPerPage)}
                                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredNews.length / itemsPerPage), prev + 1))}
                                        className={`px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                                            currentPage === Math.ceil(filteredNews.length / itemsPerPage)
                                                ? 'opacity-40 cursor-not-allowed border-gray-500/10 text-gray-500'
                                                : isDark 
                                                    ? 'border-white/5 text-white hover:bg-white/5' 
                                                    : 'border-slate-200 text-slate-800 bg-white hover:bg-slate-100 shadow-sm'
                                        }`}
                                    >
                                        {isFa ? 'بعدی' : 'Next'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT COLUMN: SIDEBAR (Rich Dynamic Content) --- */}
                    <div className="lg:w-1/4 space-y-6" id="news-sidebar-column">
                        
                        {/* Elegant Digital Clock */}
                        <div className={`rounded-2xl border p-6 text-center relative overflow-hidden group transition-all duration-300 ${
                            isDark ? 'bg-[#0A0D14] border-white/5' : 'bg-white border-slate-200/80 shadow-sm'
                        }`} id="sidebar-clock-widget">
                            <div className="absolute inset-0 bg-red-500/[0.01] group-hover:bg-red-500/[0.03] transition-colors pointer-events-none" />
                            <div className="relative z-10 space-y-4">
                                <div className="text-3xl font-black font-mono text-red-500 tracking-widest">
                                    {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                                <div className="text-[10px] tracking-widest uppercase font-black text-gray-500">{isFa ? 'زمان هماهنگ پایتخت' : 'Capital Concordant Time'}</div>
                                <div className={`grid grid-cols-1 gap-2.5 text-xs border-t pt-4 font-bold ${
                                    isDark ? 'border-white/5' : 'border-slate-100'
                                }`}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">{isFa ? 'تقویم خورشیدی' : 'Shamsi'}</span>
                                        <span className={isDark ? 'text-white font-mono' : 'text-slate-800'}>{dates.shamsi}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500">{isFa ? 'تقویم میلادی' : 'Gregorian'}</span>
                                        <span className="text-red-500 font-mono">{dates.gregorian}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* On This Day Historical Events (Changes every day!) */}
                        <div className={`rounded-2xl border p-6 space-y-4 transition-all duration-300 ${
                            isDark ? 'bg-[#0A0D14] border-white/5' : 'bg-white border-slate-200/80 shadow-sm'
                        }`} id="sidebar-historical-events">
                            <div className={`flex items-center gap-2 pb-3.5 border-b ${
                                isDark ? 'border-white/5' : 'border-slate-100'
                            }`}>
                                <History className="w-5 h-5 text-red-500 animate-pulse" />
                                <h3 className="font-black text-sm">{isFa ? 'رویدادهای تاریخی امروز' : 'On This Day'}</h3>
                            </div>
                            <div className="relative border-s border-red-500/20 ps-4 space-y-5" dir="rtl">
                                {historicalEvents.map((ev, index) => (
                                    <div key={index} className="relative text-xs">
                                        <div className="absolute -start-[21px] top-1.5 w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/10 z-10" />
                                        <span className="font-mono font-black text-red-500 block text-[11px] mb-1">{ev.year}</span>
                                        <h4 className={`font-bold mb-1 leading-snug ${isDark ? 'text-white' : 'text-slate-800'}`}>{ev.title}</h4>
                                        <p className={`leading-relaxed text-justify ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{ev.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quote of the Day (Changes every day!) */}
                        <div className={`rounded-2xl border p-6 space-y-4 relative overflow-hidden transition-all duration-300 ${
                            isDark ? 'bg-[#0A0D14] border-white/5' : 'bg-white border-slate-200/80 shadow-sm'
                        }`} id="sidebar-quote-widget">
                            <div className="absolute -end-8 -bottom-8 w-24 h-24 bg-red-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                            <div className="flex items-center gap-2">
                                <Mic2 className="w-5 h-5 text-red-500" />
                                <h3 className="font-black text-sm">{isFa ? 'سخن روز بزرگـان' : 'Daily Great Quote'}</h3>
                            </div>
                            <blockquote className="space-y-3 relative z-10 text-xs">
                                <p className={`leading-relaxed italic text-justify font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                    "{isFa ? dailyQuote.textFa : dailyQuote.textEn}"
                                </p>
                                <footer className="text-[10px] font-black text-red-500 text-end tracking-wider uppercase">
                                    — {isFa ? dailyQuote.authorFa : dailyQuote.authorEn}
                                </footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </main>

            {/* --- NEWS DETAIL MODAL (With high-fidelity simulated media player) --- */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedNews(null)}
                        id="news-reader-modal-overlay"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className={`w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden flex flex-col relative border ${
                                isDark ? 'bg-[#060810] border-white/10' : 'bg-white border-slate-200 shadow-2xl'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                            id="news-reader-modal-content"
                        >
                            {/* Modal Header */}
                            <div className={`p-4 sm:px-6 border-b flex justify-between items-center shrink-0 ${
                                isDark ? 'border-white/5 bg-[#090C14]' : 'border-slate-100 bg-slate-50'
                            }`}>
                                <div className="flex items-center gap-2 text-xs font-black uppercase text-red-500">
                                    <Newspaper className="w-4 h-4" />
                                    <span>{isFa ? 'کـامـل‌ترین بررسی رسانه‌ای' : 'Exclusive Coverage'}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedNews(null)}
                                    className={`p-1.5 rounded-full hover:scale-105 transition-transform cursor-pointer ${
                                        isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-slate-200/50 text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Container */}
                            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                
                                {/* News Main Headings */}
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-wide text-red-500">
                                        <span className="bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10">{selectedNews.category}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" /> {selectedNews.time}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="flex items-center gap-1 text-gray-500">
                                            <User className="w-3.5 h-3.5" /> {selectedNews.author}
                                        </span>
                                    </div>
                                    <h2 className={`text-xl sm:text-2xl font-black leading-tight ${
                                        isDark ? 'text-white' : 'text-slate-900'
                                    }`}>{selectedNews.title}</h2>
                                    <p className={`text-sm leading-relaxed text-justify p-4 rounded-2xl border italic ${
                                        isDark ? 'bg-white/[0.01] border-white/5 text-gray-400' : 'bg-slate-50 border-slate-100 text-slate-600'
                                    }`}>{selectedNews.summary}</p>
                                </div>

                                {/* --- PREMIUM SIMULATED VIDEO PLAYER --- */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-black text-red-500 uppercase">
                                        <Play className="w-4 h-4 fill-current animate-pulse" />
                                        <span>{isFa ? 'پخش گزارش ویدیویی مستند' : 'Video Report Broadcast'}</span>
                                    </div>

                                    <div className="aspect-video bg-black relative rounded-2xl overflow-hidden group/video border border-white/10 shadow-lg">
                                        {/* Video Backdrop */}
                                        <img 
                                            src={selectedNews.image} 
                                            alt={selectedNews.title} 
                                            referrerPolicy="no-referrer"
                                            className={`w-full h-full object-cover transition-all duration-700 ${
                                                isVidPlaying ? 'blur-[1px] brightness-[0.4] scale-102' : 'brightness-75'
                                            }`}
                                        />

                                        {/* Static Overlay with Scanning Line and Live Watermark */}
                                        {isVidPlaying && (
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent pointer-events-none animate-scan-line z-10" />
                                        )}

                                        {/* Center Large Play/Pause Toggle Overlay */}
                                        <div 
                                            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                                            onClick={() => setIsVidPlaying(!isVidPlaying)}
                                        >
                                            {!isVidPlaying ? (
                                                <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl scale-100 hover:scale-110 active:scale-95 transition-all group-hover/video:bg-red-500 ring-8 ring-red-600/20">
                                                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-2xl opacity-0 group-hover/video:opacity-100 active:scale-95 transition-all">
                                                    <Pause className="w-7 h-7 fill-current" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Top Left Video Badge */}
                                        <div className="absolute top-4 start-4 flex items-center gap-2 z-20 pointer-events-none">
                                            <div className="bg-black/60 backdrop-blur-md text-[10px] font-black tracking-widest text-white px-2.5 py-1 rounded-lg border border-white/10 uppercase flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${isVidPlaying ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                                                <span>{isVidPlaying ? (isFa ? 'در حال پخش زنده' : 'LIVE FEED') : (isFa ? 'آماده پخش' : 'READY TO PLAY')}</span>
                                            </div>
                                        </div>

                                        {/* Bottom Control Bar Overlay */}
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4 flex flex-col gap-3 z-20">
                                            
                                            {/* Interactive Progress Timeline */}
                                            <div 
                                                className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer relative group/timeline"
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const x = e.clientX - rect.left;
                                                    const pct = Math.min(Math.max((x / rect.width) * 100, 0), 100);
                                                    setVidProgress(pct);
                                                }}
                                            >
                                                {/* Active Track Progress */}
                                                <div 
                                                    className="h-full bg-red-600 rounded-full relative"
                                                    style={{ width: `${vidProgress}%` }}
                                                >
                                                    {/* Slider Handle Knob */}
                                                    <div className="absolute -right-1.5 -top-1 w-3.5 h-3.5 rounded-full bg-white shadow-md border border-red-600 opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
                                                </div>
                                            </div>

                                            {/* Controls row */}
                                            <div className="flex items-center justify-between text-white text-xs select-none">
                                                <div className="flex items-center gap-4">
                                                    <button 
                                                        onClick={() => setIsVidPlaying(!isVidPlaying)}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        {isVidPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                                                    </button>
                                                    <div className="flex items-center gap-1.5">
                                                        <button 
                                                            onClick={() => setIsMuted(!isMuted)}
                                                            className="hover:text-red-500 transition-colors"
                                                        >
                                                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                                        </button>
                                                        <input 
                                                            type="range" 
                                                            min="0" 
                                                            max="100" 
                                                            value={isMuted ? 0 : vidVolume}
                                                            onChange={(e) => {
                                                                setVidVolume(Number(e.target.value));
                                                                setIsMuted(false);
                                                            }}
                                                            className="w-16 accent-red-600 cursor-pointer h-1"
                                                        />
                                                    </div>
                                                    <span className="font-mono text-[11px] text-gray-300">
                                                        0:{Math.floor(vidProgress * 0.45).toString().padStart(2, '0')} / 0:45
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {/* Oscillating Audio Waveform (Visible only when playing) */}
                                                    {isVidPlaying && !isMuted && (
                                                        <div className="flex items-end gap-0.5 h-4 px-2">
                                                            {[...Array(6)].map((_, i) => {
                                                                const animDur = [0.6, 0.4, 0.8, 0.5, 0.7, 0.9][i];
                                                                return (
                                                                    <div 
                                                                        key={i} 
                                                                        className="w-0.75 bg-red-500 rounded-t-sm"
                                                                        style={{ 
                                                                            height: '100%', 
                                                                            animation: `soundWave ${animDur}s ease-in-out infinite alternate`
                                                                        }} 
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    <button className="hover:text-red-500 transition-colors">
                                                        <Maximize className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-[10px] text-center font-bold tracking-wider ${
                                        isDark ? 'text-gray-500' : 'text-slate-400'
                                    }`}>
                                        * {isFa ? selectedNews.videoTitle : selectedNews.videoTitle}
                                    </p>
                                </div>

                                {/* Multi-paragraph Full Body Text */}
                                <div className={`text-sm leading-relaxed text-justify space-y-4 pt-4 border-t ${
                                    isDark ? 'border-white/5 text-gray-200' : 'border-slate-100 text-slate-800'
                                }`}>
                                    {selectedNews.content.map((p, idx) => (
                                        <p key={idx} className="indent-4 font-medium">{p}</p>
                                    ))}
                                </div>

                                {/* Support Interaction Area (Like & Share) */}
                                <div className={`flex flex-wrap items-center justify-between gap-4 pt-4 border-t ${
                                    isDark ? 'border-white/5' : 'border-slate-100'
                                }`}>
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                        <span>{selectedNews.views.toLocaleString()} {isFa ? 'بازدید' : 'views'}</span>
                                        <span>•</span>
                                        <span>{isFa ? `${selectedNews.readTime} دقیقه مطالعه` : `${selectedNews.readTime} min read`}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleLike(selectedNews.id)}
                                            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            <span>{isFa ? 'مفید بود' : 'Liked'} ({selectedNews.likes})</span>
                                        </button>
                                        <button className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all cursor-pointer ${
                                            isDark 
                                                ? 'border-white/5 bg-white/5 hover:bg-white/10 text-white' 
                                                : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}>
                                            <Share2 className="w-4 h-4" />
                                            <span>{isFa ? 'اشتراک‌گذاری' : 'Share'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Interactive Comments Module */}
                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <h4 className={`text-sm font-black flex items-center gap-2 uppercase tracking-wider ${
                                        isDark ? 'text-white' : 'text-slate-900'
                                    }`}>
                                        <MessageSquare className="w-4 h-4 text-red-500" />
                                        <span>{isFa ? 'بخش نظرات و دیدگاه‌ها' : 'Comments & Discussion'}</span>
                                        <span className="text-xs text-red-500">({(comments[selectedNews.id] || []).length})</span>
                                    </h4>

                                    {/* Submit New Comment Form */}
                                    <form onSubmit={handleAddComment} className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input 
                                                type="text" 
                                                placeholder={isFa ? 'نام و نام‌خانوادگی شما...' : 'Your Name...'}
                                                value={cmtName}
                                                onChange={(e) => setCmtName(e.target.value)}
                                                required
                                                className={`w-full py-2 px-4 rounded-xl text-xs border focus:outline-none focus:ring-1 ${
                                                    isDark 
                                                        ? 'bg-[#0B0F19] border-white/5 text-white focus:border-red-500 focus:ring-red-500/20' 
                                                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-red-500 focus:ring-red-500/10'
                                                }`}
                                            />
                                        </div>
                                        <textarea 
                                            placeholder={isFa ? 'دیدگاه ارزشمند خود را در خصوص این گزارش بنویسید...' : 'Write your commentary regarding this broadcast...'}
                                            rows={3}
                                            value={cmtText}
                                            onChange={(e) => setCmtText(e.target.value)}
                                            required
                                            className={`w-full py-2 px-4 rounded-xl text-xs border focus:outline-none focus:ring-1 ${
                                                isDark 
                                                    ? 'bg-[#0B0F19] border-white/5 text-white focus:border-red-500 focus:ring-red-500/20' 
                                                    : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-red-500 focus:ring-red-500/10'
                                            }`}
                                        />
                                        <div className="flex justify-end">
                                            <button 
                                                type="submit"
                                                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                                            >
                                                {isFa ? 'ثبت و ارسال دیدگاه' : 'Submit Commentary'}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Comments List */}
                                    <div className="space-y-3">
                                        {(comments[selectedNews.id] || []).length === 0 ? (
                                            <p className={`text-xs text-center py-6 italic ${
                                                isDark ? 'text-gray-500' : 'text-slate-400'
                                            }`}>
                                                {isFa ? 'اولین نفری باشید که دیدگاه خود را ثبت می‌کند.' : 'No comments submitted yet. Share your thoughts first!'}
                                            </p>
                                        ) : (
                                            (comments[selectedNews.id] || []).map((cmt) => (
                                                <div 
                                                    key={cmt.id}
                                                    className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                                                        isDark ? 'bg-white/[0.01] border-white/5' : 'bg-slate-50/50 border-slate-100'
                                                    }`}
                                                >
                                                    <div className="flex justify-between items-center font-bold">
                                                        <span className="text-red-500 flex items-center gap-1">
                                                            <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 font-bold flex items-center justify-center text-[10px]">
                                                                {cmt.name[0]}
                                                            </div>
                                                            {cmt.name}
                                                        </span>
                                                        <span className={isDark ? 'text-gray-500' : 'text-slate-400'}>{cmt.date}</span>
                                                    </div>
                                                    <p className={`text-justify font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{cmt.text}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Support Sound Wave animation and custom scrollbars inside head */}
            <style>{`
                @keyframes soundWave {
                    0% { transform: scaleY(0.15); }
                    100% { transform: scaleY(1); }
                }
                .animate-scan-line {
                    animation: scanLine 8s linear infinite;
                }
                @keyframes scanLine {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                    height: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'};
                    border-radius: 9999px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.22)'};
                }
            `}</style>

            <Footer />
        </div>
    );
};

export default News;
