import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar as CalendarIcon, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

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
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(values);
      setIsSubmitting(false);
      setIsSuccess(true);
      toast({
        title: "送信完了",
        description: "お申し込みありがとうございます。担当者よりご連絡いたします。",
      });
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-grow py-12 md:py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary font-serif">ゲスト参加お申し込み</h1>
            <p className="text-muted-foreground">
              経営者モーニングセミナーへのゲスト参加は無料です。<br />
              以下のフォームよりお気軽にお申し込みください。
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg border border-primary/10 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-primary">お申し込みありがとうございます</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                送信が完了いたしました。<br />
                ご入力いただいたメールアドレス宛に確認メールをお送りしております。<br />
                当日お会いできることを楽しみにしております。
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <a href="/">トップページへ戻る</a>
              </Button>
            </div>
          ) : (
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>お名前 <span className="text-red-500">*</span></FormLabel>
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
                          <FormDescription>法人会員でない方もご参加いただけます</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>メールアドレス <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>電話番号 <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="090-1234-5678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>参加希望日 <span className="text-red-500">*</span></FormLabel>
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
                                date < new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          毎週火曜日の朝6:00より開催しております。
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

                  <div className="text-center pt-4">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full md:w-auto px-12 py-6 text-lg font-bold shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          送信中...
                        </>
                      ) : (
                        "この内容で申し込む"
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
