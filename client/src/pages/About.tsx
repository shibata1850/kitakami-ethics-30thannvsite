import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, TrendingUp, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
              倫理法人会とは
            </h1>
            <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto">
              一般社団法人倫理研究所が主催する、経営者のための自己啓発団体です。
              「純粋倫理」を学び、実践することで、企業の繁栄と社会の発展に貢献します。
            </p>
          </div>
        </section>

        {/* 倫理法人会の理念 */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              倫理法人会の理念
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card className="border-pink-200">
                <CardContent className="p-8">
                  <p className="text-lg leading-relaxed text-gray-700 mb-6">
                    倫理法人会は、「企業に倫理を、職場に心を、家庭に愛を」をスローガンに、
                    経営者の自己革新を通じて、企業の健全な発展と社会の繁栄に寄与することを目的としています。
                  </p>
                  <p className="text-lg leading-relaxed text-gray-700">
                    「万人幸福の栞」を学びの指針とし、朝の時間を活用した経営者モーニングセミナーや、
                    会員同士の交流を通じて、実践的な倫理経営を学んでいます。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4つの特徴 */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              倫理法人会の4つの特徴
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">純粋倫理</h3>
                  <p className="text-gray-600">
                    宗教・思想・政治に偏らない、普遍的な生活法則を学びます
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">朝の学び</h3>
                  <p className="text-gray-600">
                    毎週火曜日の朝6時から、経営者モーニングセミナーを開催
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">実践重視</h3>
                  <p className="text-gray-600">
                    学んだことを日々の経営に活かし、具体的な成果を目指します
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">万人幸福の栞</h3>
                  <p className="text-gray-600">
                    17条からなる生活指針を学び、人生の羅針盤とします
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 活動内容 */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              主な活動内容
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">経営者モーニングセミナー</h3>
                  <p className="text-gray-700">
                    毎週火曜日の朝6:00〜7:00に開催。経営者や各界の専門家を講師に迎え、
                    実践的な経営哲学や人生観を学びます。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">経営者のつどい</h3>
                  <p className="text-gray-700">
                    月に一度、会員同士の親睦を深める交流会を開催。
                    経営の悩みを共有し、互いに学び合う場です。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">活力朝礼</h3>
                  <p className="text-gray-700">
                    職場に活力と一体感を生み出す朝礼の実践。
                    従業員のモチベーション向上と組織の活性化を図ります。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">清掃活動</h3>
                  <p className="text-gray-700">
                    地域社会への貢献として、定期的に清掃活動を実施。
                    感謝の心と奉仕の精神を実践します。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              まずはゲストとして参加してみませんか？
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              経営者モーニングセミナーは、どなたでもゲストとして参加いただけます。
              無理な勧誘は一切ございませんので、お気軽にお申し込みください。
            </p>
            <a href="/contact">
              <button className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                ゲスト参加を申し込む
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
