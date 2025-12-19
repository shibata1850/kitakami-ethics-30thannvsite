import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaInstagram,
  FaLine,
} from "react-icons/fa";

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: member, isLoading } = trpc.members.getById.useQuery(
    { id: parseInt(id || "0") }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-lg text-muted-foreground">
          会員が見つかりませんでした
        </div>
        <Button onClick={() => setLocation("/members")} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          会員一覧に戻る
        </Button>
      </div>
    );
  }

  const socialLinks = [
    {
      url: member.twitterUrl,
      icon: FaTwitter,
      label: "X (Twitter)",
      color: "#000000",
    },
    {
      url: member.youtubeUrl,
      icon: FaYoutube,
      label: "YouTube",
      color: "#FF0000",
    },
    {
      url: member.tiktokUrl,
      icon: FaTiktok,
      label: "TikTok",
      color: "#000000",
    },
    {
      url: member.instagramUrl,
      icon: FaInstagram,
      label: "Instagram",
      color: "#E4405F",
    },
    { url: member.lineUrl, icon: FaLine, label: "LINE", color: "#00B900" },
  ].filter((link) => link.url);

  const services = member.services
    ? member.services.split(",").map((s) => s.trim())
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* ヘッダー */}
      <div className="bg-background border-b">
        <div className="container py-6">
          <Button
            onClick={() => setLocation("/members")}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            会員一覧に戻る
          </Button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* 会員情報カード */}
          <div className="bg-background rounded-2xl shadow-lg overflow-hidden border">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* 写真 */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-md">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-4xl text-primary/40">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 基本情報 */}
                <div className="flex-1 min-w-0">
                  {/* 委員会バッジ */}
                  {member.committee && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        {member.committee}
                      </span>
                    </div>
                  )}

                  {/* 会社名 */}
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {member.companyName}
                  </h1>

                  {/* 名前 */}
                  <p className="text-xl text-muted-foreground mb-4">
                    {member.name}
                  </p>

                  {/* カテゴリ */}
                  {member.category && (
                    <div className="mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-primary/10 text-primary border border-primary/20">
                        {member.category}
                      </span>
                    </div>
                  )}

                  {/* 公式ホームページ */}
                  {member.websiteUrl && (
                    <div className="mb-6">
                      <a
                        href={member.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        公式ホームページ
                      </a>
                    </div>
                  )}

                  {/* SNSリンク */}
                  {socialLinks.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        SNS
                      </h3>
                      <div className="flex gap-3">
                        {socialLinks.map((link, index) => {
                          const Icon = link.icon;
                          return (
                            <a
                              key={index}
                              href={link.url || ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                              style={{ backgroundColor: link.color || undefined }}
                              title={link.label}
                            >
                              <Icon className="h-5 w-5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* タイトルとメッセージ */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-primary mb-6">
                  {member.title}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {member.message}
                  </p>
                </div>
              </div>

              {/* 提供サービス・商品 */}
              {services.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    提供サービス・商品
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {services.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 戻るボタン（下部） */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => setLocation("/members")}
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              会員一覧に戻る
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
