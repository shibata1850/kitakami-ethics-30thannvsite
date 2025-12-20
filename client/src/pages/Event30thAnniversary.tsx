import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FaCalendar, FaClock, FaMapMarkerAlt, FaPhone, FaGlobe, FaDollarSign } from "react-icons/fa";

export default function Event30thAnniversary() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sakura-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-sakura-pattern flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white px-4">
          <img 
            src="/rinri30th-2.jpg" 
            alt="30周年記念ロゴ" 
            className="w-64 h-64 mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            北上市倫理法人会設立30周年記念式典・懇親会
          </h1>
        </div>
      </section>

      {/* Message Section */}
      <section className="container py-16">
        <Card className="p-8 md:p-12 bg-white shadow-lg">
          <div className="prose prose-lg max-w-none">
            <p className="text-right mb-8">謹啓</p>
            
            <p className="mb-6">
              早春の候　時下ますますご清栄のこととお喜び申し上げます。
            </p>
            
            <p className="mb-6">
              平素は格別のお引き立てを賜り深謝申し上げます。
            </p>
            
            <p className="mb-6">
              さて北上市倫理法人会は、令和8年度をもちまして設立30周年を迎えることとなりました。
            </p>
            
            <p className="mb-6">
              これもひとえに皆様方のご支援ご鞭撻の賜物と深く感謝いたしております。
            </p>
            
            <p className="mb-6">
              つきましては北上市倫理法人会会員および岩手県内の倫友の皆様と30年の振り返りとこれからの発展を祈念して、
            </p>
            
            <p className="mb-6">
              設立30周年記念式典・懇親会を催したいと存じます。
            </p>
            
            <p className="mb-6">
              皆様におかれましてはご多忙のところ誠に恐縮ではございますが、何卒ご来駕賜りますようご案内申し上げます。
            </p>
            
            <p className="text-right mb-8">謹白</p>
            
            <p className="text-right mb-2">令和8年3月</p>
            <p className="text-right font-bold">北上市倫理法人会　会長　伊藤正治</p>
          </div>
        </Card>
      </section>

      {/* Event Details Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-sakura-600">
          イベント詳細
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Date & Time */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <FaCalendar className="text-sakura-500 text-2xl mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">日時</h3>
                <p className="text-gray-700">2026年4月19日（日）</p>
                <p className="text-gray-700">15:00 - 19:00</p>
                <p className="text-sm text-gray-500 mt-1">受付時間: 14:30 -</p>
              </div>
            </div>
          </Card>

          {/* Venue */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-sakura-500 text-2xl mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">会場</h3>
                <p className="font-semibold text-gray-800">ブランニュー北上</p>
                <p className="text-gray-700">岩手県北上市大通り1丁目10-1</p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <FaPhone className="text-sakura-500 text-2xl mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">お問い合わせ</h3>
                <p className="text-gray-700">0197-72-7075</p>
              </div>
            </div>
          </Card>

          {/* Fee */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <FaDollarSign className="text-sakura-500 text-2xl mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">会費</h3>
                <p className="text-2xl font-bold text-sakura-600">10,000円</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Website Link */}
        <Card className="p-6 hover:shadow-lg transition-shadow max-w-4xl mx-auto mt-8">
          <div className="flex items-start gap-4">
            <FaGlobe className="text-sakura-500 text-2xl mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">会場ウェブサイト</h3>
              <a 
                href="https://www.brandnew-k.com/index.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sakura-600 hover:text-sakura-700 underline"
              >
                https://www.brandnew-k.com/index.html
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* Access Section */}
      <section className="container py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-8 text-sakura-600">
          会場へのアクセス
        </h2>
        <Card className="p-8 max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed">
            ブランニュー北上は、JR北上駅西口から徒歩３分の距離にございます。<br />
            お車でお越しの際は、当館裏手に専用駐車場（50台）がございますのでそちらをご利用下さいませ。
          </p>
          <div className="mt-6">
            <a
              href="https://www.google.com/maps/search/?api=1&query=岩手県北上市大通り1丁目10-1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button variant="outline" className="gap-2">
                <FaMapMarkerAlt className="text-lg" />
                GoogleMapで見る
              </Button>
            </a>
          </div>
        </Card>
      </section>

      {/* RSVP Section */}
      <section className="container py-16">
        <Card className="p-8 md:p-12 bg-sakura-50 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-sakura-600">
            回答フォーム
          </h2>
          <p className="text-lg mb-4">
            2026年4月10日までにご返信をお願いいたします
          </p>
          <p className="text-gray-600 mb-8">
            この度はお会いできますことを心より楽しみにしております。<br />
            お手数をおかけいたしますが、下記ボタンより回答フォームへのご回答をお願い申し上げます。
          </p>
          <Link href="/events/30th-anniversary/rsvp">
            <Button size="lg" className="bg-sakura-500 hover:bg-sakura-600 text-white px-8 py-6 text-lg">
              回答フォームへ
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
