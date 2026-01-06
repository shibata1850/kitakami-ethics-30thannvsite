import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success("ログイン成功", {
        description: "ダッシュボードに移動します。",
      });
      // JWTトークンをlocalStorageに保存
      localStorage.setItem("authToken", data.token);
      // ダッシュボードにリダイレクト
      setLocation("/admin/dashboard");
    },
    onError: (error) => {
      toast.error("ログイン失敗", {
        description: error.message,
      });
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("入力エラー", {
        description: "メールアドレスとパスワードを入力してください。",
      });
      return;
    }

    setIsLoading(true);
    loginMutation.mutate({ email, password });
  };

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
            ログイン
          </h1>
          <p className="text-gray-600">
            北上市倫理法人会 会員専用システム
          </p>
        </div>

        <Card className="border-pink-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">
              会員ログイン
            </CardTitle>
            <CardDescription className="text-center">
              メールアドレスとパスワードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
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
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ログイン中...
                  </>
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-gray-600">
              アカウントをお持ちでない方は
            </div>
            <Button
              variant="outline"
              className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
              asChild
            >
              <Link href="/register">新規アカウント作成</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* トップページに戻るボタン */}
        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
            asChild
          >
            <Link href="/">← トップページに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
