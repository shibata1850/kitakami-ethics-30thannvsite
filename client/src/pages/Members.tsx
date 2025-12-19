import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Heart } from "lucide-react";

export default function Members() {
  const memberCompanies = [
    { name: "株式会社〇〇製作所", industry: "製造業", representative: "代表取締役 〇〇 〇〇" },
    { name: "〇〇建設株式会社", industry: "建設業", representative: "代表取締役 〇〇 〇〇" },
    { name: "株式会社〇〇商事", industry: "卸売業", representative: "代表取締役 〇〇 〇〇" },
    { name: "〇〇クリニック", industry: "医療", representative: "院長 〇〇 〇〇" },
    { name: "株式会社〇〇サービス", industry: "サービス業", representative: "代表取締役 〇〇 〇〇" },
    { name: "〇〇税理士事務所", industry: "士業", representative: "所長 〇〇 〇〇" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
              会員紹介
            </h1>
            <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto">
              北上市倫理法人会には、様々な業種の経営者が集まっています。
              業種を超えた交流が、新たなビジネスチャンスや学びを生み出しています。
            </p>
          </div>
        </section>

        {/* 会員の特徴 */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              会員の特徴
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">多様な業種</h3>
                  <p className="text-gray-600">
                    製造業、建設業、サービス業、医療・福祉など、幅広い業種の経営者が参加
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">経営者同士の絆</h3>
                  <p className="text-gray-600">
                    朝の学びと交流を通じて、経営者同士の深い信頼関係が築かれています
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">地域への貢献</h3>
                  <p className="text-gray-600">
                    清掃活動など、地域社会への貢献活動にも積極的に取り組んでいます
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 会員企業一覧 */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              会員企業（一部）
            </h2>
            <div className="max-w-5xl mx-auto">
              <p className="text-center text-gray-600 mb-8">
                ※ 掲載許可をいただいた企業様のみ掲載しております
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                {memberCompanies.map((company, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-1 text-gray-900">{company.name}</h3>
                          <p className="text-sm text-pink-600 mb-1">{company.industry}</p>
                          <p className="text-sm text-gray-600">{company.representative}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-gray-600 mt-8">
                その他、約50社の企業が会員として活動しています
              </p>
            </div>
          </div>
        </section>

        {/* 会員の声 */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              会員の声
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 italic">
                    「朝の時間を活用することで、1日のスタートが変わりました。
                    経営者同士の交流も刺激になり、新たな気づきが得られています。」
                  </p>
                  <p className="text-sm text-gray-600">製造業 A社 代表取締役</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 italic">
                    「倫理法人会で学んだことを実践することで、社内の雰囲気が明るくなりました。
                    従業員との関係も良好になり、業績も向上しています。」
                  </p>
                  <p className="text-sm text-gray-600">建設業 B社 代表取締役</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4 italic">
                    「経営の悩みを共有できる仲間ができたことが、何よりの財産です。
                    業種は違っても、経営者としての共通の課題があり、互いに学び合えています。」
                  </p>
                  <p className="text-sm text-gray-600">サービス業 C社 代表取締役</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 入会案内 */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              入会をご検討の方へ
            </h2>
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    北上市倫理法人会では、新しい会員を随時募集しています。
                    まずは経営者モーニングセミナーにゲストとしてご参加いただき、
                    会の雰囲気を体感してください。
                  </p>
                  <div className="bg-pink-50 p-6 rounded-lg mb-6">
                    <h3 className="font-bold text-lg mb-3 text-gray-900">入会条件</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• 北上市内または近郊で事業を営む経営者・役員の方</li>
                      <li>• 倫理法人会の理念に共感いただける方</li>
                      <li>• 継続的に活動に参加できる方</li>
                    </ul>
                  </div>
                  <div className="text-center">
                    <a href="/contact">
                      <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors">
                        まずはゲスト参加を申し込む
                      </button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              一緒に学び、成長しませんか？
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              北上市倫理法人会では、志を同じくする経営者の仲間を募集しています。
              まずはお気軽にゲスト参加してみてください。
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
