import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, User, Search, X, Tag, Loader2 } from "lucide-react";

// Base44 Event type
interface Base44Event {
  id: string;
  event_type?: string;
  title?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  venue_address?: string;
  speaker_id?: string;
  description?: string;
  status?: string;
  tags?: string[];
}

export default function SeminarArchive() {
  const { data: seminars = [], isLoading } = trpc.seminars.past.useQuery();
  const { data: base44Events = [], isLoading: eventsLoading } = trpc.base44Events.past.useQuery();
  
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

  // Filter Base44 events based on search criteria
  const filteredBase44Events = useMemo(() => {
    return (base44Events as Base44Event[]).filter((event) => {
      const title = event.title || "";
      const venue = event.venue || "";
      const description = event.description || "";
      const eventType = event.event_type || "";

      const matchesSearch = !searchQuery ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eventType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTheme = !themeFilter ||
        title.toLowerCase().includes(themeFilter.toLowerCase()) ||
        eventType.toLowerCase().includes(themeFilter.toLowerCase());

      // speakerFilter is not applicable for Base44 events (no speaker field directly)
      // but we can skip it if no speaker filter is set
      const matchesSpeaker = !speakerFilter;

      return matchesSearch && matchesSpeaker && matchesTheme;
    });
  }, [base44Events, searchQuery, speakerFilter, themeFilter]);

  const totalResults = filteredSeminars.length + filteredBase44Events.length;

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

  if (isLoading && eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <div className="container py-20 text-center">
          <Loader2 className="mx-auto h-12 w-12 text-pink-400 mb-4 animate-spin" />
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-left">
            セミナーアーカイブ
          </h1>
          <p className="text-lg text-gray-700 text-left max-w-2xl mx-auto">
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
            <div className="text-left text-sm text-gray-600">
              {totalResults}件のアーカイブが見つかりました
              {filteredSeminars.length > 0 && filteredBase44Events.length > 0 && (
                <span className="ml-2 text-gray-400">
                  （セミナー: {filteredSeminars.length}件 / イベント: {filteredBase44Events.length}件）
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Seminars List */}
      {filteredSeminars.length > 0 && (
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="h-6 w-6 text-pink-500" />
                経営者モーニングセミナー
              </h2>
              <div className="space-y-6">
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
            </div>
          </div>
        </section>
      )}

      {/* Base44 Events List */}
      {filteredBase44Events.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-pink-500" />
                過去のイベント
              </h2>
              <div className="space-y-6">
                {filteredBase44Events.map((event) => (
                  <Card
                    key={event.id}
                    className="p-6 border-2 border-dashed border-pink-200 hover:border-pink-300 transition-colors bg-white"
                  >
                    <div className="space-y-4">
                      {/* Event Type Badge */}
                      {event.event_type && (
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-pink-100 text-pink-700 rounded-full">
                          {event.event_type}
                        </span>
                      )}

                      {/* Date and Time */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-pink-500" />
                          <span className="font-medium">
                            {event.event_date
                              ? formatDate(event.event_date)
                              : "日程未定"}
                          </span>
                        </div>
                        {(event.start_time || event.end_time) && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-pink-500" />
                            <span>
                              {event.start_time || ""}
                              {event.start_time && event.end_time && " 〜 "}
                              {event.end_time || ""}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900">
                        {event.title || "イベント"}
                      </h3>

                      {/* Venue */}
                      {(event.venue || event.venue_address) && (
                        <div className="flex items-start gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-pink-500 mt-0.5" />
                          <div>
                            {event.venue && <span>{event.venue}</span>}
                            {event.venue_address && (
                              <p className="text-xs text-gray-500">{event.venue_address}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {event.description && (
                        <p className="text-gray-700 leading-relaxed pt-2 border-t border-pink-100 whitespace-pre-line">
                          {event.description}
                        </p>
                      )}

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap pt-2">
                          <Tag className="h-4 w-4 text-gray-400" />
                          {event.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {totalResults === 0 && (
        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg text-gray-600">
                {seminars.length === 0 && base44Events.length === 0
                  ? "まだ過去のアーカイブがありません"
                  : "検索条件に一致するアーカイブが見つかりませんでした"}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
