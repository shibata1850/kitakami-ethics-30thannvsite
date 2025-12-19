import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "会員数",
      value: stats?.memberCount || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "問い合わせ件数",
      value: stats?.contactCount || 0,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
      subtitle: `未対応: ${stats?.pendingContactCount || 0}件`,
    },
    {
      title: "今後のセミナー",
      value: stats?.upcomingSeminarCount || 0,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "ブログ記事数",
      value: stats?.blogPostCount || 0,
      icon: FileText,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ダッシュボード</h1>
        <p className="text-gray-600">
          北上市倫理法人会の管理画面へようこそ
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  {card.subtitle && (
                    <p className="text-xs text-gray-500 mt-2">{card.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 最近の活動 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 今後のセミナー */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              今後のセミナー予定
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.upcomingSeminars && stats.upcomingSeminars.length > 0 ? (
              <div className="space-y-4">
                {stats.upcomingSeminars.map((seminar: any) => (
                  <div
                    key={seminar.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {seminar.theme}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        講師: {seminar.speaker}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(seminar.date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })}{" "}
                        {seminar.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                今後のセミナー予定はありません
              </p>
            )}
          </CardContent>
        </Card>

        {/* 最近のブログ投稿 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-600" />
              最近のブログ投稿
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentBlogPosts && stats.recentBlogPosts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentBlogPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-pink-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {post.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        カテゴリー: {post.category}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status === "published" ? "公開" : "下書き"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                最近のブログ投稿はありません
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 未対応の問い合わせ */}
      {stats?.pendingContacts && stats.pendingContacts.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-600" />
              未対応の問い合わせ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.pendingContacts.map((contact: any) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {contact.email} | {contact.type}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {contact.message}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      未対応
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
