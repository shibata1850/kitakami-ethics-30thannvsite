import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Tag } from "lucide-react";

const CATEGORIES = ["活動報告", "お知らせ", "イベント", "その他"];

export default function Blog() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, isLoading } = trpc.blogPosts.list.useQuery({
    category: filterCategory === "all" ? undefined : filterCategory,
    searchQuery: searchQuery || undefined,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-left mb-6 text-gray-900">
              ブログ・お知らせ
            </h1>
            <p className="text-lg text-left text-gray-700 max-w-3xl mx-auto">
              北上市倫理法人会の最新情報や活動報告をお届けします。
            </p>
          </div>
        </section>

        {/* 検索・絞り込み */}
        <section className="py-8 bg-white border-b">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <Card className="border-pink-200">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>検索</Label>
                      <Input
                        placeholder="タイトル・本文で検索"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>カテゴリー</Label>
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="すべて" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">すべて</SelectItem>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterCategory("all");
                    }}
                  >
                    リセット
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ブログ記事一覧 */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-5xl mx-auto space-y-8">
              {isLoading && (
                <div className="text-left py-12 text-muted-foreground">
                  読み込み中...
                </div>
              )}
              {posts?.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow overflow-hidden border-pink-200 cursor-pointer">
                    <div className="md:flex">
                      {post.thumbnailUrl && (
                        <div className="md:w-1/3">
                          <img 
                            src={post.thumbnailUrl} 
                            alt={post.title}
                            className="w-full h-64 md:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={post.thumbnailUrl ? "md:w-2/3" : "w-full"}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {post.publishedAt 
                                  ? new Date(post.publishedAt).toLocaleDateString("ja-JP")
                                  : "未公開"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.viewCount} 閲覧</span>
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
                          {post.excerpt && (
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                          {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.split(",").map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className="text-pink-600 font-bold hover:text-pink-700 transition-colors">
                            続きを読む →
                          </span>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
              {posts?.length === 0 && !isLoading && (
                <Card className="border-pink-200">
                  <CardContent className="p-12 text-left text-muted-foreground">
                    ブログ記事がありません
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* カテゴリー */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-left mb-12 text-gray-900">
              カテゴリー
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => {
                  const count = posts?.filter((p: any) => p.category === cat).length || 0;
                  return (
                    <Card
                      key={cat}
                      className="text-left hover:shadow-lg transition-shadow cursor-pointer border-pink-200"
                      onClick={() => setFilterCategory(cat)}
                    >
                      <CardContent className="p-4">
                        <p className="font-bold text-gray-900">{cat}</p>
                        <p className="text-sm text-gray-600 mt-1">{count}件</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          <div className="container text-left">
            <h2 className="text-3xl font-bold mb-6">
              活動の様子を実際に体験してみませんか？
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              経営者モーニングセミナーは、どなたでもゲストとして参加いただけます。
              お気軽にお申し込みください。
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-pink-600 font-bold">
                ゲスト参加を申し込む
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
