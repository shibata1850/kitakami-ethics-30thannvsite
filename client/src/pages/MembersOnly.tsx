import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Users,
  ExternalLink,
  BookOpen,
  Bell,
  Download,
  MessageSquare
} from "lucide-react";

export default function MembersOnly() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const memberResources = [
    {
      title: "役員専用システム",
      description: "役員向けの管理システムへアクセス",
      icon: Users,
      href: "https://app-99436250-11d4-4bc6-89e5-c095cdd845ed.base44.app",
      external: true,
      color: "bg-yellow-500",
    },
    {
      title: "出欠登録システム",
      description: "モーニングセミナーの出欠を登録",
      icon: Calendar,
      href: "/attendance",
      external: false,
      color: "bg-blue-500",
    },
  ];

  const memberContents = [
    {
      title: "会員向けお知らせ",
      description: "会員限定のお知らせや連絡事項",
      icon: Bell,
      content: "現在、新しいお知らせはありません。",
    },
    {
      title: "資料ダウンロード",
      description: "倫理法人会の資料・書類をダウンロード",
      icon: Download,
      content: "準備中です。",
    },
    {
      title: "会員専用掲示板",
      description: "会員間の情報交換・交流の場",
      icon: MessageSquare,
      content: "準備中です。",
    },
    {
      title: "学習コンテンツ",
      description: "倫理の学びを深めるための教材",
      icon: BookOpen,
      content: "準備中です。",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-primary mb-4">会員専用ページ</h1>
              <p className="text-lg text-muted-foreground">
                ようこそ、{user.email} さん
              </p>
            </div>
          </div>
        </section>

        {/* 外部システムへのリンク */}
        <section className="py-12">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-6">システムへのアクセス</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memberResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`${resource.color} p-3 rounded-lg text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{resource.title}</CardTitle>
                          <CardDescription>{resource.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full">
                        <a
                          href={resource.href}
                          target={resource.external ? "_blank" : undefined}
                          rel={resource.external ? "noopener noreferrer" : undefined}
                        >
                          {resource.external && <ExternalLink className="h-4 w-4 mr-2" />}
                          アクセスする
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* 会員専用コンテンツ */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-6">会員専用コンテンツ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {memberContents.map((content, index) => {
                const Icon = content.icon;
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{content.title}</CardTitle>
                          <CardDescription>{content.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{content.content}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* ヘルプセクション */}
        <section className="py-12">
          <div className="container">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  お困りの際は
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  ご不明な点やお困りのことがございましたら、事務局までお問い合わせください。
                </p>
                <Button asChild variant="outline">
                  <a href="/contact">お問い合わせページへ</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
