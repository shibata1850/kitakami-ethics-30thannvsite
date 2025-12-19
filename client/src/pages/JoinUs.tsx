import { useState } from "react";
import { Check, Calendar, BookOpen, Users, Heart, TrendingUp } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function JoinUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    agreedToPrivacy: false,
  });

  const createContact = trpc.contacts.create.useMutation({
    onSuccess: () => {
      toast.success("お申し込みありがとうございます。担当者より折り返しご連絡いたします。");
      // フォームをリセット
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        message: "",
        agreedToPrivacy: false,
      });
    },
    onError: (error) => {
      toast.error(`送信に失敗しました: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreedToPrivacy) {
      toast.error("プライバシーポリシーに同意してください");
      return;
    }

    createContact.mutate({
      type: "seminar_application",
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      companyName: formData.company || undefined,
      message: formData.message || "モーニングセミナーの無料体験を希望します。",
    });
  };

  const benefits = [
    "モーニングセミナーで自己研鑽できる",
    "早起きの習慣、姿勢・立ち居振る舞いが整う",
    "声を出して元気が出る",
    "「万人幸福の栞」や講話で、苦難克服の実践を学べる",
    "真摯に学ぶ異業種の人脈ができる",
    "「職場の教養」を朝礼に活用できる",
    "社内の意識改革が進む。社員が育つ、やる気が増す",
    "家族関係が良くなる。家庭が安らぎの場所になる",
    "無料でアドバイザーに悩みを相談できる（倫理指導）",
    "モーニングセミナー以外にも多くの学びの機会がある",
    "逆境に強くなる、軸ができる、行動力が高まる",
    "役職者になると、運営を通じて多くを学べる",
  ];

  const membershipBenefits = [
    {
      icon: Calendar,
      title: "経営者モーニングセミナー",
      subtitle: "全国約740会場",
      badge: "無料で参加できます！",
      description: "北上市はもちろん、全国約740会場のモーニングセミナーに無料で参加できます。出張先での参加もOK。「倫友」だからあっという間に打ち解け、全国に人脈が広がります。",
    },
    {
      icon: BookOpen,
      title: "「職場の教養」",
      subtitle: "1口毎月30冊",
      badge: "無料で届きます！",
      description: "「職場の教養」は社内で朝礼のテキストとして使える非売品の冊子です。一日一話、「今日の心がけ」が記されています。「活力朝礼」の指導も受けることができます。",
    },
    {
      icon: Users,
      title: "「倫理指導」",
      subtitle: "個人指導/相談",
      badge: "無料で受けられます！",
      description: "人生のあらゆる悩みについて、経験豊富な研究員やインストラクターに個別相談できます。指導されたことを実践し、難題が好転した事例が多数あります。",
    },
    {
      icon: TrendingUp,
      title: "MS以外のセミナー",
      subtitle: "「経営者の集い」「富士研」など",
      badge: "無料 or 割引価格！",
      description: "MS以外にも、会員向けの各種セミナーや勉強会に無料で参加できます。また、一般社団法人倫理研究所が開催する「富士研」などの研修やセミナーを割引価格で受講できます。",
    },
    {
      icon: Heart,
      title: "「基礎講座」",
      subtitle: "（役職者対象）",
      badge: "無料で受講できます！",
      description: "倫理法人会は会員によって運営されています。役職者（運営の担い手）になると、一般社団法人倫理研究所講師による「倫理経営基礎講座（全26講）」を無料で受講できます。",
    },
  ];

  const joinSteps = [
    {
      number: "01",
      title: "セミナーゲスト参加",
      description: "まずは「経営者モーニングセミナー」「経営者の集い」などのセミナーにご参加いただくのがおすすめです。会の雰囲気がよくわかります。モーニングセミナーゲスト参加は無料です。",
    },
    {
      number: "02",
      title: "オリエンテーション",
      description: "参加されたセミナーで、入会に関するオリエンテーションをお聞きください。",
    },
    {
      number: "03",
      title: "入会申込書記入",
      description: "ご納得いただけたら、入会申込書にご記入ください。会費は月額一口1万円（税込）です。",
    },
    {
      number: "04",
      title: "入会式",
      description: "ご入会後はじめて参加されるモーニングセミナーにて、会長挨拶の中で入会式を行います。",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="bg-gradient-to-r from-pink-50 to-pink-100 py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                入会案内
              </h1>
              <p className="text-lg text-gray-700">
                倫理法人会入会のメリットや入会の流れをご説明します
              </p>
            </div>
          </div>
        </section>

        {/* 入会のメリット */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                倫理法人会入会のメリット
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600">
                  <a href="/schedule">スケジュール一覧へ →</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 会員特典 */}
        <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              会員特典
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {membershipBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-2 border-yellow-200 bg-white hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 mb-4 mx-auto">
                        <Icon className="w-8 h-8 text-pink-600" />
                      </div>
                      <CardTitle className="text-center text-xl">{benefit.title}</CardTitle>
                      <CardDescription className="text-center text-sm">{benefit.subtitle}</CardDescription>
                      <div className="text-center">
                        <span className="inline-block bg-pink-500 text-white text-sm font-bold px-4 py-1 rounded-full mt-2">
                          {benefit.badge}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 text-center">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* 会費 */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">会費</h2>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-8 mb-6">
                <p className="text-5xl font-bold text-pink-600 mb-2">月額一口10,000円</p>
                <p className="text-gray-600">（何口でも可）</p>
              </div>
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                <p className="text-gray-700">
                  入会金、教材費、寄付、退会金などの隠れた費用はありません。
                </p>
                <p className="text-gray-700">
                  「職場の教養」進呈は、1口30冊、6口目からは1口100冊です。
                </p>
                <p className="text-gray-700">
                  会費の約4分の1は、<span className="text-pink-600 font-semibold">社会貢献・環境保全活動</span>に使われています。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 入会の流れ */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
                倫理法人会入会の流れ
              </h2>
              <p className="text-center text-gray-600 mb-12">
                北上市倫理法人会には、ご職業、ご自宅や会社の所在地にかかわらず、どなたでもご入会いただけます。
              </p>
              <div className="space-y-6">
                {joinSteps.map((step, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center text-xl font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 bg-gradient-to-r from-pink-100 to-orange-100 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">まずは3ヶ月お試し下さい！</h3>
                <p className="text-gray-700">
                  実際に経験してみないとわからないことがあります。<br />
                  ぜひモーニングセミナーにご参加いただき、入会して3ヶ月続けてみてください。<br />
                  3ヶ月倫理の学びに真摯に取り組んだらきっと変化を感じていただけます！
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* お申し込みフォーム */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
                モーニングセミナー無料体験お申込
              </h2>
              <p className="text-center text-gray-600 mb-8">
                まずはお気軽にモーニングセミナーをご体験ください
              </p>
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">お名前 *</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="山田 太郎"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">メールアドレス *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">会社名（任意）</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="株式会社〇〇"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">電話番号（任意）</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="090-1234-5678"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">その他のご要望、お問い合わせなど</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="参加希望日時やご質問などがございましたらご記入ください"
                        rows={5}
                      />
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.agreedToPrivacy}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreedToPrivacy: checked as boolean })
                        }
                      />
                      <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                        ご入力いただいた内容は必要に応じて担当者等に共有させていただきます。
                        また、セミナーのご案内などに使用させていただく場合がございます。
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-pink-500 hover:bg-pink-600 text-lg py-6"
                      size="lg"
                    >
                      送信する
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
