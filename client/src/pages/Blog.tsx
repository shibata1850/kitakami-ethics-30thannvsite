import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, Tag } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "新年特別講演会を開催しました",
      date: "2026年1月10日",
      author: "事務局",
      category: "イベント報告",
      excerpt: "2026年1月6日、新年特別講演会を開催いたしました。多数の会員・ゲストの皆様にご参加いただき、盛会のうちに終了することができました...",
      image: "/images/seminar_lecture.png",
    },
    {
      id: 2,
      title: "年末感謝の集いを開催しました",
      date: "2025年12月20日",
      author: "事務局",
      category: "イベント報告",
      excerpt: "2025年12月17日、年末感謝の集いを開催いたしました。今年1年の活動を振り返り、会員同士の親睦を深める有意義な時間となりました...",
      image: "/images/networking_event.png",
    },
    {
      id: 3,
      title: "清掃活動を実施しました",
      date: "2025年11月25日",
      author: "事務局",
      category: "社会貢献活動",
      excerpt: "11月23日、北上駅周辺の清掃活動を実施しました。会員20名が参加し、地域の美化に貢献することができました...",
      image: "/images/cleaning_activity.png",
    },
    {
      id: 4,
      title: "活力朝礼研修会を開催しました",
      date: "2025年10月15日",
      author: "事務局",
      category: "研修会",
      excerpt: "活力朝礼の実践方法を学ぶ研修会を開催しました。参加企業からは「すぐに実践したい」との声が多数寄せられました...",
      image: "/images/morning_assembly.png",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-900">
              ブログ・お知らせ
            </h1>
            <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto">
              北上市倫理法人会の最新情報や活動報告をお届けします。
            </p>
          </div>
        </section>

        {/* ブログ記事一覧 */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto space-y-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4" />
                            <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900 hover:text-pink-600 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <button className="text-pink-600 font-bold hover:text-pink-700 transition-colors">
                          続きを読む →
                        </button>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* ページネーション */}
            <div className="flex justify-center gap-2 mt-12">
              <button className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors">
                1
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                2
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                3
              </button>
            </div>
          </div>
        </section>

        {/* カテゴリー */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              カテゴリー
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-bold text-gray-900">イベント報告</p>
                    <p className="text-sm text-gray-600 mt-1">12件</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-bold text-gray-900">社会貢献活動</p>
                    <p className="text-sm text-gray-600 mt-1">8件</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-bold text-gray-900">研修会</p>
                    <p className="text-sm text-gray-600 mt-1">6件</p>
                  </CardContent>
                </Card>
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <p className="font-bold text-gray-900">お知らせ</p>
                    <p className="text-sm text-gray-600 mt-1">15件</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              活動の様子を実際に体験してみませんか？
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              経営者モーニングセミナーは、どなたでもゲストとして参加いただけます。
              お気軽にお申し込みください。
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
