import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";
import emailjs from '@emailjs/browser';

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "お名前は2文字以上で入力してください。",
  }),
  email: z.string().email({
    message: "有効なメールアドレスを入力してください。",
  }),
  phone: z.string().min(10, {
    message: "電話番号を入力してください。",
  }),
  company: z.string().optional(),
  date: z.date({
    required_error: "参加希望日を選択してください。",
    invalid_type_error: "参加希望日を選択してください。",
  } as any),
  message: z.string().optional(),
  privacy: z.boolean().refine((val) => val === true, {
    message: "プライバシーポリシーへの同意が必要です。",
  }),
});

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      privacy: false,
    },
  });

  const createContact = trpc.contacts.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "送信完了",
        description: "お申し込みありがとうございます。担当者より折り返しご連絡いたします。",
      });
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast({
        title: "送信エラー",
        description: error.message || "送信に失敗しました。しばらくしてから再度お試しください。",
      });
      setIsSubmitting(false);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    const dateStr = format(values.date, 'yyyy年M月d日(E)', { locale: ja });
    const messageText = `参加希望日: ${dateStr}\n\n${values.message || ''}`;
    
    createContact.mutate({
      type: "seminar_application",
      name: values.name,
      email: values.email,
      phone: values.phone,
      companyName: values.company || undefined,
      message: messageText,
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-grow py-12 md:py-20">
        <div className="container max-w-3xl">
          <div className="text-left mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-serif">ゲスト参加お申し込み</h1>
            <p className="text-muted-foreground">
              経営者モーニングセミナーへのゲスト参加は無料です。<br />
              以下のフォームよりお気軽にお申し込みください。
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-left border border-primary/20">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-primary">お申し込みありがとうございます</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                ご入力いただいたメールアドレス宛に確認メールをお送りしました。<br />
                当日は開始時刻の10分前までにお越しください。<br />
                皆様のご参加を心よりお待ちしております。
              </p>
              <Button onClick={() => setIsSuccess(false)} variant="outline">
                続けて申し込む
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>お名前 <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="山田 太郎" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>会社名</FormLabel>
                        <FormControl>
                          <Input placeholder="株式会社〇〇" {...field} />
                        </FormControl>
                        <FormDescription>
                          任意項目です
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>メールアドレス <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          確認メールをお送りします
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>電話番号 <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="090-1234-5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>参加希望日 <span className="text-destructive">*</span></FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: ja })
                                ) : (
                                  <span>日付を選択してください</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || date.getDay() !== 2
                              }
                              initialFocus
                              locale={ja}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          毎週火曜日に開催しています
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ご質問・ご要望など</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="初めて参加します。駐車場について教えてください。" 
                            className="resize-none min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                    <h3 className="font-bold text-sm">個人情報の取り扱いについて</h3>
                    <ScrollArea className="h-[150px] w-full rounded-md border p-4 bg-white text-sm text-muted-foreground">
                      <p className="mb-2">
                        北上市倫理法人会(以下「当会」)は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、全会員に個人情報保護の重要性の認識と取組みを徹底させることにより、個人情報の保護を推進致します。
                      </p>
                      <p className="font-bold mb-1">個人情報の管理</p>
                      <p className="mb-2">
                        当会は、参加者の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。
                      </p>
                      <p className="font-bold mb-1">個人情報の利用目的</p>
                      <p className="mb-2">
                        お預かりした個人情報は、当会からのご連絡や業務のご案内やご質問に対する回答として、電子メールや資料のご送付に利用いたします。
                      </p>
                      <p className="font-bold mb-1">個人情報の第三者への開示・提供の禁止</p>
                      <p className="mb-2">
                        当会は、お預かりした個人情報を適切に管理し、次のいずれかに該当する場合を除き、個人情報を第三者に開示いたしません。
                        <br/>・参加者の同意がある場合
                        <br/>・法令に基づき開示することが必要である場合
                      </p>
                    </ScrollArea>
                    
                    <FormField
                      control={form.control}
                      name="privacy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              個人情報の取り扱いについて同意する
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-left pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto px-12"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          送信中...
                        </>
                      ) : (
                        "申し込む"
                      )}
                    </Button>
                    <p className="mt-4 text-xs text-muted-foreground">
                      ご入力いただいた個人情報は、お問い合わせへの対応のみに利用いたします。
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
