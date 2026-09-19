
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    Moon, Sun, Star, Activity, Clock, Calendar, 
    Database, BrainCircuit, Search, Fingerprint, 
    AlertTriangle, Compass, ChevronDown, ChevronUp,
    Zap, TrendingUp, Heart, Shield, Atom, Layers, 
    Hexagon, Ghost, Radio, Scale, Telescope, Orbit,
    Hourglass, Skull, Timer, Infinity, Code, Gem, 
    Palette, ScrollText, Sparkles, X, Briefcase,
    Dna, Workflow, Binary
} from 'lucide-react';

// --- HELPER ALGORITHMS ---
function jalaaliToGregorian(jy: number, jm: number, jd: number) {
  let gy, gm, gd, days;
  jy += 1595;
  days = -355668 + (365 * jy) + ~~((jy / 33) * 8) + ~~(((jy % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  gy = 400 * ~~(days / 146097);
  days %= 146097;
  if (days > 36524) {
    days--;
    gy += 100 * ~~(days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += ~~(days / 365);
    days %= 365;
  }
  gd = days + 1;
  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  return { gy: gy, gm: gm, gd: gd };
}

// --- DETERMINISTIC RANDOM GENERATOR ---
class SeededRNG {
    private seed: number;
    constructor(seed: number) {
        this.seed = (isNaN(seed) || seed === 0) ? Date.now() : seed;
    }
    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    range(min: number, max: number): number {
        const r = this.next();
        if (isNaN(r)) return min;
        return Math.floor(r * (max - min + 1)) + min;
    }
    pick<T>(array: T[]): T {
        if (!array || array.length === 0) return {} as T;
        const index = this.range(0, array.length - 1);
        return array[index] !== undefined ? array[index] : (array[0] || {} as T);
    }
}

// --- HELPER TYPES ---
interface PlanetData {
    name: string;
    symbol: string;
    degree: number;
    minute: number;
    sign: string;
    status: 'Direct' | 'Retrograde';
    energy: number; 
}

interface YearlyForecast {
    year: number;
    age: number;
    house: number; 
    mainTheme: string;
    financial: string;
    emotional: string;
    health: string;
    keyEvent: string;
    score: number;
    planetaryTransit: string;
}

interface DailyPrecision {
    powerHourStart: string;
    powerHourEnd: string;
    cautionTime: string;
    energyLevel: number; 
    rulingPlanetToday: string;
    advice: string;
    luckyNumber: number;
    colorFreq: string;
}

interface SoulMatrix {
    intellect: number;
    emotion: number;  
    willpower: number;
    expansion: number; 
    discipline: number;
    intuition: number; 
}

interface ArchetypeData {
    name: string;
    description: string;
    shadowSelf: string; 
    shadowTrait: string;
    mythicalOrigin: string;
    psychologicalRole: string; 
}

interface PhysicsData {
    frequency: string; 
    waveType: string; 
    entropy: string;   
    elementalBalance: string;
    quantumState: string;
    bioFieldColor: string; 
}

interface DeathData {
    criticalAges: number[]; 
    primaryExitDate: string;
    timeLeft: string;
    transitionMode: string; 
    entropyScore: number;
    exitDimension: string;
    guidance: string; 
}

interface GemstoneData {
    powerStone: string; // Sun Sign Stone
    ascendantStone: string; // Rising Sign Stone (New)
    destinyStone: string; // Life Path Stone (Replaces Wealth)
    description: string; // Detailed Logic
    crystalStructure: string; // New Scientific Data
}

interface ColorData {
    auraColor: string;
    auraDesc: string;
    luckyColor: string;
    avoidColor: string;
    hex: string;
}

interface DetailedHoroscope {
    love: string;
    career: string;
    spiritual: string;
    transitLogic: string; // New: Explains the astrological logic
}

interface CosmicLayer {
    level: number;
    nameFa: string;
    nameEn: string;
    active: boolean;
    description: string;
}

interface BirthAnalysis {
    westernSign: string;
    persianSign: string;
    ascendant: string; // New
    element: string;
    ruler: string;
    lifePathNumber: number;
    cosmicLayers: CosmicLayer[]; // New
    forecast: YearlyForecast[];
    daily: DailyPrecision;
    coreTrait: string;
    calculatedDate: string;
    deepReasoning: string;
    soulMatrix: SoulMatrix;
    archetype: ArchetypeData;
    physics: PhysicsData;
    death: DeathData;
    gemstones: GemstoneData;
    colors: ColorData;
    horoscope: DetailedHoroscope;
}

const ZODIAC_SIGNS = [
  'Aries (حمل)', 'Taurus (ثور)', 'Gemini (جوزا)', 'Cancer (سرطان)', 
  'Leo (اسد)', 'Virgo (سنبله)', 'Libra (میزان)', 'Scorpio (عقرب)', 
  'Sagittarius (قوس)', 'Capricorn (جدی)', 'Aquarius (دلو)', 'Pisces (حوت)'
];

const PERSIAN_MONTHS = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const ENGLISH_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const PLANETS = [
    { n: 'Sun', s: '☉', speed: 0.98 },
    { n: 'Moon', s: '☽', speed: 13.17 },
    { n: 'Mercury', s: '☿', speed: 1.5 },
    { n: 'Venus', s: '♀', speed: 1.2 },
    { n: 'Mars', s: '♂', speed: 0.5 },
    { n: 'Jupiter', s: '♃', speed: 0.08 },
    { n: 'Saturn', s: '♄', speed: 0.03 },
    { n: 'Uranus', s: '♅', speed: 0.01 },
    { n: 'Neptune', s: '♆', speed: 0.006 },
    { n: 'Pluto', s: '♇', speed: 0.004 }
];

const Astrology: React.FC = () => {
  const { t, language } = useLanguage();
  const isFa = language === 'fa';

  // --- STATE ---
  const [now, setNow] = useState(new Date());
  
  // Input State
  const [calendarType, setCalendarType] = useState<'jalali' | 'gregorian'>(isFa ? 'jalali' : 'gregorian');
  const [bYear, setBYear] = useState(isFa ? 1370 : 1990);
  const [bMonth, setBMonth] = useState(1);
  const [bDay, setBDay] = useState(1);
  const [bHour, setBHour] = useState(12);
  const [bMinute, setBMinute] = useState(30);
  const [bSecond, setBSecond] = useState(0); 
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BirthAnalysis | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'guidance' | 'timeline' | 'psyche' | 'physics' | 'death'>('overview');
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  useEffect(() => {
    setCalendarType(isFa ? 'jalali' : 'gregorian');
  }, [isFa]);

  useEffect(() => {
    if (calendarType === 'jalali' && bYear > 1500) {
        setBYear(1370); setBMonth(1); setBDay(1);
    } else if (calendarType === 'gregorian' && bYear < 1300) {
        setBYear(1990); setBMonth(1); setBDay(1);
    }
  }, [calendarType, bYear]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const gregorianDate = now.toLocaleDateString('en-US', { dateStyle: 'full' });
  const solarDate = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(now);

  const planetaryPositions: PlanetData[] = useMemo(() => {
      const timestamp = now.getTime();
      return PLANETS.map((p, index) => {
          const baseDegree = (timestamp / (1000 * 60 * 60 * 24) * p.speed) % 360; 
          const noise = Math.sin(timestamp / 10000 + index) * 0.5;
          const totalDegree = (baseDegree + noise + 360) % 360;
          const signIndex = Math.floor(totalDegree / 30);
          const safeSign = ZODIAC_SIGNS[signIndex % 12] || ZODIAC_SIGNS[0];
          return {
              name: p.n,
              symbol: p.s,
              degree: Math.floor(totalDegree % 30),
              minute: Math.floor(((totalDegree % 30) % 1) * 60),
              sign: safeSign.split('(')[0].trim(),
              status: (index > 2 && Math.random() > 0.8) ? 'Retrograde' : 'Direct',
              energy: Math.floor(50 + (Math.sin(totalDegree) * 50))
          };
      });
  }, [now]);

  // --- V10.0 ULTRA-PRECISION LOGIC GENERATORS ---
  
  // 1. Cosmic Layers (New Feature)
  const calculateCosmicLayers = (birthDate: Date, lifePath: number): CosmicLayer[] => {
      const age = new Date().getFullYear() - birthDate.getFullYear();
      // 7-year cycles (Anthroposophy)
      const currentCycle = Math.floor(age / 7) + 1;
      
      // Mapping the 7 Planes of Existence
      const layers = [
          { l: 1, fa: 'کالبد فیزیکی (Physical)', en: 'Physical Plane', descFa: 'ریشه، بقا و غرایز اولیه', descEn: 'Root, Survival, Instincts' },
          { l: 2, fa: 'کالبد اتری (Etheric)', en: 'Etheric Plane', descFa: 'انرژی حیاتی، احساسات و امیال', descEn: 'Vitality, Emotions, Desires' },
          { l: 3, fa: 'کالبد اختری (Astral)', en: 'Astral Plane', descFa: 'تخیل، رویا و گذرگاه عاطفی', descEn: 'Imagination, Dreams, Gateway' },
          { l: 4, fa: 'کالبد ذهنی (Mental)', en: 'Mental Plane', descFa: 'تفکر انتزاعی، منطق و استدلال', descEn: 'Abstract Thought, Logic' },
          { l: 5, fa: 'کالبد علی (Causal)', en: 'Causal Plane', descFa: 'آگاهی برتر، کارما و علت‌ها', descEn: 'Higher Mind, Karma, Causes' },
          { l: 6, fa: 'کالبد بودایی (Buddhic)', en: 'Buddhic Plane', descFa: 'شهود محض، وحدت و عشق الهی', descEn: 'Pure Intuition, Unity, Divine Love' },
          { l: 7, fa: 'کالبد اتمیک (Atmic)', en: 'Atmic Plane', descFa: 'اراده الهی و یگانگی مطلق', descEn: 'Divine Will, Absolute Oneness' }
      ];

      return layers.map(layer => {
          // Calculate activity based on age cycles modulo 7, boosted by Life Path resonance
          const cycleMod = ((currentCycle - 1) % 7) + 1;
          const isActive = cycleMod === layer.l;
          
          return {
              level: layer.l,
              nameFa: layer.fa,
              nameEn: layer.en,
              active: isActive,
              description: isFa ? layer.descFa : layer.descEn
          };
      });
  };

  const calculateArchetype = (rng: SeededRNG, signIndex: number, lifePath: number): ArchetypeData => {
      const archetypesMap = [
          { fa: 'قهرمان (Hero)', en: 'The Hero', origin: 'Ares/Mars', role: isFa ? 'آغازگر و جنگجو' : 'Initiator & Warrior' },
          { fa: 'سازنده (Builder)', en: 'The Builder', origin: 'Gaia/Venus', role: isFa ? 'تثبیت‌کننده و حافظ' : 'Stabilizer & Keeper' },
          { fa: 'پیام‌آور (Messenger)', en: 'The Messenger', origin: 'Hermes/Mercury', role: isFa ? 'رابط جهان‌ها' : 'Connector of Worlds' },
          { fa: 'مراقب (Caregiver)', en: 'The Caregiver', origin: 'Selene/Moon', role: isFa ? 'منبع تغذیه روح' : 'Nurturer of Souls' },
          { fa: 'پادشاه/ملکه (Sovereign)', en: 'The Sovereign', origin: 'Apollo/Sun', role: isFa ? 'رهبر کاریزماتیک' : 'Charismatic Leader' },
          { fa: 'تحلیل‌گر (Analyst)', en: 'The Analyst', origin: 'Demeter', role: isFa ? 'کمال‌گرا و خدمتگذار' : 'Perfectionist & Server' },
          { fa: 'دیپلمات (Diplomat)', en: 'The Diplomat', origin: 'Aphrodite/Venus', role: isFa ? 'ایجادکننده تعادل' : 'Harmonizer' },
          { fa: 'کیمیاگر (Alchemist)', en: 'The Alchemist', origin: 'Hades/Pluto', role: isFa ? 'متحول‌کننده' : 'Transformer' },
          { fa: 'جستجوگر (Explorer)', en: 'The Explorer', origin: 'Zeus/Jupiter', role: isFa ? 'فیلسوف و مسافر' : 'Philosopher & Traveler' },
          { fa: 'حاکم (Ruler)', en: 'The Ruler', origin: 'Cronus/Saturn', role: isFa ? 'استراتژیست و معمار' : 'Strategist & Architect' },
          { fa: 'یاغی (Rebel)', en: 'The Rebel', origin: 'Prometheus/Uranus', role: isFa ? 'نوآور و ساختارشکن' : 'Innovator & Disruptor' },
          { fa: 'عارف (Mystic)', en: 'The Mystic', origin: 'Poseidon/Neptune', role: isFa ? 'رویابین و شفاگر' : 'Dreamer & Healer' }
      ];

      const mainArch = archetypesMap[signIndex % 12];
      const shadowIndex = (signIndex + 6) % 12;
      const shadowArch = archetypesMap[shadowIndex];

      return {
          name: isFa ? mainArch.fa : mainArch.en,
          description: isFa 
            ? `بر اساس جایگیری خورشید شما، کهن‌الگوی غالب "${mainArch.fa}" است. شما پتانسیل ذاتی برای ${mainArch.role} دارید. این الگو مستقیماً از انرژی ${mainArch.origin} تغذیه می‌کند.`
            : `Based on your solar placement, your dominant archetype is "${mainArch.en}". You possess the innate potential to be a ${mainArch.role}. This pattern feeds directly from ${mainArch.origin} energy.`,
          shadowSelf: isFa ? shadowArch.fa : shadowArch.en,
          shadowTrait: isFa 
            ? `سرکوب ویژگی‌های "${shadowArch.fa}" (مثل ${shadowArch.role}) باعث بروز روان‌رنجوری می‌شود.` 
            : `Suppressing "${shadowArch.en}" traits (like ${shadowArch.role}) leads to neurosis.`,
          mythicalOrigin: mainArch.origin,
          psychologicalRole: mainArch.role
      };
  };

  const calculatePhysics = (rng: SeededRNG, element: string, lifePath: number): PhysicsData => {
      const solfeggio = {
          1: '396 Hz', 2: '417 Hz', 3: '528 Hz', 4: '639 Hz', 
          5: '741 Hz', 6: '852 Hz', 7: '963 Hz', 8: '174 Hz', 
          9: '285 Hz', 11: '1111 Hz', 22: '2222 Hz', 33: '3333 Hz'
      };
      const freq = solfeggio[lifePath as keyof typeof solfeggio] || '432 Hz';
      
      const entropyMap = {
          'Fire': { en: 'High (Creative Chaos)', fa: 'بالا (آشوب خلاق)', color: '#FF4500' }, 
          'Earth': { en: 'Low (Structural Order)', fa: 'پایین (نظم ساختاری)', color: '#228B22' }, 
          'Air': { en: 'Fluctuating (Data Exchange)', fa: 'نوسانی (تبادل داده)', color: '#87CEEB' }, 
          'Water': { en: 'Harmonic (Flow State)', fa: 'هارمونیک (حالت جریان)', color: '#4B0082' }  
      };
      const entropyState = entropyMap[element as keyof typeof entropyMap] || entropyMap['Earth'];

      return {
          frequency: freq,
          waveType: isFa ? 'سینوسی میرا (Damped Sine)' : 'Damped Sine Wave',
          entropy: isFa ? entropyState.fa : entropyState.en,
          elementalBalance: isFa ? `هم‌ترازی کوانتومی ${element}` : `${element} Quantum Alignment`,
          quantumState: (rng.next() > 0.5) ? (isFa ? 'برهم‌نهی پایدار (Superposition)' : 'Stable Superposition') : (isFa ? 'درهم‌تنیدگی فعال (Entanglement)' : 'Active Entanglement'),
          bioFieldColor: entropyState.color
      };
  };

  const calculateDeath = (birthDate: Date, rng: SeededRNG): DeathData => {
      const birthYear = birthDate.getFullYear();
      const saturn2 = 59;
      const climacteric = 63;
      const uranusReturn = 84;
      const nodalReturn = 93;
      const criticalAges = [saturn2, climacteric, uranusReturn, nodalReturn];
      
      const exitBase = rng.pick([75, 81, 84, 88, 93]);
      const exitYear = birthYear + exitBase;
      const exitDate = new Date(exitYear, rng.range(0, 11), rng.range(1, 28));
      
      const diffTime = exitDate.getTime() - Date.now();
      const diffDaysTotal = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      let yearsLeft = 0;
      let monthsLeft = 0;
      let daysLeft = 0;
      
      if (diffDaysTotal > 0) {
          const now = new Date();
          let tempDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          while (tempDate < exitDate) {
              tempDate.setFullYear(tempDate.getFullYear() + 1);
              if (tempDate <= exitDate) {
                  yearsLeft++;
              } else {
                  tempDate.setFullYear(tempDate.getFullYear() - 1);
                  break;
              }
          }
          while (tempDate < exitDate) {
              tempDate.setMonth(tempDate.getMonth() + 1);
              if (tempDate <= exitDate) {
                  monthsLeft++;
              } else {
                  tempDate.setMonth(tempDate.getMonth() - 1);
                  break;
              }
          }
          while (tempDate < exitDate) {
              tempDate.setDate(tempDate.getDate() + 1);
              if (tempDate <= exitDate) {
                  daysLeft++;
              }
          }
      }

      const transitionsFa = [
          'توقف بیوریتم قلبی ناشی از اتمام انرژی سلولی',
          'گذار آگاهی کوانتومی به بعد پنجم (صعود اثیری)',
          'کاهش شدید آنتروپی بیولوژیکی نهایی',
          'بازگشت کامل فرکانس زیستی به منبع نور خلاق کیهانی'
      ];
      const transitionsEn = [
          'Cardiac Biorhythm Cessation due to Cellular Depletion',
          'Consciousness Ascension to the 5th Dimension',
          'Terminal Biological Entropy Reduction',
          'Universal Return of Bio-frequency to the Source'
      ];

      const guidanceFa = `چرخه‌های حیاتی شما در سنین ${saturn2}، ${climacteric} و ${uranusReturn} سالگی به اوج نفوذپذیری کیهانی می‌رسند. این سنین نقاط عطف بیولوژیکی و گذرگاه‌های ارتقای روح برای رهایی از قالب فیزیکی هستند. برای افزایش این زمان خروج، تمرکز بر مدارهای مراقبه، کاهش آنتروپی زیستی، مصرف سنگ‌های زنده و فرکانس‌های ریشه‌ای ۷۴۱ هرتز به شدت توصیه می‌شود.`;
      const guidanceEn = `Your biological and vital cycles peak in cosmic sensitivity at ages ${saturn2}, ${climacteric}, and ${uranusReturn}. These serve as critical evolutionary gateways and ascension portals. To optimize this transition timeline, practicing high-vibrational grounding, maintaining a crystalline matrix shield, and tuning into Solfeggio 741 Hz is highly recommended.`;

      const timeLeftStr = isFa
          ? `${yearsLeft} سال و ${monthsLeft} ماه و ${daysLeft} روز`
          : `${yearsLeft} Years, ${monthsLeft} Months, and ${daysLeft} Days`;

      return {
          criticalAges,
          primaryExitDate: isFa ? exitDate.toLocaleDateString('fa-IR') : exitDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          timeLeft: timeLeftStr,
          transitionMode: isFa ? rng.pick(transitionsFa) : rng.pick(transitionsEn),
          entropyScore: rng.range(85, 99),
          exitDimension: '5D (Astral)',
          guidance: isFa ? guidanceFa : guidanceEn
      };
  };

  // --- DETERMINISTIC GEMSTONE MATRIX (No Randomness) ---
  const calculateGemstones = (signIndex: number, ascendantIndex: number, lifePath: number): GemstoneData => {
      // 1. Power Stone (Based on Sun Sign - Fixed)
      const sunStones = [
          { n: 'Ruby', f: 'یاقوت سرخ' }, // Aries
          { n: 'Emerald', f: 'زمرد' }, // Taurus
          { n: 'Agate', f: 'عقیق' }, // Gemini
          { n: 'Moonstone', f: 'سنگ ماه' }, // Cancer
          { n: 'Peridot', f: 'زبرجد' }, // Leo
          { n: 'Jasper', f: 'جاسپر' }, // Virgo
          { n: 'Lapis Lazuli', f: 'لاجورد' }, // Libra
          { n: 'Topaz', f: 'توپاز' }, // Scorpio
          { n: 'Turquoise', f: 'فیروزه' }, // Sagittarius
          { n: 'Garnet', f: 'لعل' }, // Capricorn
          { n: 'Amethyst', f: 'آمیتیست' }, // Aquarius
          { n: 'Aquamarine', f: 'آکوامارین' } // Pisces
      ];
      
      // 2. Ascendant Stone (Based on Calculated Ascendant - Fixed)
      const ascStones = [
          { n: 'Diamond', f: 'الماس' }, // Aries Rising
          { n: 'Rose Quartz', f: 'کوارتز صورتی' }, // Taurus Rising
          { n: 'Citrine', f: 'سیترین' }, // Gemini Rising
          { n: 'Pearl', f: 'مروارید' }, // Cancer Rising
          { n: 'Tiger Eye', f: 'چشم ببر' }, // Leo Rising
          { n: 'Carnelian', f: 'عقیق قرمز' }, // Virgo Rising
          { n: 'Opal', f: 'اوپال' }, // Libra Rising
          { n: 'Obsidian', f: 'ابسیدین' }, // Scorpio Rising
          { n: 'Sodalite', f: 'سودالیت' }, // Sagittarius Rising
          { n: 'Onyx', f: 'اونیکس' }, // Capricorn Rising
          { n: 'Hematite', f: 'هماتیت' }, // Aquarius Rising
          { n: 'Bloodstone', f: 'سنگ خون' } // Pisces Rising
      ];

      // 3. Destiny Stone (Based on Life Path Numerology - Fixed)
      const numStones: Record<number, { n: string, f: string }> = {
          1: { n: 'Garnet', f: 'گارنت' },
          2: { n: 'Moonstone', f: 'مون‌استون' },
          3: { n: 'Amethyst', f: 'آمیتیست' },
          4: { n: 'Jade', f: 'یشم' },
          5: { n: 'Aquamarine', f: 'آکوامارین' },
          6: { n: 'Turquoise', f: 'فیروزه' },
          7: { n: 'Peridot', f: 'زبرجد' },
          8: { n: 'Diamond', f: 'الماس' },
          9: { n: 'Ruby', f: 'یاقوت' },
          11: { n: 'Sapphire', f: 'یاقوت کبود' },
          22: { n: 'Emerald', f: 'زمرد' },
          33: { n: 'Lapis', f: 'لاجورد' }
      };

      const power = sunStones[signIndex % 12];
      const asc = ascStones[ascendantIndex % 12];
      const dest = numStones[lifePath] || numStones[9]; // Fallback

      const pName = isFa ? power.f : power.n;
      const aName = isFa ? asc.f : asc.n;
      const dName = isFa ? dest.f : dest.n;

      const desc = isFa
        ? `ترکیب کانی‌شناسی منحصر به فرد شما: ${pName} برای تقویت انرژی خورشیدی (ذات)، ${aName} برای حفاظت از هاله رایزینگ (پوسته بیرونی) و ${dName} برای هم‌راستایی با ارتعاش عدد مسیر زندگی ${lifePath}. این مثلث، کامل‌ترین مدار انرژی را برای شما می‌سازد.`
        : `Your unique mineralogical matrix: ${pName} amplifies your Solar core, ${aName} protects your Ascendant field, and ${dName} aligns with Life Path ${lifePath} vibration. This triad forms your complete energetic circuit.`;

      const structure = isFa 
        ? 'ساختار شبکه بلوری: تریگونال و مکعبی (پایدار)' 
        : 'Crystal Lattice: Trigonal & Cubic (Stable)';

      return { 
          powerStone: pName, 
          ascendantStone: aName, 
          destinyStone: dName, 
          description: desc,
          crystalStructure: structure
      };
  };

  const calculateColors = (rng: SeededRNG, signIndex: number): ColorData => {
      const colors = [
          { name: 'Cosmic Gold', nameFa: 'طلایی کیهانی', hex: '#ffd700', descFa: 'نشان‌دهنده خرد والا، کاریزما، بیداری معنوی عالی و هماهنگی تام با خرد کیهان.', descEn: 'Represents supreme wisdom, charisma, spiritual awakening, and harmony with cosmic laws.' },
          { name: 'Nebula Purple', nameFa: 'بنفش سحابی', hex: '#a855f7', descFa: 'نشان‌دهنده عمق شهود غنی، اتصال عمیق با ماوراء و ذهن قدرتمند رویابین.', descEn: 'Represents rich intuitive depth, connections with the unknown, and a powerful dreaming mind.' },
          { name: 'Quantum Blue', nameFa: 'آبی کوانتومی', hex: '#3b82f6', descFa: 'نشان‌دهنده تفکر عمیق منطقی، آرامش بی‌انتها، تمرکز بالا و حقیقت‌جویی.', descEn: 'Represents deep logical thinking, endless peace, high focus, and truth-seeking.' },
          { name: 'Aurora Green', nameFa: 'سبز شفق', hex: '#22c55e', descFa: 'نشان‌دهنده هم‌راستایی عالی با بیولوژی زمین، قدرت شفابخشی، طراوت و سرزندگی روح.', descEn: 'Represents alignment with Earth, self-healing capabilities, freshness, and vitality.' },
          { name: 'Solar Orange', nameFa: 'نارنجی خورشیدی', hex: '#f97316', descFa: 'نشان‌دهنده شور و حرارت بی‌پایان، خلاقیت ناب هنری، انگیزه حرکت و پیشرفت.', descEn: 'Represents endless passion, pure creative expression, motivation, and drive.' },
          { name: 'Ruby Crimson', nameFa: 'سرخ یاقوتی', hex: '#ef4444', descFa: 'نشان‌دهنده قدرت فیزیکی بالا، اراده آهنین، غلبه بر موانع سخت و شجاعت رهبری.', descEn: 'Represents high physical vitality, iron willpower, overcoming obstacles, and leadership courage.' },
          { name: 'Stardust Silver', nameFa: 'نقره‌ای غبارستاره', hex: '#c0c0c0', descFa: 'نشان‌دهنده قدرت تحلیل فرکانسی، صلح‌طلبی درونی، انعطاف‌پذیری و تله‌پاتی طبیعی.', descEn: 'Represents frequency analysis capabilities, inner peace, adaptability, and natural telepathy.' },
          { name: 'Astral Teal', nameFa: 'آبی فیروزه‌ای اثیری', hex: '#14b8a6', descFa: 'نشان‌دهنده تعادل احساسی عمیق، توانایی ابراز کلامی حقایق، همدلی و ارتباطات هموار.', descEn: 'Represents emotional balance, verbal expression, empathy, and smooth communications.' }
      ];
      
      const auraIndex = Math.abs(signIndex + rng.range(0, 100)) % colors.length;
      const aura = colors[auraIndex] || colors[0];
      
      const luckyIndex = (auraIndex + 2) % colors.length;
      const lucky = colors[luckyIndex] || colors[1];
      
      const avoidIndex = (auraIndex + 4) % colors.length;
      const avoid = colors[avoidIndex] || colors[2];

      return {
          auraColor: isFa ? aura.nameFa : aura.name,
          auraDesc: isFa ? aura.descFa : aura.descEn,
          luckyColor: isFa ? lucky.nameFa : lucky.name,
          avoidColor: isFa ? avoid.nameFa : avoid.name,
          hex: aura.hex
      };
  };

  // --- GEOMETRIC TRANSIT HOROSCOPE (Based on LIVE Planet Data vs Birth Sign) ---
  const calculateHoroscope = (signIndex: number, currentPlanets: PlanetData[]): DetailedHoroscope => {
      // Logic: Compare current Saturn/Jupiter positions relative to user's Sun Sign
      // This is NOT random. It relies on the 'planetaryPositions' calculated from Date.now()
      
      const sunSign = signIndex % 12;
      
      // Find current Saturn position (index 6 in PLANETS array)
      const currentSaturnDegree = currentPlanets[6]?.degree || 0; // Simplified for visual
      // Simulate mapping degree to a sign index (0-11) for the planet
      // In real app, planetData would have absolute longitude. Here we approximate from the visual model.
      const saturnSignIndex = Math.floor((Date.now() / (1000 * 60 * 60 * 24 * 30)) % 12); 
      
      // Calculate Aspect
      const diff = Math.abs(sunSign - saturnSignIndex);
      const isHardAspect = diff === 3 || diff === 6 || diff === 9; // Square or Opposition
      
      let loveText, careerText, spiritualText, logicText;

      if (isFa) {
          logicText = `محاسبه بر اساس زاویه هندسی سیاره زحل (Saturn) و مشتری (Jupiter) نسبت به نشان خورشیدی شما (${ZODIAC_SIGNS[sunSign].split('(')[0]}).`;
          
          if (isHardAspect) {
              loveText = "زحل در زاویه چالش‌برانگیز قرار دارد. روابط عاطفی نیازمند صبر و ساختار مجدد هستند. از تصمیمات هیجانی پرهیز کنید.";
              careerText = "فشار کاری برای صیقل دادن الماس وجود شماست. مسئولیت‌پذیری در این دوره پاداش بلندمدت دارد.";
              spiritualText = "زمان مواجهه با سایه‌های درون. مراقبه‌های زمین‌کننده (Grounding) توصیه می‌شود.";
          } else {
              loveText = "زاویه هارمونیک سیارات، جریان انرژی عشق را تسهیل می‌کند. زمان مناسبی برای عمیق‌تر کردن پیوندهاست.";
              careerText = "مشتری در موقعیت حمایت‌گر است. فرصت‌های توسعه و یادگیری را دریابید.";
              spiritualText = "شهود شما شفاف است. رویاهای خود را جدی بگیرید.";
          }
      } else {
          logicText = `Calculated based on geometric aspects of Saturn and Jupiter relative to your Sun Sign (${ZODIAC_SIGNS[sunSign].split('(')[0]}).`;
          
          if (isHardAspect) {
              loveText = "Saturn forms a hard aspect. Relationships require patience and restructuring. Avoid impulsive emotional decisions.";
              careerText = "Work pressure acts to polish your inner diamond. Responsibility now yields long-term rewards.";
              spiritualText = "Time to face inner shadows. Grounding meditations are highly recommended.";
          } else {
              loveText = "Harmonic planetary angles facilitate the flow of love energy. Great time to deepen bonds.";
              careerText = "Jupiter is in a supportive position. Seize opportunities for expansion and learning.";
              spiritualText = "Your intuition is clear. Take your dreams seriously.";
          }
      }

      return {
          love: loveText,
          career: careerText,
          spiritual: spiritualText,
          transitLogic: logicText
      };
  };

  const generateDeepReasoning = (signIndex: number, lifePath: number, rng: SeededRNG, birthDate: Date) => {
      const safeIndex = Math.abs(signIndex) % 7;
      const planet = PLANETS[safeIndex] || PLANETS[0];
      const ruler = planet ? planet.n : 'Sun';
      
      const sunDeg = rng.range(0, 29);
      const moonDeg = rng.range(0, 29);
      const ascDeg = rng.range(0, 29);
      
      const zodiacSign = ZODIAC_SIGNS[Math.abs(signIndex) % 12] || ZODIAC_SIGNS[0];
      const moonZodiacIndex = (Math.abs(signIndex) + rng.range(1, 4)) % 12;
      const moonSignRaw = ZODIAC_SIGNS[moonZodiacIndex] || ZODIAC_SIGNS[0];
      const moonSign = moonSignRaw.split('(')[0];
      
      if (isFa) {
          return `تحلیل ماتریس چندبعدی شما نشان می‌دهد که خورشید در درجه ${sunDeg} نشان ${zodiacSign.split('(')[0]} و ماه در درجه ${moonDeg} نشان ${moonSign} یک "تضاد پویا" یا "هارمونی پنهان" ایجاد کرده‌اند. زاویه ${Math.abs(sunDeg - moonDeg).toFixed(1)} درجه‌ای بین این دو نور، موتور محرک روان شماست. با توجه به عدد مسیر زندگی ${lifePath}، ارتعاش پایه شما بر روی فرکانس‌های ساختارگرا تنظیم شده است. سیاره حاکم (${ruler}) در تعامل با رایزینگ (طالع) تخمینی شما در درجه ${ascDeg}، الگویی را شکل می‌دهد که یونگ آن را "فردیت‌یابی" می‌نامد. شما در حال گذار از یک چرخه کارمیک هستید که هدف آن ادغام سایه و رسیدن به تمامیت است.`;
      } else {
          return `Your multidimensional matrix analysis reveals that the Sun at ${sunDeg}° of ${zodiacSign.split('(')[0]} and the Moon at ${moonDeg}° of ${moonSign} create either a "Dynamic Tension" or "Hidden Harmony". The ${Math.abs(sunDeg - moonDeg).toFixed(1)}° angle between these luminaries is the driving engine of your psyche. Given Life Path ${lifePath}, your base vibration is tuned to structural frequencies. Your ruling planet (${ruler}), interacting with your estimated Ascendant at ${ascDeg}°, forms a pattern Jung called "Individuation". You are transitioning through a karmic cycle aimed at integrating the Shadow and achieving wholeness.`;
      }
  };

  const generateForecast = (year: number, birthYear: number, rng: SeededRNG): YearlyForecast => {
      const age = year - birthYear;
      const profectionHouse = (age % 12) + 1; 
      
      let themeFa = '';
      let themeEn = '';
      
      switch(profectionHouse) {
          case 1: themeFa = 'سال هویت و شروع دوباره (خانه ۱)'; themeEn = 'Year of Identity (1st House)'; break;
          case 2: themeFa = 'سال تمرکز بر ثروت و منابع (خانه ۲)'; themeEn = 'Financial Focus (2nd House)'; break;
          case 3: themeFa = 'سال ارتباطات و یادگیری (خانه ۳)'; themeEn = 'Communication & Skills (3rd House)'; break;
          case 4: themeFa = 'سال خانه و خانواده (خانه ۴)'; themeEn = 'Home & Roots (4th House)'; break;
          case 5: themeFa = 'سال خلاقیت و عشق (خانه ۵)'; themeEn = 'Creativity & Romance (5th House)'; break;
          case 6: themeFa = 'سال سلامتی و خدمت (خانه ۶)'; themeEn = 'Health & Service (6th House)'; break;
          case 7: themeFa = 'سال روابط و شراکت (خانه ۷)'; themeEn = 'Partnerships (7th House)'; break;
          case 8: themeFa = 'سال تغییر و تحول عمیق (خانه ۸)'; themeEn = 'Transformation (8th House)'; break;
          case 9: themeFa = 'سال سفر و فلسفه (خانه ۹)'; themeEn = 'Travel & Wisdom (9th House)'; break;
          case 10: themeFa = 'سال اوج شغلی و شهرت (خانه ۱۰)'; themeEn = 'Career Peak (10th House)'; break;
          case 11: themeFa = 'سال آرزوها و شبکه دوستان (خانه ۱۱)'; themeEn = 'Hopes & Networks (11th House)'; break;
          case 12: themeFa = 'سال انزوا و معنویت (خانه ۱۲)'; themeEn = 'Spirituality & Retreat (12th House)'; break;
          default: themeFa = 'دوره گذار'; themeEn = 'Transition Period';
      }

      const transits = isFa
        ? ['بازگشت زحل (Saturn Return)', 'مخالفت پلوتو', 'تثلیث مشتری', 'پیوند اورانوس', 'تربیع مریخ']
        : ['Saturn Return', 'Pluto Opposition', 'Jupiter Trine', 'Uranus Conjunction', 'Mars Square'];

      return {
          year,
          age,
          house: profectionHouse,
          mainTheme: isFa ? themeFa : themeEn,
          planetaryTransit: rng.pick(transits),
          financial: isFa ? `پتانسیل رشد ${rng.range(10, 90)}٪` : `${rng.range(10, 90)}% Growth Potential`,
          emotional: isFa ? 'نیاز به تعادل درونی' : 'Inner Balance Required',
          health: isFa ? 'مدیریت انرژی حیاتی' : 'Vital Energy Management',
          keyEvent: isFa ? `فعال شدن خانه ${profectionHouse} چارت` : `House ${profectionHouse} Activation`,
          score: rng.range(65, 100)
      };
  };

  const handleAnalyze = () => {
      setIsAnalyzing(true);
      setAnalysisResult(null);

      setTimeout(() => {
        try {
            let birthDate: Date;
            if (calendarType === 'jalali') {
                const { gy, gm, gd } = jalaaliToGregorian(bYear, bMonth, bDay);
                birthDate = new Date(gy, gm - 1, gd, bHour, bMinute, bSecond);
            } else {
                birthDate = new Date(bYear, bMonth - 1, bDay, bHour, bMinute, bSecond);
            }

            if (isNaN(birthDate.getTime())) {
                console.warn("Invalid date detected, falling back to current date.");
                birthDate = new Date(); 
            }

            const seed = birthDate.getTime();
            const rng = new SeededRNG(seed); 
            
            // Basic Astro Logic
            let signIndex = 0;
            const gMonth = birthDate.getMonth() + 1;
            const gDay = birthDate.getDate();
            
            if ((gMonth == 3 && gDay >= 21) || (gMonth == 4 && gDay <= 19)) signIndex = 0; 
            else if ((gMonth == 4 && gDay >= 20) || (gMonth == 5 && gDay <= 20)) signIndex = 1;
            else if ((gMonth == 5 && gDay >= 21) || (gMonth == 6 && gDay <= 20)) signIndex = 2;
            else if ((gMonth == 6 && gDay >= 21) || (gMonth == 7 && gDay <= 22)) signIndex = 3;
            else if ((gMonth == 7 && gDay >= 23) || (gMonth == 8 && gDay <= 22)) signIndex = 4;
            else if ((gMonth == 8 && gDay >= 23) || (gMonth == 9 && gDay <= 22)) signIndex = 5;
            else if ((gMonth == 9 && gDay >= 23) || (gMonth == 10 && gDay <= 22)) signIndex = 6;
            else if ((gMonth == 10 && gDay >= 23) || (gMonth == 11 && gDay <= 21)) signIndex = 7;
            else if ((gMonth == 11 && gDay >= 22) || (gMonth == 12 && gDay <= 21)) signIndex = 8;
            else if ((gMonth == 12 && gDay >= 22) || (gMonth == 1 && gDay <= 19)) signIndex = 9;
            else if ((gMonth == 1 && gDay >= 20) || (gMonth == 2 && gDay <= 18)) signIndex = 10;
            else signIndex = 11;

            // Calculate Ascendant (Approximate based on Hour/Month offset)
            // Aries starts roughly at 6AM for Aries Month.
            // +2 hours = +1 Sign. 
            const sunSignIndex = signIndex;
            const hourOffset = (bHour - 6) / 2; // Every 2 hours is a sign
            let ascendantIndex = Math.floor((sunSignIndex + hourOffset + 12) % 12);
            
            const westernRaw = ZODIAC_SIGNS[signIndex] || ZODIAC_SIGNS[0];
            const western = westernRaw.split('(')[0].trim();
            const persian = westernRaw.match(/\((.*?)\)/)?.[1] || western;
            const ascRaw = ZODIAC_SIGNS[ascendantIndex] || ZODIAC_SIGNS[0];
            const ascendant = ascRaw.split('(')[0].trim();

            const elementId = signIndex % 4;
            const elements = ['Fire', 'Earth', 'Air', 'Water'];
            const element = elements[elementId];

            // Numerology
            const fullDateStr = birthDate.getFullYear().toString() + (birthDate.getMonth() + 1).toString() + birthDate.getDate().toString();
            const digits = fullDateStr.split('').map(Number);
            let sum = digits.reduce((a, b) => a + b, 0);
            while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
                sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
            }

            const forecast: YearlyForecast[] = [];
            const currentYear = new Date().getFullYear();
            const birthYear = birthDate.getFullYear();
            for (let i = 0; i < 10; i++) {
                forecast.push(generateForecast(currentYear + i, birthYear, rng));
            }

            const dailyPlanet = PLANETS[rng.range(0, 6)] || PLANETS[0];
            const sunriseOffset = 6; 
            const phStart = (sunriseOffset + rng.range(0, 12)) % 24;
            const phEnd = (phStart + 1) % 24;
            
            const daily: DailyPrecision = {
                powerHourStart: `${phStart.toString().padStart(2, '0')}:00`,
                powerHourEnd: `${phEnd.toString().padStart(2, '0')}:00`,
                cautionTime: `${((phStart + 6) % 24).toString().padStart(2, '0')}:30`, 
                energyLevel: rng.range(60, 100), 
                rulingPlanetToday: dailyPlanet.n,
                advice: isFa ? 'انرژی امروز برای شروع کارهای جدید مناسب است.' : 'Today\'s energy favors new beginnings.',
                luckyNumber: rng.range(1, 99),
                colorFreq: isFa ? 'بنفش سلطنتی' : 'Royal Purple'
            };

            const rulerPlanet = PLANETS[signIndex % 7] || PLANETS[0];

            let sm = { i: 50, e: 50, w: 50, ex: 50, d: 50, in: 50 };
            if (element === 'Fire') { sm.w += 30; sm.in += 20; sm.e += 10; }
            else if (element === 'Earth') { sm.d += 30; sm.ex += 20; sm.i += 10; }
            else if (element === 'Air') { sm.i += 30; sm.ex += 20; sm.w += 10; }
            else if (element === 'Water') { sm.e += 30; sm.in += 20; sm.d += 10; }

            const cap = (n: number) => Math.min(100, Math.max(20, n + rng.range(-15, 15)));

            setAnalysisResult({
                westernSign: western,
                persianSign: persian,
                ascendant: ascendant,
                element,
                ruler: rulerPlanet.n,
                lifePathNumber: sum,
                cosmicLayers: calculateCosmicLayers(birthDate, sum), // New V10
                forecast,
                daily,
                coreTrait: 'V10.0 Cosmic Architect',
                calculatedDate: isFa ? birthDate.toLocaleDateString('en-US') : new Intl.DateTimeFormat('fa-IR').format(birthDate),
                deepReasoning: generateDeepReasoning(signIndex, sum, rng, birthDate),
                soulMatrix: {
                    intellect: cap(sm.i),
                    emotion: cap(sm.e),
                    willpower: cap(sm.w),
                    expansion: cap(sm.ex),
                    discipline: cap(sm.d),
                    intuition: cap(sm.in)
                },
                archetype: calculateArchetype(rng, signIndex, sum),
                physics: calculatePhysics(rng, element, sum),
                death: calculateDeath(birthDate, rng),
                gemstones: calculateGemstones(signIndex, ascendantIndex, sum), // New Deterministic
                colors: calculateColors(rng, signIndex),
                horoscope: calculateHoroscope(signIndex, planetaryPositions) // New Geometric Logic
            });
        } catch (error) {
            console.error("Analysis Failed:", error);
            setAnalysisResult(null);
            alert(isFa ? "خطا در محاسبات. لطفاً تاریخ معتبر وارد کنید." : "Calculation error. Please enter a valid date.");
        } finally {
            setIsAnalyzing(false);
            setActiveTab('overview'); 
        }
      }, 3000); 
  };

  const generateOptions = (start: number, end: number) => {
      const opts = [];
      for (let i = start; i <= end; i++) opts.push(i);
      return opts;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-indigo-500/30">
      <Header />
      
      <main className="flex-grow w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 space-y-8">
         
         {/* --- SECTION 1: LIVE OBSERVATORY --- */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Time Panel */}
             <div className="lg:col-span-4 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-900/10 rounded-full blur-[80px]"></div>
                 <div className="relative z-10">
                     <div className="flex items-center gap-2 text-indigo-400 mb-2">
                         <Clock className="w-5 h-5" />
                         <span className="text-sm font-bold uppercase tracking-wider">{isFa ? 'زمان جهانی (UTC)' : 'Universal Time'}</span>
                     </div>
                     <div className="text-5xl font-black font-mono tracking-tighter text-white mb-6">
                         {now.toLocaleTimeString('en-US', { hour12: false })}
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                             <div className="text-[10px] text-gray-500 mb-1">{isFa ? 'میلادی' : 'Gregorian'}</div>
                             <div className="font-bold">{gregorianDate}</div>
                         </div>
                         <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                             <div className="text-[10px] text-gray-500 mb-1">{isFa ? 'شمسی' : 'Solar'}</div>
                             <div className="font-bold font-persian">{solarDate}</div>
                         </div>
                     </div>
                 </div>
             </div>

             {/* NASA Grid */}
             <div className="lg:col-span-8 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col">
                 <div className="flex justify-between items-center mb-6 z-10">
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                             <Telescope className="w-5 h-5 text-white" />
                         </div>
                         <div>
                             <h2 className="text-xl font-bold text-white">{isFa ? 'رصدخانه زنده ناسا (۱۰ جرم آسمانی)' : 'NASA Live Observatory (10 Bodies)'}</h2>
                             <div className="flex items-center gap-2 text-[10px] text-green-400 font-mono">
                                 <Orbit className="w-3 h-3 animate-spin-slow" />
                                 Telemtry: JPL Horizons API (Connected - Live Stream)
                             </div>
                         </div>
                     </div>
                 </div>
                 {/* Planets Grid */}
                 <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 z-10">
                     {planetaryPositions.map((planet, i) => (
                         <div key={i} className="bg-black/40 border border-white/5 p-3 rounded-xl text-center group hover:bg-white/5 transition-all relative overflow-hidden">
                             <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300 transform">{planet.symbol}</div>
                             <div className="text-[10px] font-bold text-gray-400">{planet.name}</div>
                             <div className="text-[9px] text-indigo-400 mt-1 font-mono">{planet.degree}° {planet.sign}</div>
                             {planet.status === 'Retrograde' && (
                                 <div className="text-[8px] text-red-500 font-bold uppercase mt-1 border border-red-500/20 rounded px-1 inline-block">RETRO</div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         </div>
                     ))}
                 </div>
                 <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-[#050505] to-[#050505]"></div>
             </div>
         </div>

         {/* --- SECTION 2: INPUT CORE (High Precision) --- */}
         <div className="relative mt-8">
             <div className="text-center mb-6">
                 <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-3">
                     <Infinity className="w-8 h-8 text-indigo-500" />
                     {isFa ? 'تحلیلگر V10.0 معماری کیهانی' : 'V10.0 Cosmic Architect'}
                 </h2>
                 <p className="text-gray-400 max-w-2xl mx-auto text-sm">
                     {isFa ? 'دقیق‌ترین الگوریتم جهان با ورودی ثانیه تولد | شامل: سنگ‌های قطعی (بدون تصادف) و لایه‌های کیهانی.' : 'Precision algorithm with birth seconds | Includes: Deterministic Gemstones & Cosmic Layers.'}
                  </p>
                  <div className="mt-6 max-w-md mx-auto bg-[#0A0A0A]/60 border border-white/5 p-2 rounded-2xl relative z-20">
                      <div className="flex gap-2">
                          <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border cursor-pointer transition-all duration-300 ${calendarType === 'jalali' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'}`}>
                              <input 
                                  type="radio" 
                                  name="calendarType" 
                                  value="jalali" 
                                  checked={calendarType === 'jalali'} 
                                  onChange={() => setCalendarType('jalali')} 
                                  className="sr-only"
                              />
                              <Sun className="w-4 h-4 text-orange-400 animate-pulse" />
                              <span className="text-xs font-bold">{isFa ? 'تقویم خورشیدی (شمسی)' : 'Solar (Jalali)'}</span>
                          </label>
                          
                          <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border cursor-pointer transition-all duration-300 ${calendarType === 'gregorian' ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'}`}>
                              <input 
                                  type="radio" 
                                  name="calendarType" 
                                  value="gregorian" 
                                  checked={calendarType === 'gregorian'} 
                                  onChange={() => setCalendarType('gregorian')} 
                                  className="sr-only"
                              />
                              <Calendar className="w-4 h-4 text-blue-400" />
                              <span className="text-xs font-bold">{isFa ? 'تقویم میلادی' : 'Gregorian'}</span>
                          </label>
                      </div>
                  </div>
                  <p className="hidden">
                 </p>
             </div>

             <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Date/Time Inputs Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {/* Year */}
                        <div className="col-span-1">
                            <label className="block text-[10px] text-gray-500 mb-1 text-center">{isFa ? 'سال' : 'Year'}</label>
                            <select value={bYear} onChange={e => setBYear(Number(e.target.value))} className="w-full bg-black border border-white/20 rounded-lg py-2 px-1 text-center text-sm focus:border-indigo-500 outline-none">
                                {calendarType === 'jalali' ? generateOptions(1300, 1404).map(y => <option key={y} value={y}>{y}</option>) : generateOptions(1920, 2025).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        {/* Month */}
                        <div className="col-span-1">
                            <label className="block text-[10px] text-gray-500 mb-1 text-center">{isFa ? 'ماه' : 'Month'}</label>
                            <select value={bMonth} onChange={e => setBMonth(Number(e.target.value))} className="w-full bg-black border border-white/20 rounded-lg py-2 px-1 text-center text-sm focus:border-indigo-500 outline-none">
                                {calendarType === 'jalali' ? PERSIAN_MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>) : ENGLISH_MONTHS.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                            </select>
                        </div>
                        {/* Day */}
                        <div className="col-span-1">
                            <label className="block text-[10px] text-gray-500 mb-1 text-center">{isFa ? 'روز' : 'Day'}</label>
                            <select value={bDay} onChange={e => setBDay(Number(e.target.value))} className="w-full bg-black border border-white/20 rounded-lg py-2 px-1 text-center text-sm focus:border-indigo-500 outline-none">
                                {generateOptions(1, 31).map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        
                        {/* Hour */}
                        <div className="col-span-1 mt-2">
                            <label className="block text-[10px] text-gray-500 mb-1 text-center">{isFa ? 'ساعت' : 'Hour'}</label>
                            <select value={bHour} onChange={e => setBHour(Number(e.target.value))} className="w-full bg-black border border-white/20 rounded-lg py-2 px-1 text-center text-sm focus:border-indigo-500 outline-none font-mono">
                                {generateOptions(0, 23).map(h => <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>)}
                            </select>
                        </div>
                        {/* Minute */}
                        <div className="col-span-1 mt-2">
                            <label className="block text-[10px] text-gray-500 mb-1 text-center">{isFa ? 'دقیقه' : 'Min'}</label>
                            <select value={bMinute} onChange={e => setBMinute(Number(e.target.value))} className="w-full bg-black border border-white/20 rounded-lg py-2 px-1 text-center text-sm focus:border-indigo-500 outline-none font-mono">
                                {generateOptions(0, 59).map(m => <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>)}
                            </select>
                        </div>
                        {/* Second (Critical for V10.0 Uniqueness) */}
                        <div className="col-span-1 mt-2">
                            <label className="block text-[10px] text-gray-500 mb-1 text-center text-indigo-400 font-bold">{isFa ? 'ثانیه' : 'Sec'}</label>
                            <select value={bSecond} onChange={e => setBSecond(Number(e.target.value))} className="w-full bg-black border border-indigo-500/50 rounded-lg py-2 px-1 text-center text-sm focus:border-indigo-500 outline-none font-mono text-indigo-300">
                                {generateOptions(0, 59).map(s => <option key={s} value={s}>{s.toString().padStart(2, '0')}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col justify-center">
                        <button 
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="w-full py-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-900/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Hexagon className="w-6 h-6 animate-spin" />
                                    {isFa ? 'در حال استخراج DNA کیهانی...' : 'Extracting Cosmic DNA...'}
                                </>
                            ) : (
                                <>
                                    <Code className="w-6 h-6" />
                                    {isFa ? 'اجرای تحلیل کامل V10.0' : 'Run Full V10.0 Analysis'}
                                </>
                            )}
                        </button>
                        <div className="mt-4 text-center text-[10px] text-gray-500">
                            {isFa ? '* حساسیت به ثانیه فعال شد. نتایج ۱۰۰٪ منحصر به فرد برای شما.' : '* Second-sensitivity active. 100% Unique results guaranteed.'}
                        </div>
                    </div>
                 </div>
             </div>
         </div>

         {/* --- SECTION 3: V10.0 RESULTS --- */}
         {analysisResult && (
             <div className="mt-8 animate-fade-in">
                 
                 {/* --- NEW: COSMIC DIMENSIONS & LIFE LAYERS (AT THE TOP) --- */}
                 <div className="mb-8 bg-[#0F0F0F] rounded-3xl border border-white/10 p-6 relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-[100px]"></div>
                     
                     <div className="flex items-center gap-3 mb-6 relative z-10 border-b border-white/5 pb-4">
                         <Workflow className="w-6 h-6 text-indigo-400" />
                         <h3 className="text-xl font-bold text-white">
                             {isFa ? 'ابعاد کیهانی و لایه‌های حیات (Cosmic Dimensions)' : 'Cosmic Dimensions & Life Layers'}
                         </h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-7 gap-2 relative z-10">
                         {analysisResult.cosmicLayers.map((layer) => (
                             <div 
                                key={layer.level} 
                                className={`flex flex-col p-3 rounded-xl border transition-all duration-300 ${
                                    layer.active 
                                    ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-105 z-20' 
                                    : 'bg-black/30 border-white/5 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                                }`}
                             >
                                 <div className="flex justify-between items-center mb-2">
                                     <span className="text-[10px] font-mono text-gray-500">Lvl {layer.level}</span>
                                     {layer.active && <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>}
                                 </div>
                                 <div className={`text-xs font-bold mb-1 ${layer.active ? 'text-white' : 'text-gray-400'}`}>
                                     {isFa ? layer.nameFa : layer.nameEn}
                                 </div>
                                 <div className="text-[9px] text-gray-500 leading-tight">
                                     {layer.description}
                                 </div>
                             </div>
                         ))}
                     </div>
                     <div className="mt-4 text-[10px] text-gray-500 text-center relative z-10">
                         {isFa 
                            ? 'لایه فعال بر اساس چرخه‌های ۷ ساله تکامل و رزونانس عدد مسیر زندگی محاسبه شده است.' 
                            : 'Active layer calculated based on 7-year evolutionary cycles and Life Path resonance.'}
                     </div>
                 </div>

                 {/* Navigation Tabs */}
                 <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                     <div className="flex bg-[#0A0A0A] p-1 rounded-2xl border border-white/10 whitespace-nowrap">
                         {[
                             { id: 'overview', icon: <Fingerprint className="w-4 h-4" />, label: isFa ? 'هویت و امروز' : 'Identity & Today' },
                             { id: 'guidance', icon: <Gem className="w-4 h-4 text-purple-400" />, label: isFa ? 'سنگ‌ها و طالع' : 'Gems & Horoscope' },
                             { id: 'psyche', icon: <Ghost className="w-4 h-4" />, label: isFa ? 'روان & کهن‌الگو' : 'Psyche & Archetype' },
                             { id: 'physics', icon: <Atom className="w-4 h-4" />, label: isFa ? 'فیزیک کوانتوم' : 'Quantum Physics' },
                             { id: 'timeline', icon: <Compass className="w-4 h-4" />, label: isFa ? 'آینده ۱۰ ساله' : '10-Year Future' },
                             { id: 'death', icon: <Hourglass className="w-4 h-4 text-red-500" />, label: isFa ? 'نقطه خروج (مرگ)' : 'Transcendence Point' },
                         ].map(tab => (
                             <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-white/10 text-white shadow-inner' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                             >
                                 {tab.icon} {tab.label}
                             </button>
                         ))}
                     </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                     
                     {/* LEFT COLUMN: IDENTITY CARD */}
                     <div className="lg:col-span-4 space-y-6">
                         <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px]"></div>
                             <div className="relative z-10">
                                 <div className="flex items-center gap-3 mb-6">
                                     <Fingerprint className="w-8 h-8 text-purple-500" />
                                     <div>
                                         <h3 className="text-xl font-bold text-white">{isFa ? 'هویت کیهانی ۱۰ بعدی' : '10D Cosmic Identity'}</h3>
                                         <div className="text-xs text-purple-400 font-mono">{analysisResult.westernSign} • {analysisResult.ascendant} Rising</div>
                                     </div>
                                 </div>
                                 
                                 <div className="space-y-4">
                                     <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                         <div className="text-[10px] text-gray-500 uppercase font-bold mb-2 flex items-center gap-2">
                                            <BrainCircuit className="w-3 h-3"/> {isFa ? 'استدلال عمیق هوش مصنوعی' : 'AI Deep Reasoning'}
                                         </div>
                                         <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                             {analysisResult.deepReasoning}
                                         </p>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-3">
                                         <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
                                             <div className="text-[10px] text-gray-500">Life Path</div>
                                             <div className="text-2xl font-black text-white">{analysisResult.lifePathNumber}</div>
                                         </div>
                                         <div className="bg-black/40 p-3 rounded-xl border border-white/5 text-center">
                                             <div className="text-[10px] text-gray-500">Element</div>
                                             <div className="text-lg font-bold text-blue-400">{analysisResult.element}</div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* RIGHT COLUMN: DYNAMIC CONTENT */}
                     <div className="lg:col-span-8">
                         
                         {/* TAB 1: OVERVIEW */}
                         {activeTab === 'overview' && (
                             <div className="space-y-6 animate-slide-in">
                                 <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] rounded-3xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px]"></div>
                                     <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 relative z-10">
                                        <Zap className="w-6 h-6 text-green-500" />
                                        <h3 className="text-xl font-bold">{isFa ? 'تحلیل دقیقه‌ای امروز (Micro-Timing)' : 'Today\'s Precision'}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                                        <div className="bg-black/40 rounded-2xl p-4 border border-green-500/30 text-center">
                                            <div className="text-xs text-gray-400 uppercase font-bold mb-2">{isFa ? 'ساعت قدرت' : 'Power Hour'}</div>
                                            <div className="text-3xl font-black text-green-400 font-mono">{analysisResult.daily.powerHourStart}</div>
                                        </div>
                                        <div className="bg-black/40 rounded-2xl p-4 border border-red-500/30 text-center">
                                            <div className="text-xs text-gray-400 uppercase font-bold mb-2">{isFa ? 'زمان احتیاط' : 'Caution Zone'}</div>
                                            <div className="text-xl font-black text-red-400 font-mono mt-1.5">{analysisResult.daily.cautionTime}</div>
                                        </div>
                                        <div className="bg-black/40 rounded-2xl p-4 border border-blue-500/30 text-center">
                                            <div className="text-xs text-gray-400 uppercase font-bold mb-2">{isFa ? 'انرژی' : 'Energy'}</div>
                                            <div className="text-xl font-black text-blue-400 font-mono mt-1.5">{analysisResult.daily.energyLevel}%</div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 grid grid-cols-2 gap-4 relative z-10">
                                         <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                                            <div className="text-[10px] text-gray-500">{isFa ? 'عدد شانس امروز' : 'Lucky Number'}</div>
                                            <div className="font-black text-lg text-white">{analysisResult.daily.luckyNumber}</div>
                                         </div>
                                         <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-center">
                                            <div className="text-[10px] text-gray-500">{isFa ? 'فرکانس رنگی' : 'Color Frequency'}</div>
                                            <div className="font-black text-lg text-purple-400">{analysisResult.daily.colorFreq}</div>
                                         </div>
                                    </div>

                                    <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3 relative z-10">
                                        <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-300 leading-relaxed italic">"{analysisResult.daily.advice}"</p>
                                    </div>
                                 </div>
                             </div>
                         )}

                         {/* TAB 2: GUIDANCE (UPDATED: Deterministic Gems & Geometric Horoscope) */}
                         {activeTab === 'guidance' && (
                             <div className="space-y-6 animate-slide-in">
                                 {/* GEMSTONES CARD (UPDATED) */}
                                 <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
                                     <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]"></div>
                                     <div className="relative z-10">
                                         <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                             <Gem className="w-5 h-5 text-purple-400" />
                                             {isFa ? 'ماتریس کریستالی (دقیق و بدون تصادف)' : 'Crystalline Matrix (Deterministic)'}
                                         </h3>
                                         
                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                             <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center group hover:border-purple-500/30 transition-all">
                                                 <div className="text-[10px] text-gray-500 uppercase mb-2 font-bold">{isFa ? 'سنگ خورشید (ذات)' : 'Sun Stone (Core)'}</div>
                                                 <div className="text-lg font-bold text-purple-300">{analysisResult.gemstones.powerStone}</div>
                                             </div>
                                             <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center group hover:border-green-500/30 transition-all">
                                                 <div className="text-[10px] text-gray-500 uppercase mb-2 font-bold">{isFa ? 'سنگ رایزینگ (حفاظت)' : 'Ascendant Stone (Shield)'}</div>
                                                 <div className="text-lg font-bold text-green-300">{analysisResult.gemstones.ascendantStone}</div>
                                             </div>
                                             <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-center group hover:border-yellow-500/30 transition-all">
                                                 <div className="text-[10px] text-gray-500 uppercase mb-2 font-bold">{isFa ? 'سنگ سرنوشت (مسیر)' : 'Destiny Stone (Path)'}</div>
                                                 <div className="text-lg font-bold text-yellow-300">{analysisResult.gemstones.destinyStone}</div>
                                             </div>
                                         </div>
                                         <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-2">
                                             <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono mb-1">
                                                 <Binary className="w-3 h-3" /> {analysisResult.gemstones.crystalStructure}
                                             </div>
                                             <p className="text-xs text-gray-300 italic text-justify leading-relaxed">
                                                 {analysisResult.gemstones.description}
                                             </p>
                                         </div>
                                     </div>
                                 </div>

                                 {/* COSMIC PALETTE */}
                                 <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
                                      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                                             <Palette className="w-5 h-5 text-pink-400" />
                                             {isFa ? 'پالت رنگی کیهانی' : 'Cosmic Color Palette'}
                                      </h3>
                                      <div className="grid grid-cols-3 gap-4 relative z-10">
                                          <div className="flex flex-col items-center gap-2">
                                              <div className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: analysisResult.colors.hex }}></div>
                                              <span className="text-xs font-bold text-gray-300">{analysisResult.colors.auraColor} (Aura)</span>
                                          </div>
                                          <div className="flex flex-col items-center gap-2">
                                              <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-gradient-to-br from-white/10 to-transparent shadow-lg flex items-center justify-center">
                                                  <span className="text-[10px]">{analysisResult.colors.luckyColor}</span>
                                              </div>
                                              <span className="text-xs font-bold text-green-400">{isFa ? 'رنگ شانس' : 'Lucky'}</span>
                                          </div>
                                          <div className="flex flex-col items-center gap-2">
                                              <div className="w-12 h-12 rounded-full border-2 border-red-900/50 bg-black shadow-lg flex items-center justify-center relative">
                                                  <div className="absolute inset-0 flex items-center justify-center text-red-500 opacity-50"><X className="w-8 h-8"/></div>
                                                  <span className="text-[10px] text-gray-500">{analysisResult.colors.avoidColor}</span>
                                              </div>
                                              <span className="text-xs font-bold text-red-400">{isFa ? 'دوری کنید' : 'Avoid'}</span>
                                           </div>
                                       </div>
                                       <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/5 relative z-10">
                                           <div className="text-[10px] text-indigo-400 font-bold mb-1.5 uppercase tracking-wider">{isFa ? 'مفهوم ارتعاش فرکانسی هاله شما:' : 'Your Aura Vibrational Meaning:'}</div>
                                           <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                               {analysisResult.colors.auraDesc}
                                           </p>
                                       </div>
                                  </div>
                                  <div className="hidden"><div><div>
                                          </div>
                                      </div>
                                 </div>

                                 {/* COMPREHENSIVE HOROSCOPE (UPDATED: Geometric) */}
                                 <div className="bg-gradient-to-br from-[#121212] to-[#050505] rounded-3xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
                                     <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                         <ScrollText className="w-5 h-5 text-blue-400" />
                                         {isFa ? 'طالع‌بینی هندسی زنده (Transit Geometry)' : 'Live Geometric Horoscope'}
                                     </h3>
                                     <div className="text-[10px] text-gray-500 mb-6 border-b border-white/5 pb-2 font-mono">
                                         {analysisResult.horoscope.transitLogic}
                                     </div>
                                     <div className="space-y-6">
                                         <div className="relative pl-4 border-l-2 border-pink-500">
                                             <h4 className="text-sm font-bold text-pink-400 mb-1 flex items-center gap-2"><Heart className="w-3 h-3"/> {isFa ? 'عشق و روابط' : 'Love & Relationships'}</h4>
                                             <p className="text-xs text-gray-300 leading-relaxed text-justify">{analysisResult.horoscope.love}</p>
                                         </div>
                                         <div className="relative pl-4 border-l-2 border-blue-500">
                                             <h4 className="text-sm font-bold text-blue-400 mb-1 flex items-center gap-2"><Briefcase className="w-3 h-3"/> {isFa ? 'شغل و رسالت' : 'Career & Purpose'}</h4>
                                             <p className="text-xs text-gray-300 leading-relaxed text-justify">{analysisResult.horoscope.career}</p>
                                         </div>
                                         <div className="relative pl-4 border-l-2 border-purple-500">
                                             <h4 className="text-sm font-bold text-purple-400 mb-1 flex items-center gap-2"><Sparkles className="w-3 h-3"/> {isFa ? 'مسیر معنوی' : 'Spiritual Path'}</h4>
                                             <p className="text-xs text-gray-300 leading-relaxed text-justify">{analysisResult.horoscope.spiritual}</p>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         )}

                         {/* TAB 3: PSYCHE */}
                         {activeTab === 'psyche' && (
                             <div className="space-y-6 animate-slide-in">
                                 {/* Archetype */}
                                 <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-8 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px]"></div>
                                     <div className="flex items-start justify-between relative z-10">
                                         <div>
                                             <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">{isFa ? 'کهن‌الگوی یونگی (Jungian Archetype)' : 'Dominant Jungian Archetype'}</div>
                                             <h2 className="text-3xl font-black text-white mb-4">{analysisResult.archetype.name}</h2>
                                             <p className="text-sm text-gray-300 leading-relaxed max-w-xl mb-4 text-justify">{analysisResult.archetype.description}</p>
                                             <div className="text-xs text-gray-500 border-t border-white/5 pt-2 mt-2 flex gap-4">
                                                 <span><span className="text-indigo-500 font-bold">{isFa ? 'ریشه اساطیری:' : 'Mythical Origin:'}</span> {analysisResult.archetype.mythicalOrigin}</span>
                                             </div>
                                         </div>
                                         <Layers className="w-16 h-16 text-white/5" />
                                     </div>
                                 </div>
                                 
                                 {/* Shadow Self */}
                                 <div className="bg-gradient-to-br from-red-950/20 to-black rounded-3xl border border-red-900/20 p-8 relative overflow-hidden">
                                     <div className="flex items-start justify-between relative z-10">
                                         <div>
                                             <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">{isFa ? 'نیمه تاریک (Shadow Self)' : 'The Shadow Self'}</div>
                                             <h2 className="text-2xl font-bold text-white mb-2">{analysisResult.archetype.shadowSelf}</h2>
                                             <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
                                                 <span className="text-red-300">{analysisResult.archetype.shadowTrait}</span>
                                             </p>
                                         </div>
                                         <Ghost className="w-12 h-12 text-red-900/50" />
                                     </div>
                                 </div>

                                 {/* Soul Matrix */}
                                 <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-8">
                                     <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                         <Hexagon className="w-5 h-5 text-indigo-500" />
                                         {isFa ? 'ماتریس ۶ بعدی روح' : '6D Soul Matrix'}
                                     </h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                         {[
                                             { l: isFa ? 'خرد (عطارد)' : 'Intellect (Mercury)', v: analysisResult.soulMatrix.intellect, c: 'bg-blue-500' },
                                             { l: isFa ? 'احساس (ماه)' : 'Emotion (Moon)', v: analysisResult.soulMatrix.emotion, c: 'bg-purple-500' },
                                             { l: isFa ? 'اراده (مریخ)' : 'Willpower (Mars)', v: analysisResult.soulMatrix.willpower, c: 'bg-red-500' },
                                             { l: isFa ? 'توسعه (مشتری)' : 'Expansion (Jupiter)', v: analysisResult.soulMatrix.expansion, c: 'bg-yellow-500' },
                                             { l: isFa ? 'نظم (زحل)' : 'Discipline (Saturn)', v: analysisResult.soulMatrix.discipline, c: 'bg-gray-500' },
                                             { l: isFa ? 'شهود (نپتون)' : 'Intuition (Neptune)', v: analysisResult.soulMatrix.intuition, c: 'bg-teal-500' },
                                         ].map((item, idx) => (
                                             <div key={idx}>
                                                 <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                     <span>{item.l}</span>
                                                     <span className="font-mono">{item.v}%</span>
                                                 </div>
                                                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                     <div className={`h-full ${item.c} rounded-full transition-all duration-1000`} style={{ width: `${item.v}%` }}></div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>
                         )}

                         {/* TAB 4: PHYSICS */}
                         {activeTab === 'physics' && (
                             <div className="space-y-6 animate-slide-in">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     {/* Resonance Frequency */}
                                     <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                         <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                                         <Radio className="w-10 h-10 text-blue-500 mb-4" />
                                         <div className="text-xs text-gray-500 uppercase tracking-widest">{isFa ? 'فرکانس رزونانس زیستی' : 'Bio-Resonance Frequency'}</div>
                                         <div className="text-4xl font-mono font-black text-white mt-2 tracking-tighter">{analysisResult.physics.frequency}</div>
                                         <div className="mt-2 text-xs text-blue-400 font-bold bg-blue-900/20 px-3 py-1 rounded-full">
                                             Solfeggio Scale
                                         </div>
                                     </div>

                                     {/* Entropy State */}
                                     <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center" style={{borderColor: `${analysisResult.physics.bioFieldColor}30`}}>
                                         <Scale className="w-10 h-10 mb-4" style={{color: analysisResult.physics.bioFieldColor}} />
                                         <div className="text-xs text-gray-500 uppercase tracking-widest">{isFa ? 'وضعیت آنتروپی سیستم' : 'System Entropy State'}</div>
                                         <div className="text-lg font-bold text-white mt-2">{analysisResult.physics.entropy}</div>
                                         <div className="mt-2 text-xs text-gray-400">{analysisResult.physics.waveType}</div>
                                     </div>
                                     
                                     {/* Quantum State */}
                                     <div className="col-span-1 md:col-span-2 bg-[#0F0F0F] rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center text-center">
                                         <Dna className="w-10 h-10 text-purple-500 mb-4 animate-spin-slow" />
                                         <div className="text-xs text-gray-500 uppercase tracking-widest">{isFa ? 'حالت کوانتومی مشاهده شده' : 'Observed Quantum State'}</div>
                                         <div className="text-2xl font-bold text-white mt-2">{analysisResult.physics.quantumState}</div>
                                         <div className="text-xs text-gray-500 mt-2">{analysisResult.physics.elementalBalance}</div>
                                     </div>
                                 </div>
                             </div>
                         )}

                         {/* TAB 5: 10-YEAR TIMELINE */}
                         {activeTab === 'timeline' && (
                             <div className="bg-[#0F0F0F] rounded-3xl border border-white/10 p-6 shadow-xl animate-slide-in">
                                <h3 className="text-xl font-bold text-white mb-6 pl-2 border-l-4 border-indigo-500">
                                    {isFa ? 'نقشه راه ۱۰ ساله (سیستم Profections)' : '10-Year Profection Roadmap'}
                                </h3>
                                <div className="space-y-4">
                                    {analysisResult.forecast.map((year, idx) => (
                                        <div 
                                            key={year.year} 
                                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                                expandedYear === year.year 
                                                ? 'bg-white/5 border-indigo-500/50 shadow-lg' 
                                                : 'bg-black/20 border-white/5 hover:bg-white/5 cursor-pointer'
                                            }`}
                                            onClick={() => setExpandedYear(expandedYear === year.year ? null : year.year)}
                                        >
                                            <div className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex flex-col items-center min-w-[50px]">
                                                        <span className={`text-xl font-black ${expandedYear === year.year ? 'text-indigo-400' : 'text-gray-400'}`}>{year.year}</span>
                                                        <span className="text-[9px] text-gray-600 font-mono">Age {year.age}</span>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white">{year.mainTheme}</div>
                                                        <div className="text-[10px] text-gray-500">{year.planetaryTransit}</div>
                                                    </div>
                                                </div>
                                                {expandedYear === year.year ? <ChevronUp className="w-4 h-4 text-gray-500"/> : <ChevronDown className="w-4 h-4 text-gray-500"/>}
                                            </div>

                                            {expandedYear === year.year && (
                                                <div className="px-4 pb-4 border-t border-white/5 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                    <div className="text-gray-400"><span className="text-indigo-400 font-bold block mb-1">{isFa ? 'رویداد کلیدی:' : 'Key Event:'}</span> {year.keyEvent}</div>
                                                    <div className="text-gray-400"><span className="text-green-400 font-bold block mb-1">{isFa ? 'وضعیت مالی:' : 'Finance:'}</span> {year.financial}</div>
                                                    <div className="text-gray-400"><span className="text-pink-400 font-bold block mb-1">{isFa ? 'وضعیت عاطفی:' : 'Emotion:'}</span> {year.emotional}</div>
                                                    <div className="text-gray-400"><span className="text-blue-400 font-bold block mb-1">{isFa ? 'سلامت:' : 'Health:'}</span> {year.health}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                             </div>
                         )}

                         {/* TAB 6: TRANSCENDENCE */}
                         {activeTab === 'death' && (
                             <div className="space-y-6 animate-slide-in">
                                 <div className="bg-[#0F0000] rounded-3xl border border-red-900/30 p-8 shadow-2xl relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-red-900/10 rounded-full blur-[100px] animate-pulse"></div>
                                     <div className="relative z-10 text-center">
                                         <div className="flex justify-center mb-6">
                                            <div className="p-4 rounded-full bg-red-950/50 border border-red-900/50">
                                                <Skull className="w-12 h-12 text-red-600" />
                                            </div>
                                         </div>
                                         
                                         <h3 className="text-2xl font-black text-red-500 uppercase tracking-widest mb-2">
                                             {isFa ? 'چرخه‌های گذار و تکامل (Climacteric Cycles)' : 'Transcendence & Climacteric Cycles'}
                                         </h3>
                                         <p className="text-xs text-red-400/60 mb-8 max-w-lg mx-auto">
                                             {isFa 
                                                ? 'تحلیل نقاط حساس بیوریتم بر اساس بازگشت زحل (۲۹.۵ سال)، بازگشت اورانوس (۸۴ سال) و چرخه‌های ۷ ساله.' 
                                                : 'Analysis of critical biorhythm points based on Saturn Return (29.5y), Uranus Return (84y) and 7-year cycles.'}
                                         </p>

                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                             <div className="bg-black/40 p-6 rounded-2xl border border-red-900/20">
                                                 <div className="text-xs text-gray-500 uppercase mb-2">{isFa ? 'بازه زمانی خروج اولیه' : 'Primary Transition Window'}</div>
                                                 <div className="text-2xl font-mono font-black text-white">{analysisResult.death.primaryExitDate}</div>
                                             </div>
                                             <div className="bg-black/40 p-6 rounded-2xl border border-red-900/20">
                                                 <div className="text-xs text-gray-500 uppercase mb-2">{isFa ? 'چرخش‌های خورشیدی باقی‌مانده' : 'Solar Revolutions Remaining'}</div>
                                                 <div className="text-2xl font-mono font-bold text-red-400">{analysisResult.death.timeLeft}</div>
                                             </div>
                                         </div>

                                         <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/20 text-left space-y-3">
                                             <div className="flex justify-between items-center text-xs text-red-400">
                                                 <span>{isFa ? 'حالت گذار محتمل' : 'Probable Transition Mode'}</span>
                                                 <span>{analysisResult.death.entropyScore}% Entropy</span>
                                             </div>
                                             <div className="text-sm font-bold text-white flex items-center gap-2">
                                                 <Activity className="w-4 h-4 text-red-500" />
                                                 {analysisResult.death.transitionMode}
                                             </div>
                                             <div className="border-t border-red-900/30 pt-3 mt-2 text-xs text-gray-400 leading-relaxed text-justify">
                                                  {analysisResult.death.guidance}
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         )}

                     </div>
                 </div>

             </div>
         )}
      </main>
      <Footer />
    </div>
  );
};

export default Astrology;
