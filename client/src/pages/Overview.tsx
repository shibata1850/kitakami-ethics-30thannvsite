import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Users, Calendar, Building } from "lucide-react";

export default function Overview() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-left md:text-center mb-6 text-gray-900">
              北上市倫理法人会概要
            </h1>
            <p className="text-lg text-left md:text-center text-gray-700 max-w-3xl mx-auto">
              岩手県北上市を拠点に、経営者の自己革新と企業の健全な発展を支援しています。
            </p>
          </div>
        </section>

        {/* 基本情報 */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-left md:text-center mb-12 text-gray-900">
              基本情報
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card className="border-pink-200">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <Building className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">名称</p>
                      <p className="text-gray-700">一般社団法人倫理研究所 北上市倫理法人会</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Calendar className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">設立</p>
                      <p className="text-gray-700">1985年（昭和60年）</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">会員数</p>
                      <p className="text-gray-700">約50社（2025年12月現在）</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">活動拠点</p>
                      <p className="text-gray-700">㈱南部家敷 本社 研修所八光館</p>
                      <p className="text-sm text-gray-600 mt-1">〒024-0012 岩手県北上市常盤台４丁目１－１２１</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">お問い合わせ</p>
                      <p className="text-gray-700">お問い合わせフォームよりご連絡ください</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">メールでのお問い合わせ</p>
                      <a href="/contact" className="text-pink-600 hover:text-pink-700 underline">
                        お問い合わせフォームへ
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 活動内容 */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-left md:text-center mb-12 text-gray-900">
              主な活動内容
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-pink-700">経営者モーニングセミナー</h3>
                  <p className="text-gray-700 mb-2">毎週火曜日 朝6:00〜7:00</p>
                  <p className="text-gray-600 text-sm">
                    経営者や各界の専門家を講師に迎え、実践的な経営哲学を学びます
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-pink-700">経営者のつどい</h3>
                  <p className="text-gray-700 mb-2">月1回（第3火曜日）18:30〜20:30</p>
                  <p className="text-gray-600 text-sm">
                    会員同士の親睦を深め、経営課題を共有する交流会
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-pink-700">活力朝礼</h3>
                  <p className="text-gray-700 mb-2">各企業で実施</p>
                  <p className="text-gray-600 text-sm">
                    職場に活力と一体感を生み出す朝礼の実践指導
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-pink-700">清掃活動</h3>
                  <p className="text-gray-700 mb-2">定期開催</p>
                  <p className="text-gray-600 text-sm">
                    地域社会への貢献として、公共施設や道路の清掃を実施
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 会員企業の業種 */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-left md:text-center mb-12 text-gray-900">
              会員企業の業種
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-4 text-left md:text-center">
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <p className="font-bold text-gray-900">製造業</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <p className="font-bold text-gray-900">建設業</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <p className="font-bold text-gray-900">卸売・小売業</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <p className="font-bold text-gray-900">サービス業</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <p className="font-bold text-gray-900">医療・福祉</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <p className="font-bold text-gray-900">その他</p>
                    </div>
                  </div>
                  <p className="text-left md:text-center text-gray-600 mt-6">
                    様々な業種の経営者が集まり、業種を超えた交流が生まれています
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 地図 */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-left md:text-center mb-12 text-gray-900">
              アクセス
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">㈱南部家敷 本社 研修所八光館</h3>
                    <p className="text-gray-700 mb-1">〒024-0012 岩手県北上市常盤台４丁目１－１２１</p>
                    <p className="text-gray-600 text-sm">JR北上駅より車で約10分</p>
                  </div>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Googleマップ（実装予定）</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <div className="container text-left md:text-center">
            <h2 className="text-3xl font-bold mb-6">
              ご不明な点はお気軽にお問い合わせください
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              北上市倫理法人会へのご質問、ゲスト参加のお申し込みなど、
              お気軽にお問い合わせください。
            </p>
            <a href="/contact">
              <button className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                お問い合わせ
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
