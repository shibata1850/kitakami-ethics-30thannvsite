import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Tag, ArrowLeft } from "lucide-react";
import { Streamdown } from "streamdown";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blogPosts.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Header />
        <main className="flex-grow py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center py-12 text-muted-foreground">
              読み込み中...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Header />
        <main className="flex-grow py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="border-pink-200">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">記事が見つかりませんでした</p>
                  <Link href="/blog">
                    <Button variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      ブログ一覧に戻る
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* 戻るボタン */}
            <Link href="/blog">
              <Button variant="outline" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ブログ一覧に戻る
              </Button>
            </Link>

            {/* 記事本体 */}
            <Card className="border-pink-200">
              <CardContent className="p-8">
                {/* サムネイル */}
                {post.thumbnailUrl && (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="w-full h-96 object-cover rounded-lg mb-6"
                  />
                )}

                {/* カテゴリーバッジ */}
                <div className="mb-4">
                  <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200">
                    {post.category}
                  </Badge>
                </div>

                {/* タイトル */}
                <h1 className="text-4xl font-bold mb-6 text-gray-900">
                  {post.title}
                </h1>

                {/* メタ情報 */}
                <div className="flex items-center gap-6 mb-8 text-sm text-muted-foreground pb-6 border-b border-pink-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "未公開"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewCount} 閲覧</span>
                  </div>
                </div>

                {/* タグ */}
                {post.tags && (
                  <div className="flex items-center gap-2 mb-6">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-2">
                      {post.tags.split(",").map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-pink-300 text-pink-700">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 本文（Markdown） */}
                <div className="prose prose-lg max-w-none">
                  <Streamdown>{post.content}</Streamdown>
                </div>
              </CardContent>
            </Card>

            {/* 前後の記事ナビゲーション（将来的に実装） */}
            <div className="mt-8 flex justify-between">
              <Link href="/blog">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  ブログ一覧に戻る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
