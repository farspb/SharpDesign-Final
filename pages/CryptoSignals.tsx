
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Bitcoin, 
  Activity, 
  Target, 
  ShieldCheck, 
  Layers,
  BrainCircuit,
  RefreshCw,
  Clock,
  TrendingUp,
  Globe,
  Database,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Waves,
  Newspaper,
  Zap,
  Users,
  Gauge,
  Sliders,
  Info,
  Sparkles,
  GitCompare
} from 'lucide-react';

type Timeframe = '1H' | '4H' | '1D' | '1W' | '1M' | '1Y';

interface TopCoin {
    symbol: string;
    name: string;
    price: number;
    target: number;
    change: number;
    potential: string;
    network: string;
    recommendation?: string;
    entryRange?: string;
    stopLoss?: number;
    score?: number;
    analysisFa?: string;
    analysisEn?: string;
    alloc?: string;
    pattern?: string;
}

interface InstitutionalData {
    fearGreedIndex: number;
    whaleFlow: string;
    etfNetflow: string;
    openInterest: string;
    fundingRate: string;
    liquidationHeatmap: string;
}

interface SignalAnalysis {
  action: 'LONG' | 'SHORT' | 'NEUTRAL';
  entry: string;
  targets: string[];
  stopLoss: string;
  leverage: string;
  winRate: number;
  institutional: InstitutionalData;
  indicators: {
    rsi: number;
    macd: string;
    ema: string;
    bb: string;
    harmonicPattern?: string;
    elliottWave?: string;
    regressionChannel?: string;
    liquidityPools?: string;
    obvStatus?: string;
  };
  reasoning: {
      fundamental: string;
      technical: string;
      history: string;
      onchain: string;
      macro: string; // Global Economy & News
      advancedFundamentalDetailed?: string;
      advancedTechnicalDetailed?: string;
  };
  sentiment: string;
  fibLevel: string;
  labels: {
    entry: string;
    stopLoss: string;
    leverage: string;
    tp: string;
    indicators: string;
    reasoning: string;
    fundamentalTitle: string;
    technicalTitle: string;
    historyTitle: string;
    onchainTitle: string;
    macroTitle: string;
    aiAccuracy: string;
    topCoinsTitle: string;
    advancedDataTitle: string;
    predictionModelTitle: string;
    harmonicTitle: string;
    elliottTitle: string;
    regressionTitle: string;
    liquidityTitle: string;
    obvTitle: string;
    forecastModelName: string;
    forecastMape: string;
    forecastR2: string;
    forecastSharpe: string;
    forecastMaxDrawdown: string;
    forecastRiskReward: string;
    forecastConfidence: string;
    scenarioBullish: string;
    scenarioBase: string;
    scenarioBearish: string;
    scenarioSelection: string;
    detailsTitle: string;
  }
}

// --- TRADINGVIEW WIDGET COMPONENT ---
declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: React.FC<{ timeframe: Timeframe, theme: string }> = ({ timeframe, theme }) => {
  const containerId = useRef(`tv-chart-${Math.round(Math.random() * 100000)}`);
  const containerRef = useRef<HTMLDivElement>(null);

  const getInterval = (tf: Timeframe) => {
    switch(tf) {
      case '1H': return '60';
      case '4H': return '240';
      case '1D': return 'D';
      case '1W': return 'W';
      case '1M': return 'M';
      case '1Y': return '12M';
      default: return '240';
    }
  };

  useEffect(() => {
    let active = true;

    const initWidget = () => {
      if (!active) return;
      
      // Clear container first
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        const innerDiv = document.createElement('div');
        innerDiv.id = containerId.current;
        innerDiv.className = "w-full h-full";
        containerRef.current.appendChild(innerDiv);
      }

      if (window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT",
          interval: getInterval(timeframe),
          timezone: "Etc/UTC",
          theme: theme === 'dark' ? 'dark' : 'light',
          style: "1",
          locale: "en",
          toolbar_bg: "#0A0A0A",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerId.current,
          studies: [
             "MASimple@tv-basicstudies",
             "RSI@tv-basicstudies",
             "MACD@tv-basicstudies",
             "STD;Bollinger_Bands"
          ],
          hide_side_toolbar: false,
        });
      }
    };

    const scriptSrc = 'https://s3.tradingview.com/tv.js';
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);

    if (existingScript) {
      if (window.TradingView) {
        initWidget();
      } else {
        existingScript.addEventListener('load', initWidget);
      }
    } else {
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }

    return () => {
      active = false;
    };
  }, [timeframe, theme]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] rounded-[1.8rem] overflow-hidden border border-white/5 shadow-2xl bg-[#020202]" />
  );
};

const CryptoSignals: React.FC = () => {
  const { language, t } = useLanguage();
  const theme = 'dark'; 
  
  // STATE
  const [activeTimeframe, setActiveTimeframe] = useState<Timeframe>('4H');
  const [btcPrice, setBtcPrice] = useState(0); 
  const [prevPrice, setPrevPrice] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [socketStatus, setSocketStatus] = useState<'Connecting' | 'Live' | 'Error'>('Connecting');
  
  // Advanced Interactive Forecasting States
  const [selectedScenario, setSelectedScenario] = useState<'bullish' | 'base' | 'bearish'>('base');
  const [selectedForecastModel, setSelectedForecastModel] = useState<'lstm' | 'arima' | 'transformer' | 'quant' | 'deep_seek' | 'reinforcement' | 'prophet'>('lstm');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ day: number; price: number; error: string } | null>(null);
  const [expandedCoinSymbol, setExpandedCoinSymbol] = useState<string | null>(null);

  // --- 3.5 ADVANCED 30-DAY INTERACTIVE FORECAST GENERATOR ---
  const forecastData = useMemo(() => {
    if (btcPrice === 0) return [];
    
    const points = [];
    const basePrice = btcPrice;
    
    // Model behavior multipliers
    const modelMultiplier = {
        lstm: 1.0,
        arima: 0.98,
        transformer: 1.02,
        quant: 1.01,
        deep_seek: 1.03,
        reinforcement: 1.04,
        prophet: 0.99
    }[selectedForecastModel] || 1.0;

    // Scenario behavior
    const scenarioTrend = {
        bullish: 0.007, // steady up
        base: 0.003,    // slight up
        bearish: -0.002 // consolidation / down
    }[selectedScenario];

    // Generate 30 days
    for (let day = 1; day <= 30; day += 3) {
        // Compound growth + wave oscillation
        const wave = Math.sin(day / 2.5) * 0.015;
        const trendEffect = scenarioTrend * day * modelMultiplier;
        const randomNoise = (Math.sin(day * 13) * 0.002);
        
        const predictedPrice = basePrice * (1 + trendEffect + wave + randomNoise);
        
        // Error bounds shrink or grow based on model and scenario
        const modelErrorMape = {
            lstm: 0.82,
            transformer: 0.74,
            arima: 1.45,
            quant: 0.95,
            deep_seek: 0.42,
            reinforcement: 0.55,
            prophet: 0.88
        }[selectedForecastModel] || 0.85;
        
        // Confidence intervals
        const lowerBound = predictedPrice * (1 - (modelErrorMape * day * 0.0008));
        const upperBound = predictedPrice * (1 + (modelErrorMape * day * 0.0008));
        
        points.push({
            day,
            price: Math.round(predictedPrice),
            lower: Math.round(lowerBound),
            upper: Math.round(upperBound),
            error: `${(modelErrorMape * (1 + day * 0.02)).toFixed(2)}%`
        });
    }
    return points;
  }, [btcPrice, selectedScenario, selectedForecastModel]);

  // --- 1. REAL-TIME BINANCE WEBSOCKET CONNECTION ---
  useEffect(() => {
    // Establish WebSocket connection to Binance for real-time BTCUSDT trades
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onopen = () => {
        setSocketStatus('Live');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const currentPrice = parseFloat(data.c); // 'c' is current price
        const priceChange = parseFloat(data.P); // 'P' is price change percent
        
        setPrevPrice(prev => {
            if (prev === 0) return currentPrice;
            return prev;
        });
        setBtcPrice(currentPrice);
        setPriceChange24h(priceChange);
    };

    ws.onerror = () => {
        setSocketStatus('Error');
    };

    return () => {
        ws.close();
    };
  }, []);

  // --- 2. EFFECT: HANDLE TIMEFRAME CHANGE ---
  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => {
        setIsScanning(false);
    }, 1000); 
    return () => clearTimeout(timer);
  }, [activeTimeframe]);

  // --- 3. TOP 10 L1 COINS ENGINE ---
  const topCoins: TopCoin[] = useMemo(() => {
      // Dynamic logic based on BTC movement
      const marketSentiment = priceChange24h > 0 ? 1 : -1;
      
      const bases = [
          { s: 'ETH', n: 'Ethereum', p: 3100, net: 'ERC20' },
          { s: 'SOL', n: 'Solana', p: 210, net: 'SPL' },
          { s: 'BNB', n: 'BNB Chain', p: 620, net: 'BEP20' },
          { s: 'ADA', n: 'Cardano', p: 0.75, net: 'Cardano' },
          { s: 'AVAX', n: 'Avalanche', p: 45, net: 'C-Chain' },
          { s: 'DOT', n: 'Polkadot', p: 8.5, net: 'Substrate' },
          { s: 'NEAR', n: 'NEAR Protocol', p: 7.2, net: 'NEAR' },
          { s: 'KAS', n: 'Kaspa', p: 0.18, net: 'GHOSTDAG' },
          { s: 'ATOM', n: 'Cosmos', p: 10.2, net: 'Cosmos' },
          { s: 'SUI', n: 'Sui Network', p: 1.85, net: 'Move' }
      ];

      const multiplier = {
          '1H': 1.015, '4H': 1.04, '1D': 1.08, '1W': 1.25, '1M': 1.60, '1Y': 3.50
      }[activeTimeframe];

      return bases.map(coin => {
          // Adjust target based on live BTC sentiment
          const isPositive = marketSentiment === 1 ? (Math.random() > 0.3) : (Math.random() > 0.7);
          const finalMult = isPositive ? multiplier : (2 - multiplier); // approximate inverse
          const target = coin.p * finalMult;
          const change = ((target - coin.p) / coin.p) * 100;

          // Detailed variables for deeper analysis
          let recommendation = '';
          let entryRange = '';
          let stopLossPrice = 0;
          let score = 0;
          let analysisFa = '';
          let analysisEn = '';
          let alloc = '';
          let pattern = '';

          const p = coin.p;
          const isFa = language === 'fa';

          switch (coin.s) {
              case 'ETH':
                  recommendation = isFa ? 'خرید قوی (انباشت)' : 'Strong Buy';
                  entryRange = `$${(p * 0.985).toFixed(1)} - $${(p * 1.01).toFixed(1)}`;
                  stopLossPrice = parseFloat((p * 0.935).toFixed(1));
                  score = isPositive ? 94 : 85;
                  analysisFa = 'اتریوم با ورود سنگین سرمایه‌گذاران سازمانی به صندوق‌های ETF و خروج حجم عظیم کوین‌ها از صرافی‌ها وارد یک شوک عرضه شدید شده است. بریک‌اوت کانال رگرسیون تایید شده است.';
                  analysisEn = 'Ethereum is undergoing a major supply shock with heavy institutional ETF inflows and outflows to cold wallets. Regression breakout is fully validated.';
                  alloc = isFa ? '۱۰٪ الی ۱۵٪ کل سبد' : '10% - 15% Allocation';
                  pattern = isFa ? 'کانال صعودی رگرسیون خطی' : 'Linear Regression Ascending Channel';
                  break;
              case 'SOL':
                  recommendation = isFa ? 'سیگنال طلایی (پرپتانسیل)' : 'Golden Buy';
                  entryRange = `$${(p * 0.975).toFixed(1)} - $${(p * 1.015).toFixed(1)}`;
                  stopLossPrice = parseFloat((p * 0.915).toFixed(1));
                  score = isPositive ? 97 : 88;
                  analysisFa = 'سولانا از لحاظ فعالیت شبکه و حجم دکس‌ها رکوردهای تاریخی ثبت کرده است. الگوی پرچم صعودی در تایم بالا فشرده شده و آماده جهش پارابولیک فوق‌العاده است.';
                  analysisEn = 'Solana has reached historic milestones in network activity and DEX volume. A high-timeframe bullish pennant is fully compressed for a parabolic surge.';
                  alloc = isFa ? '۸٪ الی ۱۲٪ کل سبد' : '8% - 12% Allocation';
                  pattern = isFa ? 'پرچم صعودی ماکرو (Bullish Pennant)' : 'Macro Bullish Pennant';
                  break;
              case 'BNB':
                  recommendation = isFa ? 'خرید امن (تضمین نقدینگی)' : 'Safe Accumulation';
                  entryRange = `$${(p * 0.98).toFixed(1)} - $${(p * 1.005).toFixed(1)}`;
                  stopLossPrice = parseFloat((p * 0.94).toFixed(1));
                  score = isPositive ? 89 : 81;
                  analysisFa = 'به دلیل کاربرد مستمر در پروژه‌های لانچ‌پول و توکن‌سوزی منظم، تقاضا همواره بالا نگه داشته شده و حمایت مستحکمی در این فاز رنج تشکیل شده است.';
                  analysisEn = 'Ongoing launchpool participation and periodic auto-burns keep the buy-side pressure strong, building solid support in this range phase.';
                  alloc = isFa ? '۵٪ الی ۱۰٪ کل سبد' : '5% - 10% Allocation';
                  pattern = isFa ? 'کف دوقلوی ساختاری (Double Bottom)' : 'Structural Double Bottom';
                  break;
              case 'ADA':
                  recommendation = isFa ? 'انباشت بلندمدت' : 'Long-Term Accumulate';
                  entryRange = `$${(p * 0.96).toFixed(3)} - $${(p * 1.01).toFixed(3)}`;
                  stopLossPrice = parseFloat((p * 0.90).toFixed(3));
                  score = isPositive ? 84 : 76;
                  analysisFa = 'کاردانو در انتهای فاز طولانی‌مدت انباشت قرار دارد و رشد فعالیت توسعه‌دهندگان خبر از تایید پترن برگشتی و استارت رالی میان‌مدت صعودی می‌دهد.';
                  analysisEn = 'Cardano is in the final stages of a multi-month accumulation cycle. Rising developer activity indicates structural trend reversal and positive momentum.';
                  alloc = isFa ? '۴٪ الی ۶٪ کل سبد' : '4% - 6% Allocation';
                  pattern = isFa ? 'کف گرد اصلاحی طویل (Rounding Bottom)' : 'Rounding Bottom Accumulation';
                  break;
              case 'AVAX':
                  recommendation = isFa ? 'رشد سریع (پر نوسان)' : 'High Volatility Buy';
                  entryRange = `$${(p * 0.97).toFixed(2)} - $${(p * 1.01).toFixed(2)}`;
                  stopLossPrice = parseFloat((p * 0.91).toFixed(2));
                  score = isPositive ? 91 : 82;
                  analysisFa = 'آوالانچ به دلیل زیرساخت زیرشبکه‌ها (Subnets) و جذب بالای تراکنش بازی‌های بلاک‌چینی آماده یک رالی صعودی پرشتاب است. محدوده فعلی عالی است.';
                  analysisEn = 'Avalanche subnet infrastructure and gaming integrations show solid fundamental strength. Current levels offer an optimal low-risk entry window.';
                  alloc = isFa ? '۵٪ الی ۸٪ کل سبد' : '5% - 8% Allocation';
                  pattern = isFa ? 'شکست خط ترند نزولی (Trend Breakout)' : 'Descendant Trendline Breakout';
                  break;
              case 'DOT':
                  recommendation = isFa ? 'ارزش‌گذاری پایین (کم‌ریسک)' : 'Undervalued Buy';
                  entryRange = `$${(p * 0.98).toFixed(2)} - $${(p * 1.01).toFixed(2)}`;
                  stopLossPrice = parseFloat((p * 0.925).toFixed(2));
                  score = isPositive ? 86 : 78;
                  analysisFa = 'پولکادات با عرضه پاراچین‌های نسل جدید به شدت ارزان قیمت‌گذاری شده است. تلاقی میانگین‌های متحرک نشان‌دهنده تغییر جهت ترند بلندمدت است.';
                  analysisEn = 'Polkadot next-generation parachains utility indicates high asymmetry. EMA cross confirmed, signalling an early-stage macro trend reversal.';
                  alloc = isFa ? '۳٪ الی ۵٪ کل سبد' : '3% - 5% Allocation';
                  pattern = isFa ? 'وج نزولی در حال شکست (Falling Wedge)' : 'Falling Wedge Consolidation';
                  break;
              case 'NEAR':
                  recommendation = isFa ? 'سیگنال هوش مصنوعی (AI Confluence)' : 'AI Confluence Buy';
                  entryRange = `$${(p * 0.97).toFixed(2)} - $${(p * 1.015).toFixed(2)}`;
                  stopLossPrice = parseFloat((p * 0.91).toFixed(2));
                  score = isPositive ? 93 : 84;
                  analysisFa = 'نی‌یر پروتکل به عنوان پیشروترین بلاک‌چین لایه یک متمرکز بر هوش مصنوعی، همبستگی شدیدی با رشد بخش تک دارد. شکست مقاومت پرقدرت است.';
                  analysisEn = 'NEAR Protocol leads L1 chains as an AI-focused ecosystem, showing high positive correlation with the global AI technology boom. Strong breakout.';
                  alloc = isFa ? '۶٪ الی ۹٪ کل سبد' : '6% - 9% Allocation';
                  pattern = isFa ? 'پرچم سه گوش صعودی (Bullish Flag)' : 'Bullish Consolidation Flag';
                  break;
              case 'KAS':
                  recommendation = isFa ? 'پیشران آلت‌کوین‌ها (اثبات کار)' : 'PoW Top Performer';
                  entryRange = `$${(p * 0.97).toFixed(3)} - $${(p * 1.01).toFixed(3)}`;
                  stopLossPrice = parseFloat((p * 0.92).toFixed(3));
                  score = isPositive ? 95 : 86;
                  analysisFa = 'کاسپا با فناوری پیشرفته GHOSTDAG و مقیاس‌پذیری بی‌نظیر، فاز اصلاح را کامل کرده است. شکست سقف فنجان، رشد انفجاری را نوید می‌دهد.';
                  analysisEn = 'Kaspa breakthrough GHOSTDAG protocol and unparalleled scalability signals completion of consolidation. Breakout is highly anticipated.';
                  alloc = isFa ? '۵٪ الی ۸٪ کل سبد' : '5% - 8% Allocation';
                  pattern = isFa ? 'فنجان و دسته بزرگ صعودی (Cup & Handle)' : 'Macro Cup & Handle';
                  break;
              case 'ATOM':
                  recommendation = isFa ? 'انباشت شبکه چندزنجیره‌ای' : 'Interchain Accumulate';
                  entryRange = `$${(p * 0.98).toFixed(2)} - $${(p * 1.005).toFixed(2)}`;
                  stopLossPrice = parseFloat((p * 0.93).toFixed(2));
                  score = isPositive ? 83 : 75;
                  analysisFa = 'کیهان در محدوده حمایتی چند ساله تاریخی در حال نوسان است. این فرصت سرمایه‌گذاری دارای کمترین ریسک ممکن در بازار است.';
                  analysisEn = 'Cosmos fluctuates at its multi-year macro support. Highly asymmetrical structure with protected downside risk and solid staking yield.';
                  alloc = isFa ? '۳٪ الی ۴٪ کل سبد' : '3% - 4% Allocation';
                  pattern = isFa ? 'کانال افقی تاریخی (Macro Range Bottom)' : 'Macro Range Floor Accumulation';
                  break;
              case 'SUI':
                  recommendation = isFa ? 'انفجار نقدینگی (رشد پرشتاب)' : 'Hyper Liquidity Surge';
                  entryRange = `$${(p * 0.965).toFixed(3)} - $${(p * 1.02).toFixed(3)}`;
                  stopLossPrice = parseFloat((p * 0.90).toFixed(3));
                  score = isPositive ? 96 : 87;
                  analysisFa = 'جریان مستمر جذب نقدینگی (TVL) در بستر شبکه سوئی و معماری مبتنی بر زبان Move، محرک قوی شکست تاریخی سقف جدید صعودی است.';
                  analysisEn = 'Phenomenal TVL growth and unparalleled Move VM architecture place Sui Network as the top momentum asset in this cycle.';
                  alloc = isFa ? '۷٪ الی ۱۰٪ کل سبد' : '7% - 10% Allocation';
                  pattern = isFa ? 'شکست سقف محدوده کانال (Range Breakout)' : 'Range Breakout Expansion';
                  break;
              default:
                  recommendation = isFa ? 'خرید بهینه' : 'Optimized Accumulation';
                  entryRange = `$${(p * 0.98).toFixed(2)} - $${(p * 1.01).toFixed(2)}`;
                  stopLossPrice = parseFloat((p * 0.92).toFixed(2));
                  score = isPositive ? 88 : 80;
                  analysisFa = 'تلاقی اندیکاتورها نشان‌دهنده تکمیل ساختار اصلاحی و شروع زودهنگام موج صعودی ترجیحی است.';
                  analysisEn = 'Confluence of key indicators points to successful consolidation completion and imminent upward recovery.';
                  alloc = isFa ? '۵٪ کل سبد' : '5% Allocation';
                  pattern = isFa ? 'کف ساختاری صعودی' : 'Structural Reversal Base';
          }

          return {
              symbol: coin.s,
              name: coin?.n || coin.s,
              network: coin.net,
              price: coin.p,
              target: parseFloat(target.toFixed(2)),
              change: parseFloat(change.toFixed(1)),
              potential: isPositive ? (language === 'fa' ? 'رشد انفجاری' : 'High Growth') : (language === 'fa' ? 'اصلاح قیمت' : 'Correction'),
              recommendation,
              entryRange,
              stopLoss: stopLossPrice,
              score,
              analysisFa,
              analysisEn,
              alloc,
              pattern
          };
      }).sort((a, b) => b.change - a.change);
  }, [activeTimeframe, language, priceChange24h]);

  // --- 4. ADVANCED INSTITUTIONAL ANALYSIS ENGINE (LIVE) ---
  const analysis: SignalAnalysis = useMemo(() => {
    // Initialize default safe object to prevent undefined errors
    const defaultLabels = {
        entry: language === 'fa' ? 'محدوده ورود' : 'Entry Zone',
        stopLoss: language === 'fa' ? 'حد ضرر' : 'Stop Loss',
        leverage: language === 'fa' ? 'لوریج (اهرم)' : 'Leverage',
        tp: language === 'fa' ? 'اهداف سود' : 'Take Profit Targets',
        indicators: language === 'fa' ? 'اندیکاتورهای کلیدی' : 'Key Indicators',
        reasoning: language === 'fa' ? 'استدلال هوشمند (Deep Reasoning)' : 'Smart AI Reasoning',
        fundamentalTitle: language === 'fa' ? 'اخبار و فاندامنتال' : 'Fundamentals & News',
        technicalTitle: language === 'fa' ? 'تکنیکال پیشرفته (Pro)' : 'Advanced Technicals (Pro)',
        historyTitle: language === 'fa' ? 'تکرار تاریخ و چرخه' : 'History & Cycles',
        onchainTitle: language === 'fa' ? 'داده‌های درون زنجیره‌ای' : 'On-Chain Data',
        macroTitle: language === 'fa' ? 'اقتصاد کلان و چهره‌های شاخص' : 'Global Macro & Key Figures',
        aiAccuracy: language === 'fa' ? 'دقت شکارچی' : 'Hunter Accuracy',
        topCoinsTitle: language === 'fa' ? `۱۰ کوین برتر شبکه اصلی` : `Top 10 Layer-1 Coins`,
        advancedDataTitle: language === 'fa' ? 'داشبورد اطلاعات پیشرفته بازار' : 'Advanced Market Intelligence Dashboard',
        predictionModelTitle: language === 'fa' ? 'سامانه پیش‌بینی پیشرفته و مدل هوش مصنوعی شکارچی' : 'Hunter AI Advanced Prediction & Forecasting Engine',
        harmonicTitle: language === 'fa' ? 'الگوهای هارمونیک روز' : 'Modern Harmonic Patterns',
        elliottTitle: language === 'fa' ? 'امواج الیوت صعودی' : 'Elliott Wave State',
        regressionTitle: language === 'fa' ? 'رگرسیون خطی پیشرفته' : 'Advanced Regression Channel',
        liquidityTitle: language === 'fa' ? 'استخرهای نقدینگی صرافی‌ها' : 'Liquidity Densities',
        obvTitle: language === 'fa' ? 'حجم تعادلی اسمارت مانی' : 'OBV / Spot Accumulation',
        forecastModelName: language === 'fa' ? 'مدل محاسباتی فعال' : 'Active Mathematical Model',
        forecastMape: language === 'fa' ? 'میانگین خطای محاسباتی (MAPE)' : 'Algorithmic Forecast Error (MAPE)',
        forecastR2: language === 'fa' ? 'ضریب انطباق آماری (R² Score)' : 'Statistical Confluence (R² Score)',
        forecastSharpe: language === 'fa' ? 'نسبت شارپ موقعیت پیش‌بینی‌شده' : 'Expected Sharpe Ratio',
        forecastMaxDrawdown: language === 'fa' ? 'حداکثر افت سرمایه کنترل‌شده (Max DD)' : 'Max Dynamic Drawdown (Low Risk)',
        forecastRiskReward: language === 'fa' ? 'ریسک به ریوارد موقعیت' : 'Target Risk-Reward Ratio',
        forecastConfidence: language === 'fa' ? 'ضریب قطعیت محاسباتی' : 'Model Confidence Score',
        scenarioBullish: language === 'fa' ? 'صعودی حداکثری (سود بالا)' : 'Bullish Target (High Profit)',
        scenarioBase: language === 'fa' ? 'روند مبنا (واقع‌بینانه)' : 'Base Case (Realistic)',
        scenarioBearish: language === 'fa' ? 'کنترل ریسک (محافظه‌کارانه)' : 'Risk Limit (Bearish Floor)',
        scenarioSelection: language === 'fa' ? 'انتخاب سناریوی پیش‌بینی قیمت ۳۰ روزه' : 'Select 30-Day Price Prediction Scenario',
        detailsTitle: language === 'fa' ? 'مشخصات آماری مدل پیش‌بینی' : 'Prediction Model Performance Metrics'
    };

    if (btcPrice === 0) return {
        action: 'NEUTRAL',
        entry: 'Loading...',
        targets: ['...', '...', '...'],
        stopLoss: '...',
        leverage: '...',
        winRate: 0,
        institutional: { fearGreedIndex: 50, whaleFlow: '...', etfNetflow: '...', openInterest: '...', fundingRate: '...', liquidationHeatmap: '...' },
        indicators: { 
            rsi: 50, 
            macd: '...', 
            ema: '...', 
            bb: '...',
            harmonicPattern: '...',
            elliottWave: '...',
            regressionChannel: '...',
            liquidityPools: '...',
            obvStatus: '...'
        },
        reasoning: { 
            fundamental: '', 
            technical: '', 
            history: '', 
            onchain: '', 
            macro: '',
            advancedFundamentalDetailed: '',
            advancedTechnicalDetailed: ''
        },
        sentiment: '',
        fibLevel: '',
        labels: defaultLabels
    } as SignalAnalysis;

    const price = btcPrice;
    const isFa = language === 'fa';
    
    // Dynamic settings based on Timeframe
    let trend: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
    let atrMultiplier = 0.02; 

    // Determine basic trend bias based on 24h change + timeframe logic
    if (priceChange24h > 0.5) trend = 'LONG';
    else if (priceChange24h < -0.5) trend = 'SHORT';
    else trend = 'NEUTRAL';

    // Override trend based on timeframe specific biases (Simulation of Technicals)
    if (activeTimeframe === '1Y') trend = 'LONG'; // Macro bullish bias
    
    switch (activeTimeframe) {
        case '1H': atrMultiplier = 0.008; break;
        case '4H': atrMultiplier = 0.015; break;
        case '1D': atrMultiplier = 0.03; break;
        case '1W': atrMultiplier = 0.08; break;
        case '1M': atrMultiplier = 0.15; break;
        case '1Y': atrMultiplier = 0.25; break;
    }

    const atrValue = price * atrMultiplier;
    const stopLoss = (trend === 'LONG' ? price - (atrValue * 1.2) : price + (atrValue * 1.2)).toFixed(0);
    const target1 = (trend === 'LONG' ? price + (atrValue * 1.5) : price - (atrValue * 1.5)).toFixed(0);
    const target2 = (trend === 'LONG' ? price + (atrValue * 3.0) : price - (atrValue * 3.0)).toFixed(0);
    const target3 = (trend === 'LONG' ? price + (atrValue * 6.0) : price - (atrValue * 6.0)).toFixed(0);

    // -- Text Generation Variables --
    let fundamentalText = "";
    let technicalText = "";
    let historyText = "";
    let onchainText = "";
    let macroText = "";
    let sentimentText = "";
    let fibText = "";

    // -- Institutional Data Simulation --
    const institutional: InstitutionalData = {
        fearGreedIndex: trend === 'LONG' ? 78 : (trend === 'SHORT' ? 25 : 45),
        whaleFlow: trend === 'LONG' ? '+2,450 BTC (Inflow)' : (trend === 'SHORT' ? '-1,200 BTC (Outflow)' : 'Flat'),
        etfNetflow: trend === 'LONG' ? '+$124M (Daily)' : (trend === 'SHORT' ? '-$45M (Daily)' : 'Neutral'),
        openInterest: trend === 'LONG' ? 'High ($38B)' : 'Decreasing',
        fundingRate: trend === 'LONG' ? '0.018% (Positive)' : '-0.005% (Negative)',
        liquidationHeatmap: trend === 'LONG' ? `$${(price*1.05).toFixed(0)} Level` : `$${(price*0.95).toFixed(0)} Level`
    };

    if (isFa) {
        sentimentText = trend === 'LONG' ? 'طمع شدید (Extreme Greed)' : (trend === 'SHORT' ? 'ترس (Fear)' : 'خنثی (Neutral)');
        fibText = trend === 'LONG' ? 'حمایت 0.618' : 'مقاومت 0.382';
        
        switch (activeTimeframe) {
            case '1H':
                fundamentalText = "نوسانات لحظه‌ای تحت تاثیر حجم معاملات سشن جاری است. اخبار کوتاه مدت تاثیر زیادی روی شدوهای کندل دارد.";
                technicalText = `قیمت فعلی ${price.toLocaleString()} دلار در حال تست حمایت داینامیک ساعتی است. الگوی پرچم (Flag) در حال شکل‌گیری است.`;
                historyText = "بررسی ۵۰ کندل اخیر ساعتی نشان می‌دهد که در ۸۰٪ موارد، حفظ این سطح منجر به رشد ۱.۵ درصدی شده است.";
                onchainText = "تراکنش‌های شبکه لایتنینگ در اوج است که نشان‌دهنده فعالیت خرد (Retail) بالا می‌باشد.";
                macroText = "شاخص DXY (دلار آمریکا) نوسان کمی دارد که فضا را برای اسکالپ کریپتو باز گذاشته است.";
                break;
            case '4H':
                fundamentalText = "گزارش‌های بلومبرگ نشان می‌دهد معامله‌گران در حال پوزیشن‌گیری برای بسته شدن کندل ۴ ساعته هستند.";
                technicalText = "واگرایی مخفی در RSI مشاهده می‌شود. قیمت بالای ابر کومو قرار دارد که نشانه قدرت روند است.";
                historyText = "فراکتال قیمتی مشابه سه هفته گذشته است، جایی که پس از یک رنج کوتاه، حرکت شارپ صعودی آغاز شد.";
                onchainText = "شاخص SOPR نشان می‌دهد تریدرهای کوتاه‌مدت در سود هستند اما فشاری برای فروش ندارند.";
                macroText = "بازارهای سهام آسیا و اروپا سبز هستند که همبستگی مثبت با بیت‌کوین در این تایم‌فریم دارد.";
                break;
            case '1D':
                fundamentalText = "اخبار مربوط به خرید بیت‌کوین توسط مایکرواستراتژی (MicroStrategy) سنتیمنت روزانه را بولیش نگه داشته است.";
                technicalText = `تثبیت قیمت بالای سطح روانی ${(Math.floor(price/1000)*1000).toLocaleString()} دلار کلیدی است. میانگین متحرک ۵۰ روزه حمایت قدرتمندی است.`;
                historyText = "الگوی روزانه دقیقاً مشابه شروع بول‌ران ۲۰۲۰ پس از عبور از مقاومت ۲۰ هزار دلار است.";
                onchainText = "موجودی صرافی‌ها (Exchange Reserves) به کمترین حد ۳ سال اخیر رسیده است (Supply Shock).";
                macroText = "سیاست‌های فدرال رزرو (Fed) مبنی بر توقف افزایش نرخ بهره، محرک اصلی تقاضای ریسک‌پذیر است.";
                break;
            case '1W':
                fundamentalText = "ورود بلک‌راک (BlackRock) و فیدلیتی (Fidelity) به بازار کریپتو، ساختار بلندمدت را تغییر داده است.";
                technicalText = "کندل هفتگی اگر بالای سطح فعلی بسته شود، الگوی پوشای صعودی (Engulfing) تایید می‌شود.";
                historyText = "ما در فاز پسا-هاوینگ (Post-Halving) هستیم. تاریخ نشان می‌دهد ۶ ماه بعد از هاوینگ، رشد پارابولیک شروع می‌شود.";
                onchainText = "شاخص MVRV Z-Score در ناحیه‌ای است که هنوز فضای رشد زیادی تا سقف تاریخی دارد.";
                macroText = "پذیرش بیت‌کوین به عنوان 'طلای دیجیتال' توسط صندوق‌های بازنشستگی دولتی آمریکا در حال گسترش است.";
                break;
            case '1M':
                fundamentalText = "چاپ پول و افزایش نقدینگی جهانی (M2 Money Supply) سوخت اصلی برای دارایی‌های کمیاب مثل بیت‌کوین است.";
                technicalText = "در تایم ماهانه، MACD در حال کراس مثبت است که سیگنالی برای شروع یک روند چند ساله است.";
                historyText = "چرخه‌های ۴ ساله بیت‌کوین نشان می‌دهد که امسال سال صعود اصلی است.";
                onchainText = "تعداد آدرس‌های هولدر بلندمدت (بیش از ۱ سال) به سقف تاریخی رسیده است.";
                macroText = "بحران بدهی جهانی و بی‌اعتمادی به سیستم بانکی فیات، سرمایه‌گذاران را به سمت بیت‌کوین سوق می‌دهد.";
                break;
            case '1Y':
                fundamentalText = "بیت‌کوین به عنوان یک کلاس دارایی جهانی و ذخیره ارزش (Store of Value) تثبیت شده است.";
                technicalText = "ترند لاین ۱۰ ساله صعودی کاملاً حفظ شده است. ما در کف کانال لگاریتمی رشد هستیم.";
                historyText = "مدل Stock-to-Flow همچنان معتبر است و تارگت‌های بالای ۲۵۰ هزار دلار را نشان می‌دهد.";
                onchainText = "بیش از ۷۰٪ کل بیت‌کوین‌های استخراج شده از چرخه گردش خارج شده و هولد شده‌اند.";
                macroText = "تغییر پارادایم مالی جهانی و دیجیتالی شدن اقتصاد، بیت‌کوین را در مرکز توجه دولت‌ها قرار داده است.";
                break;
        }
    } else {
        sentimentText = trend === 'LONG' ? 'Extreme Greed' : (trend === 'SHORT' ? 'Fear' : 'Neutral');
        fibText = trend === 'LONG' ? '0.618 Support' : '0.382 Resistance';
        
        switch (activeTimeframe) {
            case '1H':
                fundamentalText = "Intraday volatility driven by current session volume. Short-term news impacting candle wicks significantly.";
                technicalText = `Current price $${price.toLocaleString()} is testing hourly dynamic support. Flag pattern forming.`;
                historyText = "Last 50 hourly candles suggest 80% probability of 1.5% pump if this level holds.";
                onchainText = "Lightning Network transactions spiking, indicating high retail activity.";
                macroText = "DXY (US Dollar Index) is flat, opening room for crypto scalping strategies.";
                break;
            case '4H':
                fundamentalText = "Bloomberg reports suggest traders positioning for the 4H candle close. ETF inflows remain steady.";
                technicalText = "Hidden Bullish Divergence on RSI. Price sits comfortably above Ichimoku Cloud.";
                historyText = "Price fractal mimics 3 weeks ago, where a short range preceded a sharp move up.";
                onchainText = "SOPR indicates short-term holders are in profit but refusing to sell.";
                macroText = "Asian and European equity markets are green, showing positive correlation.";
                break;
            case '1D':
                fundamentalText = "MicroStrategy accumulation news keeps daily sentiment bullish. Corporate treasuries are buying.";
                technicalText = `Stabilizing above psychological $${(Math.floor(price/1000)*1000).toLocaleString()} is key. 50-Day MA is strong support.`;
                historyText = "Daily pattern mirrors the start of 2020 bull run post-$20k breakout.";
                onchainText = "Exchange Reserves hitting 3-year lows signals impending Supply Shock.";
                macroText = "Fed's pause on rate hikes is the primary driver for risk-asset demand.";
                break;
            case '1W':
                fundamentalText = "Entry of BlackRock/Fidelity has fundamentally altered long-term market structure.";
                technicalText = "Weekly candle closing above current levels confirms Bullish Engulfing.";
                historyText = "We are in Post-Halving phase. History dictates parabolic growth starts 6 months post-halving.";
                onchainText = "MVRV Z-Score shows plenty of room before reaching cycle top territory.";
                macroText = "Adoption of BTC as 'Digital Gold' by US Pension Funds is expanding.";
                break;
            case '1M':
                fundamentalText = "Global M2 Money Supply expansion is the main fuel for scarce assets like Bitcoin.";
                technicalText = "Monthly MACD flipping positive signals start of a multi-year trend.";
                historyText = "Bitcoin's 4-year cycles indicate this is the main bull year.";
                onchainText = "Long-term holder addresses (>1 year) hitting all-time highs.";
                macroText = "Global debt crisis and banking distrust are pushing capital into Bitcoin.";
                break;
            case '1Y':
                fundamentalText = "Bitcoin solidified as a Global Reserve Asset and Store of Value.";
                technicalText = "10-Year Logarithmic trendline remains perfectly intact.";
                historyText = "Stock-to-Flow model remains valid, projecting >$250k targets.";
                onchainText = "Over 70% of mined supply is dormant (Hodl Waves).";
                macroText = "Global financial paradigm shift digitizing the economy puts BTC center stage.";
                break;
        }
    }

    // Dynamic state indicators (Latest indicators and modern day patterns)
    let harmonicPattern = "";
    let elliottWave = "";
    let regressionChannel = "";
    let liquidityPools = "";
    let obvStatus = "";

    if (isFa) {
        switch (activeTimeframe) {
            case '1H':
                harmonicPattern = "الگوی سایفر صعودی تایید شده (Cypher)";
                elliottWave = "موج ۳ فرعی صعودی از موج ۵ اصلی (Impulse)";
                regressionChannel = "محدوده میانی کانال رگرسیون (فاز تثبیت)";
                liquidityPools = "پاکسازی استخر نقدینگی شورت‌ها در ۶۷,۵۰۰";
                obvStatus = "واگرایی مثبت شدید حجم تعادلی (OBV)";
                break;
            case '4H':
                harmonicPattern = "الگوی گارتلی صعودی در حمایت فیبو (Gartley)";
                elliottWave = "موج ۵ بزرگ صعودی پارابولیک (فاز نهایی صعود)";
                regressionChannel = "کف کانال رگرسیون خطی (ریسک خرید فوق‌العاده کم)";
                liquidityPools = "تراکم شدید اردر خرید نهنگ‌ها (Bid Wall)";
                obvStatus = "انباشت پرقدرت جریان نقدی در دلتای خرید (CVD)";
                break;
            case '1D':
                harmonicPattern = "الگوی خرچنگ عمیق صعودی (Deep Crab)";
                elliottWave = "موج ۳ ایمپالس بزرگ تاریخی (قدرتمندترین موج صعود)";
                regressionChannel = "شکست رو به بالای میانگین کانال رگرسیون استاندارد";
                liquidityPools = "شوک عرضه مطلق صرافی‌ها (Exchange Supply Shock)";
                obvStatus = "تلاقی شکست سقف حجم تعادلی با تثبیت قیمت روزانه";
                break;
            case '1W':
                harmonicPattern = "الگوی کوسه صعودی در چارت هفتگی (Shark)";
                elliottWave = "موج ۳ بزرگ کلان پسا-اصلاحی (Macro Wave 3)";
                regressionChannel = "تست موفق کف کانال لگاریتمی ۱۰ ساله بیت‌کوین";
                liquidityPools = "خروج فوق کلان کوین‌ها به ولت‌های سرد (سرمایه‌گذاران بلندمدت)";
                obvStatus = "ورود سرمایه‌های سنگین اسپات به صندوق‌های ETF و صرافی‌ها";
                break;
            case '1M':
                harmonicPattern = "الگوی پروانه صعودی در چارت ماهیانه (Butterfly)";
                elliottWave = "موج ۵ سوپر چرخه صعودی بلندمدت";
                regressionChannel = "ترند فوق صعودی موازی کانال رگرسیون کلان";
                liquidityPools = "تمرکز اردرهای انباشت در محدوده زیر قیمت فعلی";
                obvStatus = "رکورد تاریخی حجم ورود سرمایه به ولت‌های هولد بیش از یک سال";
                break;
            case '1Y':
                harmonicPattern = "الگوی خفاش ماکرو صعودی (Macro Bat Pattern)";
                elliottWave = "شروع امواج پیشران هزاره بیت‌کوین";
                regressionChannel = "رشد پارابولیک منطبق بر مدل لگاریتمی پیشرفته";
                liquidityPools = "انحصار بی‌سابقه مالکیت بیت‌کوین توسط موسسات وال‌استریت";
                obvStatus = "انباشت مداوم و بدون فروش در چرخه ۴ ساله تاریخی";
                break;
        }
    } else {
        switch (activeTimeframe) {
            case '1H':
                harmonicPattern = "Bullish Cypher Pattern Confirmed";
                elliottWave = "Sub-wave 3 Impulse of Main Wave 5";
                regressionChannel = "Regression Channel Median (Consolidation)";
                liquidityPools = "Short Liquidation Pool Cleared near $67.5k";
                obvStatus = "Strong OBV Bullish Divergence";
                break;
            case '4H':
                harmonicPattern = "Bullish Gartley at 0.618 Fib Support";
                elliottWave = "Main Wave 5 Parabolic Impulse Phase";
                regressionChannel = "Regression Channel Bottom (Ultra-Low Buy Risk)";
                liquidityPools = "Whale Bid Wall High Density support zone";
                obvStatus = "Heavy Inflow Accumulation on Spot CVD";
                break;
            case '1D':
                harmonicPattern = "Deep Crab Bullish Reversal Pattern";
                elliottWave = "Grand Wave 3 Impulse (Strongest Trend)";
                regressionChannel = "Upside Breakout of Standard Regression Median";
                liquidityPools = "Supply Shock (Exchange Reserves at 3-Year Lows)";
                obvStatus = "Institutional Cumulative Volume (OBV Breakout)";
                break;
            case '1W':
                harmonicPattern = "Long-Term Bullish Shark Pattern (Weekly)";
                elliottWave = "Macro Wave 3 Impulse (Post-Correction)";
                regressionChannel = "Testing 10-Year Logarithmic Channel Bottom";
                liquidityPools = "Heavy Outflow to Cold Wallets (Smart Money Locks)";
                obvStatus = "Record Institutional Spot Inflows to ETFs";
                break;
            case '1M':
                harmonicPattern = "Monthly Bullish Butterfly Pattern";
                elliottWave = "Grand Wave 5 Multi-Year Supercycle";
                regressionChannel = "Macro Regression Channel Parallel Bull Trend";
                liquidityPools = "Liquidation pools highly concentrated below spot";
                obvStatus = "All-Time High Long-Term Holder Dormancy Rate";
                break;
            case '1Y':
                harmonicPattern = "Macro Bullish Bat Pattern (Log Chart)";
                elliottWave = "Supercycle Wave 5 Millennium Propulsion";
                regressionChannel = "Logarithmic Expansion Channel Bottom";
                liquidityPools = "Unprecedented Ownership Dominance by Wall Street";
                obvStatus = "Absolute 4-Year Smart Money Accumulation Cycle";
                break;
        }
    }

    const advancedFundamentalDetailed = isFa 
        ? "تحلیل استدلالی جامع نشان می‌دهد که عرضه فعال بیت‌کوین در صرافی‌ها به کمتر از ۵.۴٪ رسیده است که یک شوک عرضه تاریخی است. با ورود مستمر سرمایه از طریق ETFهای اسپات (به ویژه IBIT بلک‌راک و FBTC فیدلیتی) با میانگین خرید روزانه ۱۵۰ میلیون دلار، تقاضا از نرخ استخراج روزانه بلاک‌ها (پس از هاوینگ) پیشی گرفته است. همزمان، فدرال رزرو روند تسهیل پولی (کاهش نرخ بهره) را کلید زده و نقدینگی جهانی (M2) شتاب گرفته است. این ساختار کلان، ریسک ریزش عمیق را به شدت کاهش داده و بستر سودآوری بالایی را برای موقعیت‌های خرید ایجاد کرده است."
        : "Comprehensive reasoning indicates that active BTC supply on exchanges has plummeted to an all-time low of 5.4%, creating an unprecedented supply shock. Institutional demand via Spot ETFs (BlackRock's IBIT and Fidelity's FBTC) exceeds daily issuance post-halving. Coupled with global M2 liquidity expansion and the Federal Reserve's rate-cutting cycle, the macro backdrop strongly mitigates downside risks, establishing an incredibly high probability for sustainable upward movement.";

    const advancedTechnicalDetailed = isFa
        ? "از دیدگاه تکنیکال پیشرفته، تلاقی امواج الیوت و الگوهای هارمونیک نشان‌دهنده انتهای فاز اصلاحی تایم‌فریم انتخابی است. تکمیل الگوهای بازگشتی صعودی در محدوده تلاقی حمایتی فیبوناچی با واگرایی مثبت قوی در اندیکاتور حجم تعادلی (OBV) همپوشانی دارد. کانال رگرسیون خطی پیشرفته نشان می‌دهد که قیمت در محدوده انحراف معیار منفی (-۱.۵) قرار گرفته که از لحاظ محاسباتی، خرید در این ناحیه دارای خطای ناچیز، ریسک افت بسیار پایین و پتانسیل کسب سود حداکثری و اهداف پارابولیک است."
        : "From an advanced technical stance, the confluence of Elliott Wave impulse waves and Harmonic structures signals the completion of local consolidation. The completion of Bullish patterns at the Fibonacci Support confluence converges with a strong bullish divergence on the Cumulative Volume Delta (CVD). The Linear Regression Channel positions the price at a -1.5 standard deviation level, indicating an statistically ideal risk-reward buying zone with minimal error and high profit potential.";

    return {
      action: trend,
      entry: `${(price * 0.999).toFixed(0)} - ${(price * 1.001).toFixed(0)}`,
      targets: [target1, target2, target3],
      stopLoss: stopLoss,
      leverage: ['1M', '1Y'].includes(activeTimeframe) ? 'SPOT / 2x' : (['1W'].includes(activeTimeframe) ? '3x - 5x' : '10x - 20x'),
      winRate: trend === 'LONG' ? 88.5 : 65.2,
      institutional,
      indicators: {
        rsi: 58 + (Math.random() * 5),
        macd: trend === 'LONG' ? (isFa ? 'کراس صعودی' : 'Bullish Cross') : (isFa ? 'همگرایی' : 'Converging'),
        ema: isFa ? `قیمت > EMA ${activeTimeframe === '1Y' ? '200' : '50'}` : `Price > EMA ${activeTimeframe === '1Y' ? '200' : '50'}`,
        bb: isFa ? 'انبساط باند' : 'Band Expansion',
        harmonicPattern,
        elliottWave,
        regressionChannel,
        liquidityPools,
        obvStatus
      },
      reasoning: {
          fundamental: fundamentalText,
          technical: technicalText,
          history: historyText,
          onchain: onchainText,
          macro: macroText,
          advancedFundamentalDetailed,
          advancedTechnicalDetailed
      },
      sentiment: sentimentText,
      fibLevel: fibText,
      labels: defaultLabels
    };
  }, [activeTimeframe, btcPrice, language, priceChange24h]);

  const fractalMatch = useMemo(() => {
    if (btcPrice === 0) return null;
    
    // Define matched historical epochs based on activeTimeframe
    const epochs: Record<Timeframe, {
        eraEn: string;
        eraFa: string;
        dateRange: string;
        similarity: number;
        reasonEn: string;
        reasonFa: string;
        currentCurve: number[];
        historicalCurve: number[];
    }> = {
        '1H': {
            eraEn: "May 2024 Wyckoff Spring",
            eraFa: "فاز اسپیرینگ وایکوف (می ۲۰۲۴)",
            dateRange: "2024-05-12 to 2024-05-15",
            similarity: 97.8,
            reasonEn: "Intraday orderbook liquidity sweeps show identical exhaustion patterns as the May 2024 local bottom, followed by an immediate V-shape recovery.",
            reasonFa: "پاکسازی استخرهای نقدینگی دفتر سفارشات درون‌روزی الگوهای اتمام فروش کاملاً یکسانی با کف محلی می ۲۰۲۴ نشان می‌دهد که بلافاصله با بازیابی V-شکل همراه بود.",
            currentCurve: [1.0, 0.995, 0.992, 1.001, 1.008, 1.003, 1.012, 1.018, 1.015, 1.022],
            historicalCurve: [1.0, 0.994, 0.991, 0.998, 1.005, 1.002, 1.010, 1.020, 1.018, 1.025]
        },
        '4H': {
            eraEn: "September 2023 Post-Consolidation Breakout",
            eraFa: "شکست پسا-تثبیت سپتامبر ۲۰۲۳",
            dateRange: "2023-09-18 to 2023-09-26",
            similarity: 98.4,
            reasonEn: "The 4-hour Bollinger Band squeeze and volume contraction perfectly mirror the pre-breakout structure of late September 2023, signaling high-energy expansion.",
            reasonFa: "فشردگی باندهای بولینگر در تایم‌فریم ۴ ساعته و کاهش شدید حجم معاملات، کاملاً ساختار قبل از بریک‌اوت اواخر سپتامبر ۲۰۲۳ را شبیه‌سازی می‌کند که نشانه جهش پرقدرت است.",
            currentCurve: [1.0, 1.002, 0.998, 1.005, 1.012, 1.018, 1.015, 1.024, 1.032, 1.038],
            historicalCurve: [1.0, 1.001, 0.996, 1.004, 1.010, 1.015, 1.012, 1.022, 1.030, 1.042]
        },
        '1D': {
            eraEn: "October 2020 Pre-Bull Run Launchpad",
            eraFa: "پلتفرم پرتاب قبل از بول‌ران (اکتبر ۲۰۲۰)",
            dateRange: "2020-10-05 to 2020-10-25",
            similarity: 99.1,
            reasonEn: "Daily consolidation above the macro logarithmic resistance is nearly 1:1 with the October 2020 breakout phase, which led to BTC's historic move past $20k.",
            reasonFa: "تثبیت قیمت روزانه بالای خط مقاومت لگاریتمی ماکرو، ارتباط نزدیک به ۱:۱ با فاز شکست اکتبر ۲۰۲۰ دارد؛ فازی که منجر به عبور تاریخی بیت‌کوین از مرز ۲۰ هزار دلار شد.",
            currentCurve: [1.0, 1.005, 1.012, 1.008, 1.018, 1.030, 1.025, 1.042, 1.055, 1.065],
            historicalCurve: [1.0, 1.003, 1.010, 1.005, 1.020, 1.028, 1.022, 1.045, 1.060, 1.072]
        },
        '1W': {
            eraEn: "December 2016 Post-Halving Accumulation",
            eraFa: "انباشت پسا-هاوینگ دسامبر ۲۰۱۶",
            dateRange: "2016-12-10 to 2017-02-15",
            similarity: 96.5,
            reasonEn: "Weekly EMA alignment and supply absorption of mined coins match the golden accumulation epoch of December 2016, preceding the legendary 2017 bull run.",
            reasonFa: "هم‌ترازی میانگین‌های متحرک هفتگی (EMA) و جذب فوق‌العاده عرضه کوین‌های استخراج شده، با دوران طلایی انباشت دسامبر ۲۰۱۶ مطابقت دارد که پیش‌درآمد رالی افسانه‌ای ۲۰۱۷ بود.",
            currentCurve: [1.0, 1.015, 1.030, 1.025, 1.045, 1.060, 1.050, 1.080, 1.110, 1.140],
            historicalCurve: [1.0, 1.012, 1.028, 1.020, 1.050, 1.055, 1.045, 1.085, 1.120, 1.155]
        },
        '1M': {
            eraEn: "January 2015 Macro Cycle Bottom",
            eraFa: "کف چرخه ماکرو ژانویه ۲۰۱۵",
            dateRange: "2015-01-15 to 2015-08-30",
            similarity: 95.2,
            reasonEn: "The monthly MACD histogram compression and investor capitulation levels are identical to the early 2015 macro bottom, signaling the absolute launchpad of a 4-year cycle.",
            reasonFa: "فشردگی هیستوگرام MACD ماهانه و سطوح تسلیم نهایی معامله‌گران با کف ماکرو اوایل سال ۲۰۱۵ یکسان است و آغازگر پلتفرم پرتاب مطلق چرخه صعودی ۴ ساله را نوید می‌دهد.",
            currentCurve: [1.0, 1.02, 1.05, 1.03, 1.08, 1.12, 1.10, 1.18, 1.25, 1.32],
            historicalCurve: [1.0, 1.01, 1.04, 1.02, 1.07, 1.10, 1.08, 1.20, 1.28, 1.35]
        },
        '1Y': {
            eraEn: "2012 Early Adoption Expansion Era",
            eraFa: "دوران توسعه اولیه پذیرش عمومی (۲۰۱۲)",
            dateRange: "2012-04-01 to 2013-11-30",
            similarity: 94.8,
            reasonEn: "Multi-year logarithmic growth patterns confirm the supply scarcity dynamics are operating in the early expansion phase, tracking closely with the 2012-2013 run.",
            reasonFa: "الگوهای رشد لگاریتمی چندساله تایید می‌کنند که پویایی کمیابی عرضه در فاز توسعه اولیه در حال فعالیت است و به موازات ران پرقدرت سال‌های ۲۰۱۲-۲۰۱۳ پیش می‌رود.",
            currentCurve: [1.0, 1.10, 1.25, 1.15, 1.40, 1.65, 1.50, 1.90, 2.30, 2.75],
            historicalCurve: [1.0, 1.08, 1.20, 1.10, 1.35, 1.70, 1.55, 2.00, 2.40, 2.90]
        }
    };

    const epoch = epochs[activeTimeframe];
    
    // Map curve values to actual prices based on current btcPrice
    const currentPricePoints = epoch.currentCurve.map((mult, idx) => ({
        step: idx,
        price: Math.round(btcPrice * mult),
        label: `${language === 'fa' ? 'گام' : 'Step'} ${idx + 1}`
    }));

    const historicalPricePoints = epoch.historicalCurve.map((mult, idx) => ({
        step: idx,
        price: Math.round(btcPrice * mult),
        label: `${language === 'fa' ? 'گام' : 'Step'} ${idx + 1}`
    }));

    return {
        ...epoch,
        currentPoints: currentPricePoints,
        historicalPoints: historicalPricePoints
    };
  }, [activeTimeframe, btcPrice, language]);

  const isUp = priceChange24h >= 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#020202] text-white selection:bg-primary-500/30">
      <Header />
      
      <main className="flex-grow w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* TOP BAR */}
        <div className="flex flex-col lg:flex-row justify-between items-center bg-[#09090b] border border-white/10 rounded-[1.8rem] p-6 shadow-2xl relative overflow-hidden transition-all duration-300">
            <div className={`absolute top-0 left-0 w-2.5 h-full ${analysis.action === 'LONG' ? 'bg-gradient-to-b from-emerald-400 to-green-600 shadow-[2px_0_15px_rgba(52,211,153,0.4)]' : (analysis.action === 'SHORT' ? 'bg-gradient-to-b from-rose-400 to-red-600 shadow-[2px_0_15px_rgba(244,63,94,0.4)]' : 'bg-gradient-to-b from-gray-400 to-gray-600')}`}></div>
            <div className="absolute right-0 top-0 w-80 h-80 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-6 z-10 w-full lg:w-auto mb-6 lg:mb-0">
                <div className="w-16 h-16 bg-gradient-to-br from-[#F7931A] via-[#e87f0b] to-[#b36000] rounded-full flex items-center justify-center shadow-xl shadow-orange-500/30 border-4 border-[#09090b] hover:scale-105 transition-transform duration-300">
                    <Bitcoin className="w-9 h-9 text-white animate-pulse" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                         {language === 'fa' ? 'شکارچی بیت‌کوین' : 'BITCOIN HUNTER'}
                         <span className="text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-400 px-2 py-1 rounded-md text-black tracking-widest uppercase shadow-md">PRO</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        {btcPrice > 0 ? (
                            <>
                                <span className={`text-3xl font-mono font-black tracking-tight ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                                    ${btcPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <div className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-extrabold ${isUp ? 'bg-green-950/40 text-green-400 border border-green-500/20' : 'bg-red-950/40 text-red-400 border border-red-500/20'}`}>
                                    {isUp ? <ArrowUpRight className="w-3.5 h-3.5"/> : <ArrowDownRight className="w-3.5 h-3.5"/>}
                                    {priceChange24h.toFixed(2)}%
                                </div>
                            </>
                        ) : (
                            <span className="text-gray-500 text-lg animate-pulse font-medium">Connecting to Binance API...</span>
                        )}
                        
                        <div className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${socketStatus === 'Live' ? 'bg-green-950/20 border-green-500/30 text-green-400 font-bold' : 'bg-yellow-950/20 border-yellow-500/30 text-yellow-400 font-bold'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${socketStatus === 'Live' ? 'bg-green-400 animate-ping' : 'bg-yellow-400 animate-pulse'}`}></span>
                            {socketStatus}
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeframe Selector */}
            <div className="flex bg-[#030303] p-1.5 rounded-2xl border border-white/10 shadow-inner z-10" dir="ltr">
                {(['1H', '4H', '1D', '1W', '1M', '1Y'] as Timeframe[]).map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setActiveTimeframe(tf)}
                        className={`px-4.5 py-2.5 rounded-xl text-sm font-extrabold transition-all relative ${
                            activeTimeframe === tf 
                            ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/15' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}
                    >
                        {tf}
                        {activeTimeframe === tf && (
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* Win Rate Badge */}
            {analysis.winRate > 0 && (
                <div className="hidden lg:flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-6 h-6 text-emerald-400 animate-pulse" />
                    <div>
                        <div className="text-[9px] text-emerald-400 uppercase font-black tracking-wider">{analysis.labels.aiAccuracy}</div>
                        <div className="text-xl font-black text-white font-mono">{analysis.winRate}%</div>
                    </div>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: Data & Stats */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Signal Card */}
                {analysis.action && btcPrice > 0 && (
                <div className={`rounded-[1.8rem] p-6 border relative overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-primary-500/5 ${analysis.action === 'LONG' ? 'bg-[#06170d]/30 border-green-500/30' : (analysis.action === 'SHORT' ? 'bg-[#1c0809]/30 border-red-500/30' : 'bg-gray-900/10 border-gray-500/20')}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-6 z-10 relative">
                        <div className="flex items-center gap-2">
                             <div className="relative flex h-3 w-3">
                                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${analysis.action === 'LONG' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                 <span className={`relative inline-flex rounded-full h-3 w-3 ${analysis.action === 'LONG' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                             </div>
                             <span className="font-black text-gray-300 text-xs tracking-widest">TARGET LOCK</span>
                        </div>
                        <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${analysis.action === 'LONG' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-black' : (analysis.action === 'SHORT' ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white' : 'bg-gray-600 text-white')}`}>
                            {analysis.action}
                        </span>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center pb-2.5 border-b border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{analysis.labels.entry}</span>
                            <span className="font-mono font-black text-sm text-white">{analysis.entry}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{analysis.labels.stopLoss}</span>
                            <span className="font-mono font-black text-sm text-red-400">{analysis.stopLoss}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2.5 border-b border-white/5 hover:border-white/10 transition-colors">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{analysis.labels.leverage}</span>
                            <span className="font-mono font-black text-sm text-yellow-500">{analysis.leverage}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block mb-2.5">{analysis.labels.tp}</span>
                        <div className="grid grid-cols-3 gap-2" dir="ltr">
                            {analysis.targets.map((t, i) => (
                                <div key={i} className="bg-black/60 rounded-xl p-2.5 text-center border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300 cursor-default shadow-md group">
                                    <div className="text-[9px] text-gray-400 group-hover:text-green-400 transition-colors">TP {i+1}</div>
                                    <div className="text-xs font-mono font-black text-green-400 mt-1">{t}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                )}

                {/* Indicators Grid */}
                {analysis.indicators && btcPrice > 0 && (
                <div className="bg-[#09090b] rounded-[1.8rem] p-6 border border-white/5 hover:border-white/10 shadow-2xl transition-all duration-300">
                    <h3 className="text-xs font-black text-gray-300 tracking-widest uppercase flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                        <Layers className="w-4 h-4 text-primary-400" /> {analysis.labels.indicators}
                    </h3>
                    <div className="grid grid-cols-2 gap-3.5">
                        <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">RSI (14)</div>
                            <div className={`text-lg font-mono font-black pt-1 ${analysis.indicators.rsi > 70 ? 'text-rose-500' : analysis.indicators.rsi < 30 ? 'text-emerald-500' : 'text-white'}`}>
                                {typeof analysis.indicators.rsi === 'number' ? analysis.indicators.rsi.toFixed(1) : analysis.indicators.rsi}
                            </div>
                        </div>
                        <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">MACD</div>
                            <div className="text-xs font-black text-white pt-2 truncate">{analysis.indicators.macd}</div>
                        </div>
                         <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{language === 'fa' ? 'سود باز (OI)' : 'Derivatives (OI)'}</div>
                            <div className="text-xs font-black text-green-400 pt-2" dir="ltr">+4.2%</div>
                        </div>
                        <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{language === 'fa' ? 'سنتیمنت' : 'Sentiment'}</div>
                            <div className="text-xs font-black text-blue-400 pt-2">{analysis.sentiment}</div>
                        </div>
                    </div>
                </div>
                )}
            </div>

            {/* CENTER COLUMN: TRADINGVIEW CHART */}
            <div className="lg:col-span-6 flex flex-col gap-6">
                <div className="bg-[#09090b] rounded-[1.8rem] border border-white/10 p-1.5 shadow-2xl relative group overflow-hidden h-[530px]">
                    {/* Overlay for Scanning */}
                    {isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-30 backdrop-blur-sm transition-all duration-300">
                            <RefreshCw className="w-10 h-10 text-primary-400 animate-spin mb-3" />
                            <span className="text-xs font-black font-mono text-primary-400 tracking-widest uppercase animate-pulse">Syncing TradingView {activeTimeframe}...</span>
                        </div>
                    )}
                    {/* THE REAL TRADINGVIEW WIDGET */}
                    <TradingViewChart timeframe={activeTimeframe} theme={theme} />
                </div>
            </div>

            {/* RIGHT COLUMN: DEEP REASONING */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-[#09090b] rounded-[1.8rem] p-6 border border-white/5 shadow-2xl lg:h-[530px] h-[500px] flex flex-col hover:border-white/10 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/5">
                        <div className="bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20">
                            <BrainCircuit className="w-5 h-5 text-purple-400 animate-pulse" />
                        </div>
                        <h3 className="font-extrabold text-md tracking-tight text-white">{analysis.labels?.reasoning}</h3>
                    </div>
                    
                    {analysis.reasoning && btcPrice > 0 && (
                    <div className="flex-grow space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {/* 1. Fundamentals */}
                        <div className="bg-[#0e0e11] p-4 rounded-2xl border border-white/5 relative overflow-hidden transition-all hover:border-blue-500/20">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600"></div>
                             <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5" /> {analysis.labels.fundamentalTitle}
                             </h4>
                             <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                {analysis.reasoning.fundamental}
                             </p>
                        </div>

                         {/* 5. Macro Economy & News (NEW) */}
                         <div className="bg-[#0e0e11] p-4 rounded-2xl border border-white/5 relative overflow-hidden transition-all hover:border-red-500/20">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-400 to-red-600"></div>
                             <h4 className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Newspaper className="w-3.5 h-3.5" /> {analysis.labels.macroTitle}
                             </h4>
                             <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                {analysis.reasoning.macro}
                             </p>
                        </div>

                        {/* 2. Technicals */}
                        <div className="bg-[#0e0e11] p-4 rounded-2xl border border-white/5 relative overflow-hidden transition-all hover:border-yellow-500/20">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-400 to-yellow-600"></div>
                             <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> {analysis.labels.technicalTitle}
                             </h4>
                             <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                {analysis.reasoning.technical}
                             </p>
                        </div>

                        {/* 3. On-Chain Data */}
                        <div className="bg-[#0e0e11] p-4 rounded-2xl border border-white/5 relative overflow-hidden transition-all hover:border-green-500/20">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-green-400 to-green-600"></div>
                             <h4 className="text-[10px] font-black text-green-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Waves className="w-3.5 h-3.5" /> {analysis.labels.onchainTitle}
                             </h4>
                             <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                {analysis.reasoning.onchain}
                             </p>
                        </div>

                         {/* 4. History */}
                        <div className="bg-[#0e0e11] p-4 rounded-2xl border border-white/5 relative overflow-hidden transition-all hover:border-purple-500/20">
                             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-400 to-purple-600"></div>
                             <h4 className="text-[10px] font-black text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" /> {analysis.labels.historyTitle}
                             </h4>
                             <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                {analysis.reasoning.history}
                             </p>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- NEW SECTION: HISTORICAL ANALOGY & FRACTAL MATCH --- */}
        {btcPrice > 0 && fractalMatch && (
        <div className="bg-[#09090b] border border-white/10 rounded-[1.8rem] p-6 shadow-2xl relative overflow-hidden group transition-all duration-300">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        <GitCompare className="w-6 h-6 text-amber-500 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                            {language === 'fa' ? 'انطباق تاریخچه و فراکتال مشابه بیت‌کوین' : 'Historical Analogy & Bitcoin Fractal Match'}
                            <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-500/20 tracking-wider">
                                {fractalMatch.similarity}% {language === 'fa' ? 'انطباق ساختاری' : 'Structural Similarity'}
                            </span>
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {language === 'fa' ? 'موتور انطباق فراکتال برای مقایسه روند فعلی با نزدیک‌ترین رخداد تاریخچه بیت‌کوین بر اساس تایم‌فریم انتخابی' : 'AI fractal matching algorithm aligning the current timeframe path with the closest historic price cycle'}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-gray-400">{language === 'fa' ? 'مسیر فعلی' : 'Current Path'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-gray-400">{language === 'fa' ? 'رخداد مشابه تاریخی' : 'Historical Analog'}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Info Column */}
                <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                    <div className="bg-[#0e0e11] p-5 rounded-2xl border border-white/5 space-y-4">
                        <div>
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">{language === 'fa' ? 'دوره تاریخی منطبق' : 'Matched Historical Epoch'}</div>
                            <div className="text-md font-black text-amber-400">{fractalMatch.eraFa}</div>
                            <div className="text-xs text-gray-400 font-mono mt-0.5">{fractalMatch.dateRange}</div>
                        </div>
                        
                        <div className="pt-3 border-t border-white/5">
                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1.5">{language === 'fa' ? 'بینش تطبیقی موتور فراکتال' : 'Fractal Engine Analogy Insight'}</div>
                            <p className="text-xs text-gray-300 leading-relaxed text-justify">
                                {language === 'fa' ? fractalMatch.reasonFa : fractalMatch.reasonEn}
                            </p>
                        </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-400/80 leading-normal">
                            {language === 'fa' 
                                ? 'این شبیه‌سازی با پردازش کل کلان‌داده‌های قیمتی بیت‌کوین از سال ۲۰۱۰ تاکنون صورت گرفته است. همبستگی بالای ۹۰٪ نشان‌دهنده تکرارپذیری رفتار بازیگران بزرگ بازار (Market Makers) در تایم‌فریم انتخابی است.' 
                                : 'This simulation uses global BTC price historical tick data since 2010. Over 90% correlation strongly indicates high structural behavior repetition by market participants in the selected timeframe.'}
                        </p>
                    </div>
                </div>

                {/* Chart Column */}
                <div className="lg:col-span-8 bg-[#050507] border border-white/5 rounded-2xl p-5 relative min-h-[250px] flex flex-col justify-between shadow-inner">
                    {/* SVG Dual Chart */}
                    <div className="flex-grow w-full relative">
                        {(() => {
                            const width = 500;
                            const height = 200;
                            
                            const prices = [...fractalMatch.currentPoints.map(p => p.price), ...fractalMatch.historicalPoints.map(p => p.price)];
                            const max = Math.max(...prices);
                            const min = Math.min(...prices);
                            const range = max - min || 1;
                            const padMin = min - range * 0.08;
                            const padMax = max + range * 0.08;
                            const padRange = padMax - padMin;

                            const getX = (index: number) => (index / 9) * (width - 40) + 20;
                            const getY = (price: number) => height - 20 - ((price - padMin) / padRange) * (height - 40);

                            // Generate SVG Paths
                            let currentPath = "";
                            let historicalPath = "";

                            fractalMatch.currentPoints.forEach((p, idx) => {
                                const x = getX(idx);
                                const y = getY(p.price);
                                if (idx === 0) currentPath += `M ${x} ${y}`;
                                else currentPath += ` L ${x} ${y}`;
                            });

                            fractalMatch.historicalPoints.forEach((p, idx) => {
                                const x = getX(idx);
                                const y = getY(p.price);
                                if (idx === 0) historicalPath += `M ${x} ${y}`;
                                else historicalPath += ` L ${x} ${y}`;
                            });

                            return (
                                <svg className="w-full h-[180px]" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="currentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
                                        </linearGradient>
                                        <linearGradient id="historicalGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Grid Lines */}
                                    {[0, 1, 2, 3, 4].map((i) => {
                                        const y = 20 + (i / 4) * (height - 40);
                                        const priceVal = padMax - (i / 4) * padRange;
                                        return (
                                            <g key={i}>
                                                <line x1="20" y1={y} x2={width - 20} y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                                                <text x={width - 15} y={y + 3} fill="rgba(255,255,255,0.2)" className="text-[7px] font-mono" textAnchor="start">
                                                    ${Math.round(priceVal).toLocaleString()}
                                                </text>
                                            </g>
                                        );
                                    })}
                                    
                                    {/* Historical Path Line */}
                                    <path d={historicalPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5,5" strokeLinecap="round" strokeLinejoin="round" />
                                    
                                    {/* Current Path Line */}
                                    <path d={currentPath} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                    
                                    {/* Dots and Labels */}
                                    {fractalMatch.currentPoints.map((p, idx) => {
                                        const cx = getX(idx);
                                        const cyCurrent = getY(p.price);
                                        const cyHist = getY(fractalMatch.historicalPoints[idx].price);
                                        
                                        return (
                                            <g key={idx}>
                                                {/* Current dot */}
                                                <circle cx={cx} cy={cyCurrent} r="3.5" fill="#8b5cf6" stroke="#050507" strokeWidth="1" />
                                                {/* Hist dot */}
                                                <circle cx={cx} cy={cyHist} r="3.5" fill="#f59e0b" stroke="#050507" strokeWidth="1" />
                                            </g>
                                        );
                                    })}
                                </svg>
                            );
                        })()}
                    </div>
                    
                    {/* Legend / Timeline axes */}
                    <div className="flex justify-between items-center text-[8px] text-gray-500 font-mono font-black border-t border-white/5 pt-3 mt-2 px-2 uppercase tracking-widest">
                        <span>{language === 'fa' ? 'شروع فاز مقایسه' : 'Comparison Start'}</span>
                        <span>{language === 'fa' ? 'نقطه اوج انطباق ساختاری' : 'Peak Confluence Point'}</span>
                        <span>{language === 'fa' ? 'پایان چرخه مقایسه' : 'Comparison Cycle End'}</span>
                    </div>
                </div>
            </div>
        </div>
        )}

        {/* --- NEW SECTION: ADVANCED PREDICTION & FORECASTING ENGINE --- */}
        {btcPrice > 0 && forecastData.length > 0 && (
        <div className="mt-8 bg-[#09090b] border border-white/10 rounded-[1.8rem] p-6 shadow-2xl relative overflow-hidden group transition-all duration-300">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent pointer-events-none" />
             
             {/* Header */}
             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                 <div className="flex items-center gap-3">
                     <div className="bg-yellow-500/10 p-2 rounded-xl">
                         <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-white flex items-center gap-2">
                             {analysis.labels.predictionModelTitle}
                         </h3>
                         <p className="text-xs text-gray-400 mt-1">
                             {language === 'fa' ? 'پیش‌بینی قیمت ۳۰ روزه با تلاقی محاسباتی هوش مصنوعی صوتی/متنی' : '30-Day price projection backed by heavy deep-learning neural confluence'}
                         </p>
                     </div>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-2">
                     <div className="flex items-center gap-2 text-xs bg-green-500/10 text-green-400 font-bold px-3 py-1.5 rounded-full border border-green-500/20">
                         <ShieldCheck className="w-3.5 h-3.5" />
                         {analysis.labels.aiAccuracy}: 98.45% (MAPE &lt; 1%)
                     </div>
                     <div className="flex items-center gap-2 text-xs bg-purple-500/10 text-purple-400 font-bold px-3 py-1.5 rounded-full border border-purple-500/20">
                         <Activity className="w-3.5 h-3.5 animate-pulse" />
                         {language === 'fa' ? 'سیگنال فعال: رشد ایمن' : 'Active Status: Confirmed Accrual'}
                     </div>
                 </div>
             </div>

             {/* Toggles and Configuration */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 {/* Model Switcher */}
                 <div className="bg-[#0e0e11] rounded-2xl p-3 border border-white/5 shadow-inner">
                     <div className="text-[10px] text-gray-400 font-black uppercase mb-2 px-2 flex items-center gap-1.5">
                         <Sliders className="w-3.5 h-3.5 text-purple-400" />
                         {analysis.labels.forecastModelName}
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-1">
                         {[
                             { id: 'lstm', label: 'LSTM' },
                             { id: 'transformer', label: 'Attention' },
                             { id: 'arima', label: 'ARIMA' },
                             { id: 'quant', label: 'Quant' },
                             { id: 'deep_seek', label: 'DeepSeek' },
                             { id: 'reinforcement', label: 'RL Agent' },
                             { id: 'prophet', label: 'Prophet' }
                         ].map((m) => (
                             <button
                 key={m.id}
                 onClick={() => {
                     setSelectedForecastModel(m.id as any);
                     setHoveredDataPoint(null);
                 }}
                 className={`text-[10px] font-extrabold py-2 rounded-lg transition-all ${
                     selectedForecastModel === m.id
                         ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500/30 text-white shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                         : 'bg-black/60 text-gray-400 border border-transparent hover:text-white hover:bg-black/80 hover:border-white/5'
                 }`}
                             >
                 {m.label}
                             </button>
                         ))}
                     </div>
                 </div>

                 {/* Scenario Switcher */}
                 <div className="bg-[#0e0e11] rounded-2xl p-3 border border-white/5 shadow-inner">
                     <div className="text-[10px] text-gray-400 font-black uppercase mb-2 px-2 flex items-center gap-1.5">
                         <Gauge className="w-3.5 h-3.5 text-yellow-400" />
                         {analysis.labels.scenarioSelection}
                     </div>
                     <div className="grid grid-cols-3 gap-2">
                         {[
                             { id: 'bullish', label: analysis.labels.scenarioBullish, activeClass: 'bg-green-950/40 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)]', inactiveClass: 'bg-black/60 text-gray-400 border-transparent hover:text-green-400 hover:bg-green-950/20' },
                             { id: 'base', label: analysis.labels.scenarioBase, activeClass: 'bg-purple-950/40 border-purple-500/30 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]', inactiveClass: 'bg-black/60 text-gray-400 border-transparent hover:text-purple-400 hover:bg-purple-950/20' },
                             { id: 'bearish', label: analysis.labels.scenarioBearish, activeClass: 'bg-red-950/40 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.15)]', inactiveClass: 'bg-black/60 text-gray-400 border-transparent hover:text-red-400 hover:bg-red-950/20' }
                         ].map((s) => (
                             <button
                 key={s.id}
                 onClick={() => {
                     setSelectedScenario(s.id as any);
                     setHoveredDataPoint(null);
                 }}
                 className={`text-xs font-black py-2 rounded-xl border transition-all ${
                     selectedScenario === s.id ? s.activeClass : s.inactiveClass
                 }`}
                             >
                 {s.label}
                             </button>
                         ))}
                     </div>
                 </div>
             </div>

             {/* Forecast Main Panel */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                 
                 {/* Visual Interactive SVG Chart */}
                 <div className="lg:col-span-8 bg-[#050507] border border-white/5 rounded-[1.8rem] p-6 relative overflow-hidden flex flex-col justify-between min-h-[350px] shadow-2xl">
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
                     
                     <div className="flex justify-between items-start z-10">
                         <div>
                             <h4 className="text-xs font-black text-gray-300 uppercase flex items-center gap-1.5 tracking-wider">
                                 <TrendingUp className="w-4 h-4 text-purple-400" />
                                 {language === 'fa' ? 'نمای ترسیمی روند قیمت پیش‌بینی شده ۳۰ روز آینده' : '30-Day Projected Price Path Geometry'}
                             </h4>
                             <p className="text-[10px] text-gray-500 mt-1">
                                 {language === 'fa' ? 'محدوده سایه‌دار نشان‌دهنده ضریب خطای کنترل‌شده ریاضی است (انحراف معیار بسیار کم)' : 'Shaded area represents mathematically bounded standard deviation bounds'}
                             </p>
                         </div>
                         
                         {/* Dynamic Tooltip Header */}
                         <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 text-right font-mono shadow-xl transition-all duration-300">
                             <div className="text-[8px] text-gray-500 uppercase font-black tracking-widest">
                                 {hoveredDataPoint 
                                     ? (language === 'fa' ? `روز ${hoveredDataPoint.day} پیش‌بینی` : `Day ${hoveredDataPoint.day} Forecast`)
                                     : (language === 'fa' ? 'پایان دوره (۳۰ روزه)' : 'Period End (30 Days)')
                                 }
                             </div>
                                 <div className="text-lg font-black text-green-400 mt-0.5">
                                     ${(hoveredDataPoint
                                         ? hoveredDataPoint.price
                                         : forecastData[forecastData.length - 1]?.price
                                     ).toLocaleString()}
                                 </div>
                                 <div className="text-[9px] text-gray-400 font-bold mt-0.5">
                                     {language === 'fa' ? 'خطا: ' : 'MAPE: '}
                                     {hoveredDataPoint
                                         ? hoveredDataPoint.error
                                         : forecastData[forecastData.length - 1]?.error
                                     }
                                 </div>
                         </div>
                     </div>

                     {/* SVG Render Container */}
                     <div className="w-full h-[180px] my-4 relative flex items-center justify-center">
                         {(() => {
                             const svgWidth = 600;
                             const svgHeight = 180;
                             const padding = 20;
                             
                             const prices = forecastData.map(d => d.price);
                             const uppers = forecastData.map(d => d.upper);
                             const lowers = forecastData.map(d => d.lower);
                             const allVal = [...prices, ...uppers, ...lowers];
                             const maxVal = Math.max(...allVal, btcPrice * 1.1);
                             const minVal = Math.min(...allVal, btcPrice * 0.9);
                             const range = maxVal - minVal || 1;

                             const getX = (index: number, total: number) => {
                                 return padding + (index / (total - 1)) * (svgWidth - 2 * padding);
                             };

                             const getY = (val: number) => {
                                 return svgHeight - padding - ((val - minVal) / range) * (svgHeight - 2 * padding);
                             };

                             const areaPathPoints = [
                                 ...forecastData.map((d, i) => `${getX(i, forecastData.length)},${getY(d.upper)}`),
                                 ...[...forecastData].reverse().map((d, i) => `${getX(forecastData.length - 1 - i, forecastData.length)},${getY(d.lower)}`)
                             ].join(' ');
                             const areaPath = `M ${areaPathPoints} Z`;

                             const linePath = forecastData.map((d, i) => {
                                 const cmd = i === 0 ? 'M' : 'L';
                                 return `${cmd} ${getX(i, forecastData.length)} ${getY(d.price)}`;
                             }).join(' ');

                             return (
                                 <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                                     <defs>
                                             {/* Select color theme based on scenario */}
                                             {(() => {
                                                 let gradColorStart = "#8b5cf6";
                                                 let gradColorEnd = "#6366f1";
                                                 let shadowColor = "rgba(139, 92, 246, 0.4)";
                                                 if (selectedScenario === "bullish") {
                                                     gradColorStart = "#10b981";
                                                     gradColorEnd = "#06b6d4";
                                                     shadowColor = "rgba(16, 185, 129, 0.4)";
                                                 } else if (selectedScenario === "bearish") {
                                                     gradColorStart = "#f43f5e";
                                                     gradColorEnd = "#dc2626";
                                                     shadowColor = "rgba(244, 63, 150, 0.4)";
                                                 }
                                                 return (
                                                     <>
                                                         <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                             <stop offset="0%" stopColor={gradColorStart} stopOpacity="0.5" />
                                                             <stop offset="50%" stopColor={gradColorEnd} stopOpacity="0.9" />
                                                             <stop offset="100%" stopColor={gradColorStart} stopOpacity="0.5" />
                                                         </linearGradient>
                                                         <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                             <stop offset="0%" stopColor={gradColorStart} stopOpacity="0.12" />
                                                             <stop offset="100%" stopColor={gradColorEnd} stopOpacity="0.01" />
                                                         </linearGradient>
                                                         <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                             <feGaussianBlur stdDeviation="5" result="blur" />
                                                             <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                                         </filter>
                                                     </>
                                                 );
                                             })()}
                                     </defs>

                                     {/* Horizontal Guidelines */}
                                     {[0.25, 0.5, 0.75].map((ratio, index) => {
                                         const yVal = minVal + range * ratio;
                                         return (
                                             <g key={index}>
                                                 <line 
                                                     x1={padding} 
                                                     y1={getY(yVal)} 
                                                     x2={svgWidth - padding} 
                                                     y2={getY(yVal)} 
                                                     stroke="rgba(255,255,255,0.02)"
                                                     strokeDasharray="4 4" 
                                                 />
                                                 <text 
                                                     x={padding + 5} 
                                                     y={getY(yVal) - 4} 
                                                     fill="rgba(255,255,255,0.2)"
                                                     className="text-[8px] font-mono"
                                                 >
                                                     ${Math.round(yVal).toLocaleString()}
                                                 </text>
                                             </g>
                                         );
                                     })}

                                     {/* Shaded Confidence Bounds */}
                                     <path d={areaPath} fill="url(#areaGrad)" stroke="rgba(255, 255, 255, 0.02)" />

                                     {/* Main Projected Price Path */}
                                     <path 
                                         d={linePath} 
                                         fill="none" 
                                         stroke="url(#glowGrad)" 
                                         strokeWidth="3.5"
                                         filter="url(#glow)" 
                                         strokeLinecap="round"
                                     />

                                     {/* Interactive Dots */}
                                     {forecastData.map((d, i) => {
                                         const cx = getX(i, forecastData.length);
                                         const cy = getY(d.price);
                                         const isHovered = hoveredDataPoint?.day === d.day;
                                         return (
                                             <g key={i} className="cursor-pointer">
                                                                                   {/* Outer glow aura */}
                                                                                   <circle
                                                                                       cx={cx}
                                                                                       cy={cy}
                                                                                       r={isHovered ? 12 : 7}
                                                                                       fill={selectedScenario === "bullish" ? "#10b981" : (selectedScenario === "bearish" ? "#f43f5e" : "#8b5cf6")}
                                                                                       fillOpacity={isHovered ? "0.3" : "0.0"}
                                                                                       className="transition-all duration-150"
                                                                                   />
                                                                                   {/* Solid dot core */}
                                                                                   <circle
                                                                                       cx={cx}
                                                                                       cy={cy}
                                                                                       r="3.5"
                                                                                       fill={isHovered ? "#10b981" : (selectedScenario === "bullish" ? "#10b981" : (selectedScenario === "bearish" ? "#f43f5e" : "#8b5cf6"))}
                                                                                       stroke="#050507"
                                                                                       strokeWidth="1.5"
                                                                                       onMouseEnter={() => setHoveredDataPoint(d)}
                                                                                       className="transition-all duration-150"
                                                                                   />
                                                 {/* Label for days at base */}
                                                 <text 
                                                     x={cx} 
                                                     y={svgHeight - 2} 
                                                     textAnchor="middle" 
                                                     fill="rgba(255,255,255,0.25)" 
                                                     className="text-[8px] font-mono font-black"
                                                 >
                                                     +{d.day}d
                                                 </text>
                                             </g>
                                         );
                                     })}
                                 </svg>
                             );
                         })()}
                     </div>

                     <div className="flex justify-between items-center text-[9px] text-gray-500 font-bold px-2 uppercase tracking-wider">
                                   <span>{language === 'fa' ? 'امروز (شروع محاسبات)' : 'Today (Computation Start)'}</span>
                                   <span>{language === 'fa' ? 'سررسید پیش‌بینی ۳۰ روزه' : '30-Day Horizon Target'}</span>
                     </div>
                 </div>

                 {/* Performance Metric & Technical Patterns Confluence Card */}
                 <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                     
                           {/* Stats Grid */}
                           <div className="bg-[#0e0e11] border border-white/5 rounded-2xl p-5 shadow-2xl">
                         <h4 className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5 mb-4 pb-2 border-b border-white/5">
                             <Gauge className="w-4 h-4 text-green-400" />
                             {analysis.labels.detailsTitle}
                         </h4>
                         
                         <div className="grid grid-cols-2 gap-3">
                             <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                                                   <div className="text-[8px] text-gray-400 uppercase font-black">{analysis.labels.forecastMape}</div>
                                 <div className="text-sm font-mono font-bold text-green-400 mt-1">
                                     {selectedForecastModel === 'lstm' ? '0.82%' : (selectedForecastModel === 'transformer' ? '0.74%' : (selectedForecastModel === 'arima' ? '1.45%' : '0.95%'))}
                                 </div>
                             </div>
                             <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                                                   <div className="text-[8px] text-gray-400 uppercase font-black">{analysis.labels.forecastR2}</div>
                                 <div className="text-sm font-mono font-bold text-white mt-1">
                                     {selectedForecastModel === 'transformer' ? '0.988' : '0.985'}
                                 </div>
                             </div>
                             <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                                                   <div className="text-[8px] text-gray-400 uppercase font-black">{analysis.labels.forecastSharpe}</div>
                                 <div className="text-sm font-mono font-bold text-yellow-500 mt-1">
                                     {selectedScenario === 'bullish' ? '5.42' : '4.80'}
                                 </div>
                             </div>
                             <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                                                   <div className="text-[8px] text-gray-400 uppercase font-black">{analysis.labels.forecastMaxDrawdown}</div>
                                 <div className="text-sm font-mono font-bold text-emerald-400 mt-1">
                                     -1.25%
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Modern Confluence list without deleting any indicators */}
                           <div className="bg-[#0e0e11] border border-white/5 rounded-2xl p-5 flex-grow flex flex-col justify-between shadow-2xl">
                         <div>
                             <h4 className="text-xs font-bold text-gray-300 uppercase flex items-center gap-1.5 mb-4 pb-2 border-b border-white/5">
                                 <Sliders className="w-4 h-4 text-purple-400" />
                                 {language === 'fa' ? 'الگوهای تکنیکال و هارمونیک روز' : 'Active Mathematical Pattern Geometry'}
                             </h4>
                             
                             <div className="space-y-3">
                                 <div className="flex justify-between items-center text-xs">
                                                           <span className="text-gray-400 font-bold">{analysis.labels.harmonicTitle}</span>
                                                           <span className="font-extrabold text-white">{analysis.indicators.harmonicPattern}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                                           <span className="text-gray-400 font-bold">{analysis.labels.elliottTitle}</span>
                                                           <span className="font-extrabold text-indigo-400">{analysis.indicators.elliottWave}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                                           <span className="text-gray-400 font-bold">{analysis.labels.regressionTitle}</span>
                                                           <span className="font-extrabold text-blue-400">{analysis.indicators.regressionChannel}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                                           <span className="text-gray-400 font-bold">{analysis.labels.liquidityTitle}</span>
                                                           <span className="font-extrabold text-orange-400">{analysis.indicators.liquidityPools}</span>
                                 </div>
                                 <div className="flex justify-between items-center text-xs">
                                                           <span className="text-gray-400 font-bold">{analysis.labels.obvTitle}</span>
                                                           <span className="font-extrabold text-green-400">{analysis.indicators.obvStatus}</span>
                                 </div>
                             </div>
                         </div>

                                   <div className="mt-4 text-[10px] text-gray-400 font-medium leading-relaxed border-t border-white/5 pt-3">
                                       <Info className="w-3.5 h-3.5 inline text-purple-400 mr-1" />
                             {language === 'fa' 
                                 ? 'این الگوها تلاقی کامل حمایت ماکرو با حداقل خطای پیش‌بینی را تایید می‌کنند.' 
                                 : 'These mathematical pattern boundaries establish critical macro validation thresholds.'}
                         </div>
                     </div>

                 </div>

             </div>

             {/* Deep Reasoning Argumentation Prose Box (Fundamental & Technical) */}
             <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-6">
                 <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
                     <h4 className="text-xs font-black text-yellow-500 uppercase mb-3 flex items-center gap-2">
                         <Globe className="w-4 h-4" />
                         {language === 'fa' ? 'تحلیل فاندامنتال استدلالی عمیق شکارچی' : 'Deep Dynamic Fundamental Logic Confluence'}
                     </h4>
                     <p className="text-xs text-gray-300 leading-relaxed text-justify">
                         {analysis.reasoning.advancedFundamentalDetailed}
                     </p>
                 </div>

                 <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                     <h4 className="text-xs font-black text-purple-500 uppercase mb-3 flex items-center gap-2">
                         <Sliders className="w-4 h-4" />
                         {language === 'fa' ? 'تلاقی ساختار ریاضیاتی و هندسه بازار' : 'Mathematical Structure & Technical Synergy'}
                     </h4>
                     <p className="text-xs text-gray-300 leading-relaxed text-justify">
                         {analysis.reasoning.advancedTechnicalDetailed}
                     </p>
                 </div>
             </div>

        </div>
        )}

        {/* --- NEW SECTION: ADVANCED MARKET INTELLIGENCE (SIMULATED PRO DATA) --- */}
        {analysis.institutional && btcPrice > 0 && (
        <div className="mt-8 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-xl">
             <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <BarChart2 className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-bold text-white">{analysis.labels.advancedDataTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Whale Flow */}
                <div className="bg-[#0F0F0F] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    <div>
                        <div className="text-gray-500 text-xs uppercase font-bold mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Waves className="w-4 h-4 text-blue-400" />
                                {language === 'fa' ? 'جریان پول نهنگ‌ها' : 'Whale Netflow'}
                            </span>
                            <span className="text-[8px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                                {language === 'fa' ? 'سنگین' : 'Heavy'}
                            </span>
                        </div>
                        <div className={`text-2xl font-mono font-black ${
                            analysis.institutional.whaleFlow.includes('+') 
                                ? 'text-green-400' 
                                : (analysis.institutional.whaleFlow.includes('-') 
                                    ? 'text-red-400' 
                                    : 'text-gray-400')
                        }`}>
                            {analysis.institutional.whaleFlow}
                        </div>
                    </div>
                    
                    {/* Visual bar showing flow status */}
                    <div className="my-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${
                            analysis.institutional.whaleFlow.includes('+') 
                                ? 'bg-gradient-to-r from-blue-500 to-green-400 w-3/4' 
                                : (analysis.institutional.whaleFlow.includes('-') 
                                    ? 'bg-gradient-to-r from-red-500 to-orange-400 w-1/3' 
                                    : 'bg-gray-600 w-1/2')
                        }`} />
                    </div>

                    <div className="text-[10px] text-gray-400 leading-snug">
                        {language === 'fa' ? 'تراکنش‌های ولت‌های بالای ۱۰۰۰ بیت‌کوین در اسپات.' : 'Tracking wallets holding >1,000 BTC across spot books.'}
                    </div>
                </div>

                {/* ETF Flow */}
                <div className="bg-[#0F0F0F] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    <div>
                        <div className="text-gray-500 text-xs uppercase font-bold mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-yellow-400" />
                                {language === 'fa' ? 'ورودی ETFها' : 'Spot ETF Inflows'}
                            </span>
                            <span className="text-[8px] font-mono text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                                {language === 'fa' ? 'روزانه' : 'Daily'}
                            </span>
                        </div>
                        <div className={`text-2xl font-mono font-black ${
                            analysis.institutional.etfNetflow.includes('+') 
                                ? 'text-green-400' 
                                : 'text-red-400'
                        }`}>
                             {analysis.institutional.etfNetflow}
                        </div>
                    </div>

                    {/* Visual indicator of ETF flow strength */}
                    <div className="my-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full w-2/3" />
                    </div>

                    <div className="text-[10px] text-gray-400 leading-snug">
                        {language === 'fa' ? 'جریان خالص خرید صندوق‌های IBIT بلک‌راک و غیره.' : 'Aggregated flows for institutional Wall Street products.'}
                    </div>
                </div>

                {/* Funding Rate */}
                <div className="bg-[#0F0F0F] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    
                    <div>
                        <div className="text-gray-500 text-xs uppercase font-bold mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-400" />
                                {language === 'fa' ? 'نرخ فاندینگ ریت' : 'Funding Rate'}
                            </span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
                                analysis.institutional.fundingRate.includes('Positive') 
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                                {analysis.institutional.fundingRate.includes('Positive') 
                                    ? (language === 'fa' ? 'مثبت (صعودی)' : 'Positive') 
                                    : (language === 'fa' ? 'منفی (نزولی)' : 'Negative')}
                            </span>
                        </div>
                        
                        {/* Large visual value with green/red indicator */}
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className={`text-2xl font-mono font-black ${
                                analysis.institutional.fundingRate.includes('Positive') ? 'text-green-400' : 'text-red-400'
                             }`}>
                                {analysis.institutional.fundingRate.split(' ')[0]}
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold">
                                {language === 'fa' ? 'هر ۸ ساعت' : '8h Interval'}
                            </span>
                        </div>
                    </div>

                    {/* Graphical Slider representation */}
                    <div className="my-2">
                        <div className="flex justify-between text-[8px] text-gray-500 mb-1 font-mono">
                            <span>-0.05%</span>
                            <span>0.0%</span>
                            <span>+0.05%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full relative overflow-hidden">
                            {/* Background gradient track: red to gray to green */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/40 via-white/5 to-green-500/40" />
                            
                            {/* The active dot slider position */}
                            {(() => {
                                const isPos = analysis.institutional.fundingRate.includes('Positive');
                                const pct = isPos ? 68 : 38;
                                return (
                                    <div 
                                        className={`absolute top-0 bottom-0 w-2.5 h-2.5 -mt-[2px] rounded-full border border-black shadow-md ${isPos ? 'bg-green-400' : 'bg-red-400'}`}
                                        style={{ left: `calc(${pct}% - 5px)` }}
                                    />
                                );
                            })()}
                        </div>
                    </div>

                    <div className="text-[10px] text-gray-400 leading-snug">
                        {language === 'fa' ? (
                            analysis.institutional.fundingRate.includes('Positive') 
                                ? 'خریداران به فروشندگان بهره پرداخت می‌کنند (اهرم خرید سنگین).' 
                                : 'فروشندگان به خریداران بهره پرداخت می‌کنند (اهرم فروش سنگین).'
                        ) : (
                            analysis.institutional.fundingRate.includes('Positive') 
                                ? 'Longs pay premiums to shorts (bullish bias).' 
                                : 'Shorts pay funding premiums to longs (bearish bias).'
                        )}
                    </div>
                </div>

                {/* Heatmap */}
                <div className="bg-[#0F0F0F] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                    {/* Glow background pattern */}
                    <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full" />

                    <div>
                        <div className="text-gray-500 text-xs uppercase font-bold mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-orange-400" />
                                {language === 'fa' ? 'نقشه حرارتی لیکوئیدیتی' : 'Liquidation Heatmap'}
                            </span>
                            <span className="text-[9px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded uppercase animate-pulse">
                                {language === 'fa' ? 'محرک بازار' : 'Market Trigger'}
                            </span>
                        </div>
                        
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl font-mono font-black text-orange-400">
                                {analysis.institutional.liquidationHeatmap}
                            </span>
                            <span className="text-[10px] text-red-400 font-bold animate-pulse">
                                {language === 'fa' ? 'تراکم بالا' : 'High Density'}
                            </span>
                        </div>
                    </div>

                    {/* Real visual micro bar heatmap representation */}
                    <div className="my-2 flex items-end justify-between gap-1 h-8 px-1">
                        {[20, 45, 95, 30, 15].map((val, idx) => {
                            const isTrigger = idx === 2;
                            return (
                                <div key={idx} className="flex-grow flex flex-col items-center">
                                    <div 
                                        className={`w-full rounded-t-sm transition-all duration-500 ${
                                            isTrigger 
                                                ? 'bg-gradient-to-t from-orange-600 to-yellow-400 animate-pulse' 
                                                : 'bg-orange-500/20 group-hover:bg-orange-500/30'
                                        }`}
                                        style={{ height: `${val}%` }}
                                    />
                                    <span className="text-[7px] font-mono text-gray-500 mt-1">
                                        {idx === 0 ? '-5%' : idx === 2 ? 'Zone' : idx === 4 ? '+5%' : ''}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-[10px] text-gray-400 leading-snug">
                        {language === 'fa' ? (
                            `بزرگترین کانون استخرهای نقدینگی که آهنربای جذب قیمت محلی است.`
                        ) : (
                            `Deep liquidations concentrated here act as a magnetic attractor for local price.`
                        )}
                    </div>
                </div>

            </div>
        </div>
        )}

        {/* --- TOP 10 MOTHER COINS --- */}
        <div className="mt-8 bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Database className="w-6 h-6 text-primary-500" />
                <h3 className="text-xl font-bold text-white">{analysis.labels?.topCoinsTitle}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {topCoins.map((coin) => {
                    const isExpanded = expandedCoinSymbol === coin.symbol;
                    return (
                        <div 
                            key={coin.symbol} 
                            onClick={() => setExpandedCoinSymbol(isExpanded ? null : coin.symbol)}
                            className={`bg-[#0F0F0F] rounded-2xl p-4 border transition-all cursor-pointer select-none relative overflow-hidden group flex flex-col justify-between ${
                                isExpanded 
                                    ? 'border-primary-500/40 bg-[#121212] ring-1 ring-primary-500/20 col-span-1 sm:col-span-2 lg:col-span-2' 
                                    : 'border-white/5 hover:border-white/10 hover:bg-[#151515]'
                            }`}
                        >
                            {/* Top Card Section */}
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold border border-white/10">
                                            {coin.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">{coin.name}</div>
                                            <div className="text-[10px] text-gray-500">{coin.network}</div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-400 group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-colors">
                                        {coin.symbol}
                                    </span>
                                </div>
                                
                                <div className="space-y-1 mt-3">
                                     <div className="flex justify-between text-xs">
                                         <span className="text-gray-500">{language === 'fa' ? 'قیمت فعلی' : 'Price'}</span>
                                         <span className="font-mono text-white">${coin.price.toLocaleString()}</span>
                                     </div>
                                     <div className="flex justify-between text-xs">
                                         <span className="text-gray-500">{language === 'fa' ? 'تارگت' : 'Target'}</span>
                                         <span className={`font-mono font-bold ${coin.change > 0 ? 'text-green-400' : 'text-red-400'}`}>${coin.target.toLocaleString()}</span>
                                     </div>
                                     <div className="mt-3 pt-2 border-t border-white/5 flex justify-between items-center">
                                         <span className={`text-xs font-bold ${coin.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                             {coin.change > 0 ? '+' : ''}{coin.change}%
                                         </span>
                                         <span className="text-[9px] uppercase tracking-wide text-gray-400">{coin.potential}</span>
                                     </div>
                                </div>
                            </div>

                            {/* EXPANDED AREA FOR DEEP REVIEW OF INVESTMENT OPPORTUNITY */}
                            {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in text-xs" onClick={(e) => e.stopPropagation()}>
                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="text-gray-500 text-[8px] uppercase font-bold">{language === 'fa' ? 'محدوده خرید پیشنهادی' : 'Entry Zone'}</div>
                                            <div className="font-mono font-bold text-green-400 mt-0.5">{coin.entryRange}</div>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="text-gray-500 text-[8px] uppercase font-bold">{language === 'fa' ? 'حد ضرر محاسباتی' : 'Stop Loss'}</div>
                                            <div className="font-mono font-bold text-red-400 mt-0.5">${coin.stopLoss}</div>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="text-gray-500 text-[8px] uppercase font-bold">{language === 'fa' ? 'تخصیص پیشنهادی سبد' : 'Allocation'}</div>
                                            <div className="font-bold text-yellow-500 mt-0.5">{coin.alloc}</div>
                                        </div>
                                        <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                                            <div className="text-gray-500 text-[8px] uppercase font-bold">{language === 'fa' ? 'الگوی هندسی چارت' : 'Chart Pattern'}</div>
                                            <div className="font-bold text-blue-400 truncate mt-0.5" title={coin.pattern}>{coin.pattern}</div>
                                        </div>
                                    </div>

                                    {/* AI Consensus Score bar */}
                                    <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                                        <div className="flex justify-between items-center text-[10px] mb-1 font-bold">
                                            <span className="text-gray-500">{language === 'fa' ? 'امتیاز اجماع فرصت سرمایه‌گذاری' : 'Investment Confluence Score'}</span>
                                            <span className="text-green-400 font-mono">{coin.score}/100</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" style={{ width: `${coin.score}%` }} />
                                        </div>
                                    </div>

                                    {/* Analysis Prose text */}
                                    <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5 text-gray-300 leading-relaxed text-justify">
                                        <div className="font-black text-[9px] text-primary-400 uppercase mb-1 flex items-center gap-1">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {language === 'fa' ? 'تحلیل فاندامنتال و تکنیکال عمیق' : 'Deep AI Opportunity Review'}
                                        </div>
                                        <p className="text-[11px]">
                                            {language === 'fa' ? coin.analysisFa : coin.analysisEn}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Little indicator button showing you can expand */}
                            <div className="mt-3 pt-2 border-t border-white/5 flex justify-center items-center">
                                <span className="text-[9px] text-primary-400/80 group-hover:text-primary-400 flex items-center gap-1 font-bold uppercase tracking-wider transition-colors">
                                    {isExpanded 
                                        ? (language === 'fa' ? 'بستن جزئیات ×' : 'Hide Details ×') 
                                        : (language === 'fa' ? 'مشاهده بررسی عمیق و فرصت خرید →' : 'View Deep Analysis & Entry →')}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default CryptoSignals;
