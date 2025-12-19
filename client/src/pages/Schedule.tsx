import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Schedule() {
  const { data: upcomingSeminars = [] } = trpc.seminars.upcoming.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
              スケジュール
            </h1>
            <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-8">
              北上市倫理法人会の活動スケジュールをご案内します。
              経営者モーニングセミナーは毎週火曜日の朝6時から開催しています。
            </p>
            
            {/* 目次（アンカーリンク） */}
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#morning-seminar"
                className="inline-flex items-center px-6 py-3 bg-white border-2 border-pink-300 text-pink-700 font-semibold rounded-lg hover:bg-pink-50 transition-colors"
              >
                モーニングセミナー
              </a>
              <a
                href="#keieisha-tsudoi"
                className="inline-flex items-center px-6 py-3 bg-white border-2 border-pink-300 text-pink-700 font-semibold rounded-lg hover:bg-pink-50 transition-colors"
              >
                経営者のつどい
              </a>
            </div>
          </div>
        </section>

        {/* 定例活動 */}
        <section id="morning-seminar" className="py-16 bg-white scroll-mt-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              定例活動
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-pink-200 hover:shadow-lg transition-shadow">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="text-2xl text-pink-700">
                    経営者モーニングセミナー
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">開催日</p>
                      <p className="text-gray-700">毎週火曜日</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">時間</p>
                      <p className="text-gray-700">朝6:00〜7:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">会場</p>
                      <p className="text-gray-700">㈱南部家敷 本社 研修所八光館</p>
                      <p className="text-sm text-gray-600">北上市常盤台４丁目１－１２１</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">参加費</p>
                      <p className="text-gray-700">会員：無料 / ゲスト：無料</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card id="keieisha-tsudoi" className="border-pink-200 hover:shadow-lg transition-shadow scroll-mt-20">
                <CardHeader className="bg-pink-50">
                  <CardTitle className="text-2xl text-pink-700">
                    経営者のつどい
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">開催日</p>
                      <p className="text-gray-700">月1回（第3火曜日）</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">時間</p>
                      <p className="text-gray-700">18:30〜20:30</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">会場</p>
                      <p className="text-gray-700">市内飲食店（毎回異なります）</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-pink-600 mt-1" />
                    <div>
                      <p className="font-bold text-gray-900">参加費</p>
                      <p className="text-gray-700">実費（3,000円〜5,000円程度）</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 今後の予定 */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              今後の経営者モーニングセミナー予定
            </h2>
            <div className="max-w-4xl mx-auto space-y-6">
              {upcomingSeminars.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>現在、予定されているセミナーはありません。</p>
                    <p className="text-sm mt-2">最新情報は随時更新されます。</p>
                  </CardContent>
                </Card>
              ) : (
                upcomingSeminars.map((seminar: any) => (
                  <Card key={seminar.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-pink-600" />
                            <span className="font-bold text-lg text-gray-900">
                              {new Date(seminar.date).toLocaleDateString("ja-JP", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                weekday: "short",
                              })}
                            </span>
                            <Clock className="w-5 h-5 text-pink-600 ml-4" />
                            <span className="text-gray-700">{seminar.time}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900">{seminar.theme}</h3>
                          <p className="text-gray-600">講師: {seminar.speaker}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <MapPin className="w-4 h-4 text-pink-600" />
                            <span className="text-sm text-gray-600">{seminar.venue}</span>
                          </div>
                          {seminar.description && (
                            <p className="text-sm text-gray-600 mt-2">{seminar.description}</p>
                          )}
                        </div>
                        <div>
                          <a href="/contact">
                            <button className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors whitespace-nowrap">
                              参加申込
                            </button>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 年間行事 */}
        <section className="py-16 bg-white">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              年間行事
            </h2>
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-pink-700">4月</h3>
                      <p className="text-gray-700">新年度キックオフセミナー</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-pink-700">7月</h3>
                      <p className="text-gray-700">夏季特別講演会</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-pink-700">10月</h3>
                      <p className="text-gray-700">岩手県倫理法人会 合同セミナー</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-pink-700">12月</h3>
                      <p className="text-gray-700">年末感謝の集い</p>
                    </div>
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
              ゲストとしてご参加いただけます
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              経営者モーニングセミナーは、どなたでも無料でご参加いただけます。
              お気軽にお申し込みください。
            </p>
            <a href="/contact">
              <button className="bg-white text-pink-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                参加申し込みはこちら
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
