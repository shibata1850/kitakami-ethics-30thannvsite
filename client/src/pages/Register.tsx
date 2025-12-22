import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("登録申請完了", {
        description: "アドミンの承認をお待ちください。",
      });
      setIsRegistered(true);
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error("登録失敗", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    if (!email || !password || !confirmPassword || !companyName || !name) {
      toast.error("入力エラー", {
        description: "すべての項目を入力してください。",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("パスワードエラー", {
        description: "パスワードが一致しません。",
      });
      return;
    }

    if (password.length < 8) {
      toast.error("パスワードエラー", {
        description: "パスワードは8文字以上で設定してください。",
      });
      return;
    }

    setIsLoading(true);
    registerMutation.mutate({ 
      email, 
      password, 
      companyName,
      name 
    });
  };

  // 登録完了画面
  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="border-green-200 shadow-lg">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-center text-green-700">
                登録申請が完了しました
              </CardTitle>
              <CardDescription className="text-center">
                アドミンによる承認をお待ちください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>登録メールアドレス:</strong> {email}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>会社名:</strong> {companyName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>お名前:</strong> {name}
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  アドミンによる承認が完了次第、登録されたメールアドレスに通知が届きます。
                  承認までしばらくお待ちください。
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white"
                asChild
              >
                <Link href="/">トップページに戻る</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // 登録フォーム画面
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* ロゴとタイトル */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="北上市倫理法人会" 
            className="h-16 w-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            新規アカウント作成
          </h1>
          <p className="text-gray-600">
            北上市倫理法人会 会員専用システム
          </p>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              会員登録申請
            </CardTitle>
            <CardDescription className="text-center">
              アカウント情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">お名前 <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="山田 太郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">会社名 <span className="text-red-500">*</span></Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="株式会社〇〇"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">パスワード <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="8文字以上"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
                <p className="text-xs text-gray-500">
                  ※ パスワードは8文字以上で設定してください
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード（確認） <span className="text-red-500">*</span></Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="パスワードを再入力"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-gray-700">
                  <strong>ご注意:</strong> 登録後、アドミンによる承認が必要です。
                  承認が完了するまでログインできませんのでご了承ください。
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登録申請中...
                  </>
                ) : (
                  "登録申請する"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-600">
              すでにアカウントをお持ちの方は
            </div>
            <Button
              variant="outline"
              className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
              asChild
            >
              <Link href="/login">ログイン</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* ホームに戻るリンク */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-pink-600 hover:text-pink-700 hover:underline">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
