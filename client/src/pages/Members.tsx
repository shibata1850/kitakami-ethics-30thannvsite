import { useState } from "react";
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
import { Search, RotateCcw } from "lucide-react";

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
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">読み込み中...</p>
                  </div>
                ) : members.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">
                        該当する会員が見つかりませんでした
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {members.map((member: any) => (
                      <Card
                        key={member.id}
                        className="overflow-hidden border-2 border-dashed border-primary/30 hover:border-primary/60 hover:shadow-lg transition-all duration-300"
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
                                <Badge className="mb-2 bg-primary/90">
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
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
