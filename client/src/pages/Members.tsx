import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw, Globe, ExternalLink } from "lucide-react";
import { Twitter, Youtube, Instagram } from "lucide-react";
import { getCommitteeColor } from "@/lib/committeeColors";

const CATEGORIES = [
  { value: "専門サービス（士業,保険,デザイン,議員等）", label: "専門サービス（士業,保険,デザイン,議員等）" },
  { value: "飲食・食品", label: "飲食・食品" },
  { value: "建築・不動産", label: "建築・不動産" },
  { value: "美容・健康", label: "美容・健康" },
  { value: "製造・ものづくり", label: "製造・ものづくり" },
  { value: "医療・福祉", label: "医療・福祉" },
  { value: "電気・通信・IT", label: "電気・通信・IT" },
  { value: "小売・販売", label: "小売・販売" },
  { value: "その他", label: "その他" },
  { value: "教育・スクール", label: "教育・スクール" },
  { value: "事業承継", label: "事業承継" },
];

const COMMITTEES = [
  { value: "会員拡大委員会", label: "会員拡大委員会" },
  { value: "活力朝礼委員会", label: "活力朝礼委員会" },
  { value: "広報委員会", label: "広報委員会" },
  { value: "研修委員会", label: "研修委員会" },
  { value: "地域貢献委員会", label: "地域貢献委員会" },
];

export default function Members() {
  const [sortBy, setSortBy] = useState<"random" | "date_desc" | "date_asc">("date_desc");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCommittees, setSelectedCommittees] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    sortBy: "date_desc" as "random" | "date_desc" | "date_asc",
    categories: [] as string[],
    committees: [] as string[],
    searchQuery: "",
  });

  const { data: members = [], isLoading } = trpc.members.list.useQuery(appliedFilters);

  const handleApplyFilters = () => {
    setAppliedFilters({
      sortBy,
      categories: selectedCategories,
      committees: selectedCommittees,
      searchQuery,
    });
  };

  const handleReset = () => {
    setSortBy("date_desc");
    setSelectedCategories([]);
    setSelectedCommittees([]);
    setSearchQuery("");
    setAppliedFilters({
      sortBy: "date_desc",
      categories: [],
      committees: [],
      searchQuery: "",
    });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleCommittee = (committee: string) => {
    setSelectedCommittees((prev) =>
      prev.includes(committee)
        ? prev.filter((c) => c !== committee)
        : [...prev, committee]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="py-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
          <div className="container">
            <h1 className="text-4xl font-bold mb-4 text-primary font-serif">会員紹介</h1>
            <p className="text-lg text-muted-foreground">
              北上市倫理法人会の会員企業をご紹介します
            </p>
          </div>
        </section>

        {/* Members List with Filters */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Sidebar - Filters */}
              <aside className="lg:w-80 shrink-0">
                <div className="sticky top-4 space-y-6 bg-secondary/30 p-6 rounded-xl border border-primary/10">
                  {/* Sort */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg">並び替え</h3>
                    <RadioGroup value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="random" id="random" />
                        <Label htmlFor="random" className="cursor-pointer">ランダム</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="date_desc" id="date_desc" />
                        <Label htmlFor="date_desc" className="cursor-pointer">新しい順</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="date_asc" id="date_asc" />
                        <Label htmlFor="date_asc" className="cursor-pointer">古い順</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg">カテゴリー</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {CATEGORIES.map((cat) => (
                        <div key={cat.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${cat.value}`}
                            checked={selectedCategories.includes(cat.value)}
                            onCheckedChange={() => toggleCategory(cat.value)}
                          />
                          <Label
                            htmlFor={`cat-${cat.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {cat.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Committee Filter */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg">所属委員会</h3>
                    <div className="space-y-2">
                      {COMMITTEES.map((com) => (
                        <div key={com.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`com-${com.value}`}
                            checked={selectedCommittees.includes(com.value)}
                            onCheckedChange={() => toggleCommittee(com.value)}
                          />
                          <Label
                            htmlFor={`com-${com.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {com.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Search */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg">検索</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="会社名・氏名を検索"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleApplyFilters} className="flex-1">
                      絞り込む
                    </Button>
                    <Button onClick={handleReset} variant="outline">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </aside>

              {/* Right Content - Member Cards */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="text-left py-12">
                    <p className="text-muted-foreground">読み込み中...</p>
                  </div>
                ) : members.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-left">
                      <p className="text-muted-foreground">
                        該当する会員が見つかりませんでした
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {members.map((member: any) => (
                      <Link key={member.id} href={`/members/${member.id}`}>
                        <Card
                          className="overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary/60 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        >
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {member.photoUrl && (
                              <div className="shrink-0">
                                <img
                                  src={member.photoUrl}
                                  alt={member.name}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              {member.committee && (
                                <Badge className={`mb-2 ${getCommitteeColor(member.committee)}`}>
                                  {member.committee}
                                </Badge>
                              )}
                              <h3 className="font-bold text-lg mb-1 text-primary">
                                {member.title}
                              </h3>
                              <p className="text-sm font-semibold mb-1">
                                {member.companyName}
                              </p>
                              <p className="text-sm text-muted-foreground mb-3">
                                {member.name}
                              </p>
                              <p className="text-sm text-foreground line-clamp-3">
                                {member.message}
                              </p>
                              <div className="mt-3">
                                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                  {member.category}
                                </span>
                              </div>
                              
                              {/* 提供サービス・商品 */}
                              {member.services && (
                                <div className="mt-3">
                                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">提供サービス・商品</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {member.services.split(',').map((service: string, index: number) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md border border-primary/20"
                                      >
                                        {service.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* SNSリンクと公式ホームページ */}
                              <div className="mt-4 flex flex-wrap items-center gap-2">
                                {member.websiteUrl && (
                                  <a
                                    href={member.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-full transition-colors"
                                  >
                                    <Globe className="h-3.5 w-3.5" />
                                    公式ホームページ
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                
                                {/* SNSアイコン */}
                                <div className="flex items-center gap-2">
                                  {member.twitterUrl && (
                                    <a
                                      href={member.twitterUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center w-8 h-8 bg-black hover:bg-black/80 text-white rounded-full transition-colors"
                                      title="X (Twitter)"
                                    >
                                      <Twitter className="h-4 w-4" />
                                    </a>
                                  )}
                                  
                                  {member.youtubeUrl && (
                                    <a
                                      href={member.youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                                      title="YouTube"
                                    >
                                      <Youtube className="h-4 w-4" />
                                    </a>
                                  )}
                                  
                                  {member.tiktokUrl && (
                                    <a
                                      href={member.tiktokUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center w-8 h-8 bg-black hover:bg-black/80 text-white rounded-full transition-colors"
                                      title="TikTok"
                                    >
                                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                      </svg>
                                    </a>
                                  )}
                                  
                                  {member.instagramUrl && (
                                    <a
                                      href={member.instagramUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 text-white rounded-full transition-opacity"
                                      title="Instagram"
                                    >
                                      <Instagram className="h-4 w-4" />
                                    </a>
                                  )}
                                  
                                  {member.lineUrl && (
                                    <a
                                      href={member.lineUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                                      title="LINE"
                                    >
                                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                                      </svg>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
