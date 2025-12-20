import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Search, X } from "lucide-react";

export default function SeminarArchive() {
  const { data: seminars = [], isLoading } = trpc.seminars.past.useQuery();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [speakerFilter, setSpeakerFilter] = useState("");
  const [themeFilter, setThemeFilter] = useState("");

  // Filter seminars based on search criteria
  const filteredSeminars = useMemo(() => {
    return seminars.filter((seminar) => {
      const matchesSearch = !searchQuery || 
        seminar.speaker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seminar.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seminar.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSpeaker = !speakerFilter || 
        seminar.speaker.toLowerCase().includes(speakerFilter.toLowerCase());
      
      const matchesTheme = !themeFilter || 
        seminar.theme.toLowerCase().includes(themeFilter.toLowerCase());
      
      return matchesSearch && matchesSpeaker && matchesTheme;
    });
  }, [seminars, searchQuery, speakerFilter, themeFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setSpeakerFilter("");
    setThemeFilter("");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日(${weekday})`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="container py-20 text-left md:text-center">
          <p className="text-lg text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-100 to-pink-50 py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-left md:text-center">
            セミナーアーカイブ
          </h1>
          <p className="text-lg text-gray-700 text-left md:text-center max-w-2xl mx-auto">
            過去に開催された経営者モーニングセミナーの記録です。
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b border-pink-200">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="講師名、テーマ、会場で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-lg border-pink-200 focus:border-pink-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Additional Filters */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  講師名で絞り込み
                </label>
                <Input
                  type="text"
                  placeholder="講師名を入力..."
                  value={speakerFilter}
                  onChange={(e) => setSpeakerFilter(e.target.value)}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  テーマで絞り込み
                </label>
                <Input
                  type="text"
                  placeholder="テーマを入力..."
                  value={themeFilter}
                  onChange={(e) => setThemeFilter(e.target.value)}
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
            </div>

            {/* Reset Button */}
            {(searchQuery || speakerFilter || themeFilter) && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="border-pink-300 text-pink-700 hover:bg-pink-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  リセット
                </Button>
              </div>
            )}

            {/* Results Count */}
            <div className="text-left md:text-center text-sm text-gray-600">
              {filteredSeminars.length}件のセミナーが見つかりました
            </div>
          </div>
        </div>
      </section>

      {/* Seminars List */}
      <section className="py-12">
        <div className="container">
          {filteredSeminars.length === 0 ? (
            <div className="text-left md:text-center py-12">
              <p className="text-lg text-gray-600">
                {seminars.length === 0
                  ? "まだ過去のセミナーがありません"
                  : "検索条件に一致するセミナーが見つかりませんでした"}
              </p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {filteredSeminars.map((seminar) => (
                <Card
                  key={seminar.id}
                  className="p-6 border-2 border-dashed border-pink-200 hover:border-pink-300 transition-colors bg-white"
                >
                  <div className="space-y-4">
                    {/* Date and Time */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-pink-500" />
                        <span className="font-medium">{formatDate(seminar.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-pink-500" />
                        <span>{seminar.time}</span>
                      </div>
                    </div>

                    {/* Theme */}
                    <h3 className="text-xl font-bold text-gray-900">
                      {seminar.theme}
                    </h3>

                    {/* Speaker */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-pink-500" />
                      <span>講師: {seminar.speaker}</span>
                    </div>

                    {/* Venue */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 text-pink-500" />
                      <span>{seminar.venue}</span>
                    </div>

                    {/* Description */}
                    {seminar.description && (
                      <p className="text-gray-700 leading-relaxed pt-2 border-t border-pink-100">
                        {seminar.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
