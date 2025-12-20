import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const slides = [
  {
    id: 1,
    type: "default" as const,
    badge: "一般社団法人倫理研究所 北上市倫理法人会",
    title: (
      <>
        <span className="block text-primary mb-2 font-serif">「心の経営」</span>
        を学び、実践する
      </>
    ),
    subtitle: (
      <>
        家庭・企業・地域・日本の活路を拓く<br/>
        全国約7万社の経営者の会へようこそ
      </>
    ),
    buttons: [
      { text: "モーニングセミナーに参加する", href: "/schedule#morning-seminar", variant: "default" as const },
      { text: "倫理法人会について", href: "/about", variant: "outline" as const },
    ],
  },
  {
    id: 2,
    type: "anniversary" as const,
    logo: "/images/rinri30th.png",
    catchphrase: "北上の地に根を張り、倫理（こころ）の花を咲かせて",
    buttons: [
      { text: "30周年式典・懇親会のご案内", href: "/events/30th-anniversary", variant: "default" as const },
    ],
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-sakura-pattern">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/seminar_lecture.png" 
          alt="経営者モーニングセミナーの様子" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/60 z-10"></div>
      
      {/* Decorative Sakura Elements (CSS generated) */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse z-10"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000 z-10"></div>
      
      {/* Slide Content */}
      <div className="container relative z-20 text-center">
        <div
          key={slide.id}
          className="animate-in fade-in duration-500"
        >
          {slide.type === "default" ? (
            <>
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1 text-base">
                {slide.badge}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-foreground">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                {slide.subtitle}
              </p>
            </>
          ) : (
            <>
              <div className="mb-8 flex justify-center">
                <img 
                  src={slide.logo} 
                  alt="北上市倫理法人会設立30周年記念ロゴ" 
                  className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
                />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-10 tracking-tight text-primary font-serif leading-relaxed">
                {slide.catchphrase}
              </h1>
            </>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {slide.buttons.map((button, index) => (
              <Button 
                key={index}
                asChild 
                size="lg" 
                variant={button.variant}
                className={
                  button.variant === "default"
                    ? "text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                    : "text-lg px-8 py-6 border-primary text-primary hover:bg-primary/5"
                }
              >
                <Link href={button.href}>{button.text}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="前のスライド"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
        aria-label="次のスライド"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`スライド${index + 1}へ移動`}
          />
        ))}
      </div>
    </section>
  );
}
