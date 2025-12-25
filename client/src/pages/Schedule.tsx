import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Users, Tag, Loader2, Info, User, CheckCircle, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Base44 Event type with all fields
interface Base44Event {
  id: string;
  event_type?: string;
  title?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  venue_address?: string;
  manager_user_id?: string;
  speaker_id?: string;
  status?: string;
  rejection_reason?: string;
  approver_user_id?: string;
  approved_at?: string;
  tags?: string[];
  description?: string;
  committee_id?: string;
  created_date?: string;
}

export default function Schedule() {
  const { data: base44Events = [], isLoading: eventsLoading, error: eventsError } = trpc.base44Events.upcoming.useQuery();
  const [selectedEvent, setSelectedEvent] = useState<Base44Event | null>(null);

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "未定";
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatDateTime = (dateStr: string | undefined) => {
    if (!dateStr) return "未定";
    return new Date(dateStr).toLocaleString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
                href="#event-list"
                className="inline-flex items-center px-6 py-3 bg-white border-2 border-pink-300 text-pink-700 font-semibold rounded-lg hover:bg-pink-50 transition-colors"
              >
                イベント一覧
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

              <Card className="border-pink-200 hover:shadow-lg transition-shadow">
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

        {/* Base44 イベント一覧 */}
        <section id="event-list" className="py-16 bg-white scroll-mt-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
              イベント一覧
            </h2>
            <p className="text-center text-gray-600 mb-12">
              倫理法人会の各種イベント・行事をご案内します
            </p>
            <div className="max-w-4xl mx-auto space-y-6">
              {eventsLoading ? (
                <Card>
                  <CardContent className="p-12 text-center text-gray-500">
                    <Loader2 className="mx-auto h-12 w-12 text-pink-400 mb-4 animate-spin" />
                    <p>イベント情報を読み込み中...</p>
                  </CardContent>
                </Card>
              ) : eventsError ? (
                <Card>
                  <CardContent className="p-12 text-center text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>イベント情報の取得に失敗しました</p>
                    <p className="text-sm mt-2">しばらくしてから再度お試しください</p>
                  </CardContent>
                </Card>
              ) : base44Events.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center text-gray-500">
                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>現在、予定されているイベントはありません。</p>
                    <p className="text-sm mt-2">最新情報は随時更新されます。</p>
                  </CardContent>
                </Card>
              ) : (
                (base44Events as Base44Event[]).map((event) => (
                  <Card
                    key={event.id}
                    className="hover:shadow-lg transition-shadow border-pink-200 cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          {/* イベントタイプバッジ */}
                          {event.event_type && (
                            <span className="inline-block px-3 py-1 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full mb-3">
                              {event.event_type}
                            </span>
                          )}

                          {/* タイトル */}
                          <h3 className="text-xl font-bold mb-3 text-gray-900">
                            {event.title || "イベント"}
                          </h3>

                          {/* 日時 */}
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-pink-600" />
                            <span className="font-bold text-lg text-gray-900">
                              {formatDate(event.event_date)}
                            </span>
                            {(event.start_time || event.end_time) && (
                              <>
                                <Clock className="w-5 h-5 text-pink-600 ml-4" />
                                <span className="text-gray-700">
                                  {event.start_time || ""}
                                  {event.start_time && event.end_time && " 〜 "}
                                  {event.end_time || ""}
                                </span>
                              </>
                            )}
                          </div>

                          {/* 会場 */}
                          {(event.venue || event.venue_address) && (
                            <div className="flex items-start gap-2 mt-2">
                              <MapPin className="w-4 h-4 text-pink-600 mt-1" />
                              <div>
                                {event.venue && (
                                  <span className="text-sm text-gray-700">{event.venue}</span>
                                )}
                                {event.venue_address && (
                                  <p className="text-xs text-gray-500">{event.venue_address}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 詳細を見るテキスト */}
                          <p className="text-sm text-pink-600 mt-3 flex items-center gap-1">
                            <Info className="w-4 h-4" />
                            クリックして詳細を表示
                          </p>
                        </div>

                        {/* 参加申込ボタン */}
                        <div className="flex-shrink-0">
                          <a href="/contact" onClick={(e) => e.stopPropagation()}>
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
        <section className="py-16 bg-gray-50">
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
            <h2 className="text-3xl font-bold mb-6 text-white">
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

      {/* イベント詳細ダイアログ */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-pink-700 flex items-center gap-2">
              {selectedEvent?.event_type && (
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full">
                  {selectedEvent.event_type}
                </span>
              )}
              {selectedEvent?.title || "イベント詳細"}
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-6 mt-4">
              {/* 基本情報 */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-pink-200 pb-2">基本情報</h3>

                {/* 開催日時 */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-pink-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900">開催日</p>
                    <p className="text-gray-700">{formatDate(selectedEvent.event_date)}</p>
                  </div>
                </div>

                {/* 時間 */}
                {(selectedEvent.start_time || selectedEvent.end_time) && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">時間</p>
                      <p className="text-gray-700">
                        {selectedEvent.start_time || ""}
                        {selectedEvent.start_time && selectedEvent.end_time && " 〜 "}
                        {selectedEvent.end_time || ""}
                      </p>
                    </div>
                  </div>
                )}

                {/* 会場 */}
                {(selectedEvent.venue || selectedEvent.venue_address) && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">会場</p>
                      {selectedEvent.venue && <p className="text-gray-700">{selectedEvent.venue}</p>}
                      {selectedEvent.venue_address && (
                        <p className="text-sm text-gray-500">{selectedEvent.venue_address}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 説明 */}
                {selectedEvent.description && (
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">説明</p>
                      <p className="text-gray-700 whitespace-pre-line">{selectedEvent.description}</p>
                    </div>
                  </div>
                )}

                {/* タグ */}
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">タグ</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedEvent.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-sm px-3 py-1 bg-pink-50 text-pink-700 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 追加情報 */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 border-b border-pink-200 pb-2">追加情報</h3>

                {/* ステータス */}
                {selectedEvent.status && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">ステータス</p>
                      <p className="text-gray-700">{selectedEvent.status}</p>
                    </div>
                  </div>
                )}

                {/* 担当者ID */}
                {selectedEvent.manager_user_id && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">担当者ID</p>
                      <p className="text-gray-700">{selectedEvent.manager_user_id}</p>
                    </div>
                  </div>
                )}

                {/* 講師ID */}
                {selectedEvent.speaker_id && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">講師ID</p>
                      <p className="text-gray-700">{selectedEvent.speaker_id}</p>
                    </div>
                  </div>
                )}

                {/* 委員会ID */}
                {selectedEvent.committee_id && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">委員会ID</p>
                      <p className="text-gray-700">{selectedEvent.committee_id}</p>
                    </div>
                  </div>
                )}

                {/* 承認者ID */}
                {selectedEvent.approver_user_id && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">承認者ID</p>
                      <p className="text-gray-700">{selectedEvent.approver_user_id}</p>
                    </div>
                  </div>
                )}

                {/* 承認日時 */}
                {selectedEvent.approved_at && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">承認日時</p>
                      <p className="text-gray-700">{formatDateTime(selectedEvent.approved_at)}</p>
                    </div>
                  </div>
                )}

                {/* 却下理由 */}
                {selectedEvent.rejection_reason && (
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-gray-900">却下理由</p>
                      <p className="text-red-600">{selectedEvent.rejection_reason}</p>
                    </div>
                  </div>
                )}

                {/* イベントID */}
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-500">イベントID</p>
                    <p className="text-gray-400 text-sm">{selectedEvent.id}</p>
                  </div>
                </div>
              </div>

              {/* 参加申込ボタン */}
              <div className="pt-4 border-t border-gray-200">
                <a href="/contact">
                  <button className="w-full bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-bold">
                    参加申込はこちら
                  </button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
