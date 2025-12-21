import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Heart, Sun, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import EventBanner from "@/components/EventBanner";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Slider */}
        <HeroSlider />

        {/* Next Seminar Info */}
        <section className="py-12 bg-white border-b">
          <div className="container">
            <div className="bg-secondary/30 rounded-2xl p-8 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold">
                  <Sun className="h-5 w-5" />
                  <span>次回の経営者モーニングセミナー</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">毎週火曜日 朝6:00開催</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>㈱南部家敷 本社 研修所八光館（北上市常盤台４丁目１－１２１）</span>
                </div>
              </div>
              <Button asChild className="shrink-0">
                <Link href="/schedule/morning">詳細を見る <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-left mb-16">
              <h2 className="text-3xl font-bold mb-4 text-primary font-serif">倫理法人会とは？</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                倫理法人会は、「心の経営」を学び、実践する人々の集まりです。<br/>
                「企業に倫理を、職場に心を、家庭に愛を」のスローガンの元、生き方や会社のあり方を学んでいます。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="h-2 bg-primary/80"></div>
                <CardContent className="p-8 text-left">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">本質的＆実践的な学び</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    ノウハウ以前に大切な【人としてのあり方】を学び、実践力を身につけられます。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="h-2 bg-chart-2"></div>
                <CardContent className="p-8 text-left">
                  <div className="w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-chart-2" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">多彩で豊富な機会</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    モーニングセミナー以外にも、様々な学び、研修、交流の機会があります。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <div className="h-2 bg-chart-3"></div>
                <CardContent className="p-8 text-left">
                  <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-8 w-8 text-chart-3" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">人生の幅が広がる</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    経営者以外にも多様な職種の方が在籍。共に学ぶ仲間として親交を深められます。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-left mb-12">
              <h2 className="text-3xl font-bold mb-4 text-primary font-serif">動画で知る倫理法人会</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                実際の活動の様子や、会員様の生の声をご覧ください。<br/>
                倫理法人会での学びが、どのように経営や人生に活かされているかをご紹介します。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Introduction Video */}
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/FcV9-7gMdCo" 
                    title="経営者モーニングセミナー紹介動画" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-2">
                  <h3 className="text-xl font-bold mb-2">120秒でわかる！経営者モーニングセミナー</h3>
                  <p className="text-muted-foreground">
                    週に一度の朝活「経営者モーニングセミナー」の魅力を短時間でご紹介します。
                    経営者としての自己革新の場がここにあります。
                  </p>
                </div>
              </div>

              {/* Interview Video */}
              <div className="space-y-4">
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/EwsPu_hWWkA" 
                    title="会員インタビュー動画" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-2">
                  <h3 className="text-xl font-bold mb-2">会員インタビュー：倫理での学びと実践</h3>
                  <p className="text-muted-foreground">
                    実際に倫理法人会で学び、実践している経営者の生の声をお届けします。
                    入会のきっかけや、倫理指導を通じた変化について語っていただきました。
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 text-left">
              <h3 className="text-2xl font-bold mb-6 text-primary font-serif">倫理法人会に参加する</h3>
              <Button asChild size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-full animate-pulse hover:animate-none transition-all duration-300 transform hover:scale-105">
                <Link href="/contact">ゲスト参加を申し込む</Link>
              </Button>
              <p className="mt-4 text-sm text-muted-foreground">
                ※無理な勧誘は一切ございません。安心してお越しください。
              </p>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-left font-serif">主な活動内容</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "経営者モーニングセミナー", color: "bg-yellow-500", desc: "朝は経営者のゴールデンタイム！週に一度の朝活で自己革新。", image: "/images/seminar_lecture.png" },
                { title: "経営者のつどい", color: "bg-blue-500", desc: "夕方に開催されるセミナー。経営体験報告などを通じて学びます。", image: "/images/networking_event.png" },
                { title: "活力朝礼", color: "bg-orange-500", desc: "朝から元気な職場づくり。「職場の教養」を用いた朝礼を推進。", image: "/images/morning_assembly.png" },
                { title: "富士研", color: "bg-cyan-500", desc: "富士山麓での宿泊研修。日常を離れ、自己を見つめ直す時間。", image: null },
                { title: "倫理指導", color: "bg-purple-500", desc: "経営や家庭の悩みを、倫理の観点から個別相談できます。", image: null },
                { title: "清掃活動", color: "bg-green-500", desc: "地域社会への貢献として、定期的な清掃活動を行っています。", image: "/images/cleaning_activity.png" },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border group flex flex-col h-full">
                  <div className={`h-3 ${item.color}`}></div>
                  {item.image ? (
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">画像準備中</span>
                    </div>
                  )}
                  <div className="p-6 flex-grow">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
          <div className="container relative z-10 text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">まずはゲストとして参加してみませんか？</h2>
            <p className="text-xl mb-10 opacity-90">
              モーニングセミナーは無料で見学いただけます。<br/>
              活気ある朝の雰囲気をぜひ体験してください。
            </p>
            <Button asChild size="lg" variant="secondary" className="text-primary font-bold text-lg px-10 py-6 shadow-xl">
              <Link href="/contact">お申し込み・お問い合わせ</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* 30th Anniversary Event Banner */}
      <EventBanner />
    </div>
  );
}
