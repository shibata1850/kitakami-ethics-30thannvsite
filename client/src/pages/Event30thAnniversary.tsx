import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaPhone, FaGlobe, FaDollarSign, FaHome, FaFacebookF, FaTwitter, FaLine, FaShareAlt } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

const timelineYears = [
  { year: 1995, label: "1995年", title: "設立記念式典" },
  { year: 2000, label: "2000年", title: "成長と学び" },
  { year: 2005, label: "2005年", title: "地域貢献活動" },
  { year: 2010, label: "2010年", title: "富士研修合宿" },
  { year: 2015, label: "2015年", title: "20周年記念式典" },
  { year: 2020, label: "2020年", title: "新しい時代への適応" },
  { year: 2025, label: "2025年", title: "次世代への継承" },
  { year: 2030, label: "2030年", title: "AI時代到来と未来" },
];

export default function Event30thAnniversary() {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const galleryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Calculate time left until event date (2026-04-19 15:00)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2026-04-19T15:00:00+09:00').getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const scrollToYear = (year: number) => {
    const element = galleryRefs.current[year];
    if (element) {
      const yOffset = -100; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveYear(year);
    }
  };

  const shareToFacebook = (imageUrl: string, title: string) => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = (imageUrl: string, title: string) => {
    const text = encodeURIComponent(`北上市倫理法人会 30年の歩み - ${title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
  };

  const shareToLine = (imageUrl: string, title: string) => {
    const text = encodeURIComponent(`北上市倫理法人会 30年の歩み - ${title}`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] via-white to-[#FFF8F0]">
      {/* Hero Section - Premium Design */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background with Elegant Gradient */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/30th-hero-bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        
        {/* Decorative Sakura Ornaments */}
        <div 
          className="absolute left-0 top-1/4 w-64 h-96 bg-contain bg-no-repeat opacity-0 pointer-events-none"
          style={{ backgroundImage: 'url(/images/30th-ornament-left.png)' }}
        />
        <div 
          className="absolute right-0 top-1/3 w-64 h-96 bg-contain bg-no-repeat opacity-0 pointer-events-none"
          style={{ backgroundImage: 'url(/images/30th-ornament-right.png)' }}
        />
        
        {/* Floating Sakura Petals Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-[10%] w-8 h-8 bg-[#FFB7C5]/40 rounded-full animate-float" style={{ animationDelay: '0s', animationDuration: '8s' }} />
          <div className="absolute top-20 left-[30%] w-6 h-6 bg-[#F8BBD0]/50 rounded-full animate-float" style={{ animationDelay: '2s', animationDuration: '10s' }} />
          <div className="absolute top-32 right-[20%] w-10 h-10 bg-[#FFB7C5]/30 rounded-full animate-float" style={{ animationDelay: '4s', animationDuration: '12s' }} />
          <div className="absolute top-16 right-[40%] w-8 h-8 bg-[#F8BBD0]/40 rounded-full animate-float" style={{ animationDelay: '1s', animationDuration: '9s' }} />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-left px-4 py-16">
          {/* Home Button - Premium Style */}
          <Link href="/">
            <Button 
              variant="outline" 
              className="absolute top-4 left-4 gap-2 bg-white/95 hover:bg-white border-2 border-[#E8B4B8] text-[#C48B9F] hover:text-[#B07A8E] shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <FaHome className="text-lg" />
              <span className="font-semibold">ホームへ戻る</span>
            </Button>
          </Link>
          
          {/* Logo with Premium Shadow */}
          <div className="mb-10 relative">
            <div className="absolute inset-0 bg-white/60 blur-3xl rounded-full" />
            <img 
              src="/images/rinri30th.png" 
              alt="30周年記念ロゴ" 
              className="w-72 h-72 md:w-96 md:h-96 mx-auto relative drop-shadow-2xl animate-in fade-in zoom-in duration-1000"
            />
          </div>
          
          {/* Title with Elegant Typography */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <span className="block text-gray-900 font-serif">
              北上市倫理法人会
            </span>
            <span className="block mt-3 text-gray-800 text-3xl md:text-5xl">
              設立30周年記念式典・懇親会
            </span>
          </h1>
          
          {/* Countdown Timer */}
          <div className="my-10 animate-in fade-in duration-1000 delay-700">
            <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl border-2 border-[#F8BBD0]/40">
              <p className="text-sm md:text-base text-[#C48B9F] font-semibold mb-4 text-left tracking-wide">
                式典まであと
              </p>
              <div className="flex gap-3 md:gap-6">
                <div className="text-left">
                  <div className="bg-gradient-to-br from-[#FFB7C5] to-[#E8B4B8] text-white rounded-xl px-4 py-3 md:px-6 md:py-4 shadow-lg">
                    <div className="text-3xl md:text-5xl font-bold tabular-nums">{timeLeft.days}</div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-2 font-medium">日</div>
                </div>
                <div className="text-left">
                  <div className="bg-gradient-to-br from-[#FFB7C5] to-[#E8B4B8] text-white rounded-xl px-4 py-3 md:px-6 md:py-4 shadow-lg">
                    <div className="text-3xl md:text-5xl font-bold tabular-nums">{String(timeLeft.hours).padStart(2, '0')}</div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-2 font-medium">時間</div>
                </div>
                <div className="text-left">
                  <div className="bg-gradient-to-br from-[#FFB7C5] to-[#E8B4B8] text-white rounded-xl px-4 py-3 md:px-6 md:py-4 shadow-lg">
                    <div className="text-3xl md:text-5xl font-bold tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-2 font-medium">分</div>
                </div>
                <div className="text-left">
                  <div className="bg-gradient-to-br from-[#FFB7C5] to-[#E8B4B8] text-white rounded-xl px-4 py-3 md:px-6 md:py-4 shadow-lg">
                    <div className="text-3xl md:text-5xl font-bold tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-2 font-medium">秒</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 my-8 animate-in fade-in duration-1000 delay-500">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#E8B4B8]" />
            <div className="w-2 h-2 rounded-full bg-[#E8B4B8]" />
            <div className="h-px w-32 bg-[#E8B4B8]" />
            <div className="w-2 h-2 rounded-full bg-[#E8B4B8]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#E8B4B8]" />
          </div>
        </div>
      </section>

      {/* Message Section - Refined Layout */}
      <section className="container py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <Card className="p-10 md:p-16 bg-white/80 backdrop-blur-sm shadow-2xl border-2 border-[#F8BBD0]/30 relative overflow-hidden">
            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#FFB7C5]/10 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#FFB7C5]/10 to-transparent rounded-tl-full" />
            
            <div className="prose prose-lg max-w-none relative z-10">
              <p className="text-right mb-10 text-xl font-serif text-gray-700">謹啓</p>
              
              <div className="space-y-6 text-gray-800 leading-relaxed text-lg">
                <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-[#C48B9F] first-letter:float-left first-letter:mr-2 first-letter:mt-1">
                  早春の候　時下ますますご清栄のこととお喜び申し上げます。
                </p>
                
                <p>
                  平素は格別のお引き立てを賜り深謝申し上げます。
                </p>
                
                <p className="font-semibold text-[#C48B9F]">
                  さて北上市倫理法人会は、令和8年度をもちまして設立30周年を迎えることとなりました。
                </p>
                
                <p>
                  これもひとえに皆様方のご支援ご鞭撻の賜物と深く感謝いたしております。
                </p>
                
                <p>
                  つきましては北上市倫理法人会会員および岩手県内の倫友の皆様と30年の振り返りとこれからの発展を祈念して、
                </p>
                
                <p className="font-semibold">
                  設立30周年記念式典・懇親会を催したいと存じます。
                </p>
                
                <p>
                  皆様におかれましてはご多忙のところ誠に恐縮ではございますが、何卒ご来駕賜りますようご案内申し上げます。
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-[#F8BBD0]/30">
                <p className="text-right mb-3 text-xl font-serif text-gray-700">謹白</p>
                <p className="text-right mb-2 text-gray-600">令和8年3月</p>
                <p className="text-right font-bold text-xl text-[#C48B9F]">北上市倫理法人会　会長　伊藤正治</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Event Details Section - Premium Card Design */}
      <section className="container py-20 md:py-28 bg-gradient-to-b from-transparent via-[#FFF8F0]/50 to-transparent">
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#C48B9F] to-[#E8B4B8] font-serif">
            イベント詳細
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8B4B8]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
            <div className="h-px w-24 bg-[#E8B4B8]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8B4B8]" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Date & Time */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-br from-[#FFB7C5]/20 to-[#F8BBD0]/20 rounded-2xl group-hover:from-[#FFB7C5]/30 group-hover:to-[#F8BBD0]/30 transition-all duration-500">
                <FaCalendar className="text-[#C48B9F] text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-gray-800">日時</h3>
                <p className="text-gray-700 text-lg font-semibold mb-1">2026年4月19日（日）</p>
                <p className="text-gray-700 text-lg mb-2">15:00 - 19:00</p>
                <p className="text-sm text-gray-500 bg-[#FFF8F0] px-3 py-1 rounded-full inline-block">受付時間: 14:30 -</p>
              </div>
            </div>
          </Card>

          {/* Venue */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-br from-[#FFB7C5]/20 to-[#F8BBD0]/20 rounded-2xl group-hover:from-[#FFB7C5]/30 group-hover:to-[#F8BBD0]/30 transition-all duration-500">
                <FaMapMarkerAlt className="text-[#C48B9F] text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-gray-800">会場</h3>
                <p className="font-bold text-gray-800 text-lg mb-1">ブランニュー北上</p>
                <p className="text-gray-700">岩手県北上市大通り1丁目10-1</p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-br from-[#FFB7C5]/20 to-[#F8BBD0]/20 rounded-2xl group-hover:from-[#FFB7C5]/30 group-hover:to-[#F8BBD0]/30 transition-all duration-500">
                <FaPhone className="text-[#C48B9F] text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-gray-800">お問い合わせ</h3>
                <p className="text-gray-700 text-2xl font-semibold">0197-72-7075</p>
              </div>
            </div>
          </Card>

          {/* Fee */}
          <Card className="p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-[#FFB7C5]/10 to-[#F8BBD0]/10 backdrop-blur-sm border-2 border-[#E8B4B8]/50 group">
            <div className="flex items-start gap-6">
              <div className="p-4 bg-gradient-to-br from-[#C48B9F]/20 to-[#E8B4B8]/20 rounded-2xl group-hover:from-[#C48B9F]/30 group-hover:to-[#E8B4B8]/30 transition-all duration-500">
                <FaDollarSign className="text-[#C48B9F] text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-3 text-gray-800">会費</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#C48B9F] to-[#E8B4B8]">
                  10,000円
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Website Link */}
        <Card className="p-8 hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 max-w-5xl mx-auto mt-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-[#FFB7C5]/20 to-[#F8BBD0]/20 rounded-2xl">
              <FaGlobe className="text-[#C48B9F] text-3xl" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-3 text-gray-800">会場ウェブサイト</h3>
              <a 
                href="https://www.brandnew-k.com/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#C48B9F] hover:text-[#B07A8E] underline text-lg transition-colors duration-300"
              >
                https://www.brandnew-k.com/index.html
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* Access Section - Elegant Design */}
      <section className="container py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-left mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#C48B9F] to-[#E8B4B8] font-serif">
              会場へのアクセス
            </h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8B4B8]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
              <div className="h-px w-24 bg-[#E8B4B8]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8B4B8]" />
            </div>
          </div>
          
          <Card className="p-10 md:p-12 bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-[#F8BBD0]/30">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              ブランニュー北上は、<span className="font-semibold text-[#C48B9F]">JR北上駅西口から徒歩３分</span>の距離にございます。<br />
              お車でお越しの際は、当館裏手に<span className="font-semibold text-[#C48B9F]">専用駐車場（50台）</span>がございますのでそちらをご利用下さいませ。
            </p>
            <div className="flex justify-center">
              <a
                href="https://www.google.com/maps/search/?api=1&query=岩手県北上市大通り1丁目10-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  className="gap-3 px-8 py-6 text-lg border-2 border-[#E8B4B8] text-[#C48B9F] hover:bg-[#FFF8F0] hover:border-[#C48B9F] transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <FaMapMarkerAlt className="text-xl" />
                  GoogleMapで見る
                </Button>
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* Gallery Section - 30 Years History */}
      <section className="container py-20 md:py-28">
        <div className="text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#C48B9F] to-[#E8B4B8] font-serif">
            30年の歩み
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8B4B8]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
            <div className="h-px w-24 bg-[#E8B4B8]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8B4B8]" />
          </div>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            1995年の設立から現在まで、北上市倫理法人会の歴史を写真で振り返ります。
          </p>
        </div>
        
        {/* Timeline Bar */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border-2 border-[#F8BBD0]/30">
            <div className="flex flex-wrap justify-center gap-3">
              {timelineYears.map((item) => (
                <button
                  key={item.year}
                  onClick={() => scrollToYear(item.year)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeYear === item.year
                      ? 'bg-gradient-to-r from-[#C48B9F] to-[#E8B4B8] text-white shadow-lg scale-110'
                      : 'bg-white text-[#C48B9F] border-2 border-[#E8B4B8] hover:bg-[#FFF8F0] hover:scale-105'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* 1995 - Founding */}
          <Card 
            ref={(el) => { galleryRefs.current[1995] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/1995-founding.jpg" 
                alt="1995年 設立記念式典" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">1995年</p>
                <h3 className="text-xl font-bold">設立記念式典</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => shareToFacebook('/images/gallery/1995-founding.jpg', '設立記念式典')}
                  className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  aria-label="Facebookでシェア"
                >
                  <FaFacebookF className="text-sm" />
                </button>
                <button
                  onClick={() => shareToTwitter('/images/gallery/1995-founding.jpg', '設立記念式典')}
                  className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  aria-label="Xでシェア"
                >
                  <FaTwitter className="text-sm" />
                </button>
                <button
                  onClick={() => shareToLine('/images/gallery/1995-founding.jpg', '設立記念式典')}
                  className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                  aria-label="LINEでシェア"
                >
                  <FaLine className="text-sm" />
                </button>
              </div>
            </div>
          </Card>

          {/* 2000 - Morning Seminar */}
          <Card 
            ref={(el) => { galleryRefs.current[2000] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/2000-morning-seminar.jpg" 
                alt="2000年 朝活セミナー" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">2000年</p>
                <h3 className="text-xl font-bold">成長と学び</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => shareToFacebook('/images/gallery/2000-morning-seminar.jpg', '成長と学び')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Facebookでシェア"><FaFacebookF className="text-sm" /></button>
                <button onClick={() => shareToTwitter('/images/gallery/2000-morning-seminar.jpg', '成長と学び')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Xでシェア"><FaTwitter className="text-sm" /></button>
                <button onClick={() => shareToLine('/images/gallery/2000-morning-seminar.jpg', '成長と学び')} className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="LINEでシェア"><FaLine className="text-sm" /></button>
              </div>
            </div>
          </Card>

          {/* 2005 - Community Service */}
          <Card 
            ref={(el) => { galleryRefs.current[2005] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/2005-community-service.jpg" 
                alt="2005年 地域清掃活動" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">2005年</p>
                <h3 className="text-xl font-bold">地域貢献活動</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => shareToFacebook('/images/gallery/2005-community-service.jpg', '地域貢献活動')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Facebookでシェア"><FaFacebookF className="text-sm" /></button>
                <button onClick={() => shareToTwitter('/images/gallery/2005-community-service.jpg', '地域貢献活動')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Xでシェア"><FaTwitter className="text-sm" /></button>
                <button onClick={() => shareToLine('/images/gallery/2005-community-service.jpg', '地域貢献活動')} className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="LINEでシェア"><FaLine className="text-sm" /></button>
              </div>
            </div>
          </Card>

          {/* 2010 - Training Retreat */}
          <Card 
            ref={(el) => { galleryRefs.current[2010] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/2010-training-retreat.jpg" 
                alt="2010年 富士研修合宿" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">2010年</p>
                <h3 className="text-xl font-bold">富士研修合宿</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => shareToFacebook('/images/gallery/2010-training-retreat.jpg', '富士研修合宿')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Facebookでシェア"><FaFacebookF className="text-sm" /></button>
                <button onClick={() => shareToTwitter('/images/gallery/2010-training-retreat.jpg', '富士研修合宿')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Xでシェア"><FaTwitter className="text-sm" /></button>
                <button onClick={() => shareToLine('/images/gallery/2010-training-retreat.jpg', '富士研修合宿')} className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="LINEでシェア"><FaLine className="text-sm" /></button>
              </div>
            </div>
          </Card>

          {/* 2015 - 20th Anniversary */}
          <Card 
            ref={(el) => { galleryRefs.current[2015] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/2015-anniversary.jpg" 
                alt="2015年 20周年記念式典" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">2015年</p>
                <h3 className="text-xl font-bold">20周年記念式典</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => shareToFacebook('/images/gallery/2015-anniversary.jpg', '20周年記念式典')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Facebookでシェア"><FaFacebookF className="text-sm" /></button>
                <button onClick={() => shareToTwitter('/images/gallery/2015-anniversary.jpg', '20周年記念式典')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Xでシェア"><FaTwitter className="text-sm" /></button>
                <button onClick={() => shareToLine('/images/gallery/2015-anniversary.jpg', '20周年記念式典')} className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="LINEでシェア"><FaLine className="text-sm" /></button>
              </div>
            </div>
          </Card>

          {/* 2020 - Virtual Meeting */}
          <Card 
            ref={(el) => { galleryRefs.current[2020] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/2020-virtual-meeting.jpg" 
                alt="2020年 ハイブリッド会議" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">2020年</p>
                <h3 className="text-xl font-bold">新しい時代への適応</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => shareToFacebook('/images/gallery/2020-virtual-meeting.jpg', '新しい時代への適応')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Facebookでシェア"><FaFacebookF className="text-sm" /></button>
                <button onClick={() => shareToTwitter('/images/gallery/2020-virtual-meeting.jpg', '新しい時代への適応')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Xでシェア"><FaTwitter className="text-sm" /></button>
                <button onClick={() => shareToLine('/images/gallery/2020-virtual-meeting.jpg', '新しい時代への適応')} className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="LINEでシェア"><FaLine className="text-sm" /></button>
              </div>
            </div>
          </Card>

          {/* 2025 - Youth Program */}
          <Card 
            ref={(el) => { galleryRefs.current[2025] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/2024-youth-program.jpg" 
                alt="2025年 次世代育成プログラム" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">2025年</p>
                <h3 className="text-xl font-bold">次世代への継承</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => shareToFacebook('/images/gallery/2024-youth-program.jpg', '次世代への継承')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Facebookでシェア"><FaFacebookF className="text-sm" /></button>
                <button onClick={() => shareToTwitter('/images/gallery/2024-youth-program.jpg', '次世代への継承')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Xでシェア"><FaTwitter className="text-sm" /></button>
                <button onClick={() => shareToLine('/images/gallery/2024-youth-program.jpg', '次世代への継承')} className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="LINEでシェア"><FaLine className="text-sm" /></button>
              </div>
            </div>
          </Card>

          {/* 2030 - AI Future */}
          <Card 
            ref={(el) => { galleryRefs.current[2030] = el; }}
            className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white/90 backdrop-blur-sm border-2 border-[#F8BBD0]/30 group"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src="/images/gallery/2030-ai-future-vision.jpg" 
                alt="2030年 AI時代到来と未来" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="text-sm font-semibold mb-1 text-[#FFB7C5]">2030年</p>
                <h3 className="text-xl font-bold">AI時代到来と未来</h3>
              </div>
              {/* SNS Share Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => shareToFacebook('/images/gallery/2030-ai-future-vision.jpg', 'AI時代到来と未来')} className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Facebookでシェア"><FaFacebookF className="text-sm" /></button>
                <button onClick={() => shareToTwitter('/images/gallery/2030-ai-future-vision.jpg', 'AI時代到来と未来')} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="Xでシェア"><FaTwitter className="text-sm" /></button>
                <button onClick={() => shareToLine('/images/gallery/2030-ai-future-vision.jpg', 'AI時代到来と未来')} className="w-10 h-10 rounded-full bg-[#00B900] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg" aria-label="LINEでシェア"><FaLine className="text-sm" /></button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* RSVP Section - Premium CTA */}
      <section className="container py-20 md:py-28 bg-gradient-to-b from-transparent via-[#FFF8F0]/50 to-transparent">
        <div className="max-w-3xl mx-auto">
          <Card className="p-12 md:p-16 bg-gradient-to-br from-[#FFB7C5]/10 via-white to-[#F8BBD0]/10 backdrop-blur-sm shadow-2xl border-2 border-[#E8B4B8]/50 text-left relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#FFB7C5]/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#F8BBD0]/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#C48B9F] to-[#E8B4B8] font-serif">
                回答フォーム
              </h2>
              
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8B4B8]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
                <div className="h-px w-24 bg-[#E8B4B8]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8B4B8]" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8B4B8]" />
              </div>
              
              <p className="text-2xl mb-6 font-semibold text-[#C48B9F]">
                2026年4月10日までにご返信をお願いいたします
              </p>
              
              <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-xl mx-auto">
                この度はお会いできますことを心より楽しみにしております。<br />
                お手数をおかけいたしますが、下記ボタンより回答フォームへのご回答をお願い申し上げます。
              </p>
              
              <Link href="/events/30th-anniversary/rsvp">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#C48B9F] to-[#E8B4B8] hover:from-[#B07A8E] hover:to-[#D6A3A7] text-white px-12 py-7 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border-2 border-white/50"
                >
                  回答フォームへ進む
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Bottom Spacing */}
      <div className="h-16" />
    </div>
  );
}
