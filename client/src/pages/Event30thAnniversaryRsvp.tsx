import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FaArrowLeft } from "react-icons/fa";

export default function Event30thAnniversaryRsvp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    attendance: "attend",
    affiliation: "",
    position: "",
    lastName: "",
    firstName: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.affiliation || !formData.lastName || !formData.firstName || !formData.email) {
      toast({
        title: "入力エラー",
        description: "必須項目をすべて入力してください。",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "入力エラー",
        description: "有効なメールアドレスを入力してください。",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call to save RSVP data
      // For now, just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "送信完了",
        description: "出欠情報を受け付けました。",
      });
      
      // Reset form
      setFormData({
        attendance: "attend",
        affiliation: "",
        position: "",
        lastName: "",
        firstName: "",
        email: "",
        message: "",
      });
      
      // Redirect to event page after 2 seconds
      setTimeout(() => {
        setLocation("/events/30th-anniversary");
      }, 2000);
    } catch (error) {
      toast({
        title: "送信エラー",
        description: "回答内容の送信に失敗しました。ページを再読込して再度お試しいただくか、別のブラウザでお試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sakura-50 to-white py-16">
      <div className="container max-w-3xl">
        {/* Back Button */}
        <Link href="/events/30th-anniversary">
          <Button variant="ghost" className="mb-8 gap-2">
            <FaArrowLeft />
            イベント詳細に戻る
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-sakura-600">
            回答フォーム
          </h1>
          <p className="text-lg mb-2">
            この度はお会いできますことを心より楽しみにしております。
          </p>
          <p className="text-lg mb-4">
            お手数をおかけいたしますが、下記フォームへのご回答をお願い申し上げます。
          </p>
          <p className="text-sakura-600 font-bold text-lg">
            2026年4月10日までにご返信をお願いいたします
          </p>
        </div>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attendance */}
            <div className="space-y-3">
              <Label className="text-lg font-bold">
                出欠 <span className="text-red-500">*</span>
              </Label>
              <RadioGroup
                value={formData.attendance}
                onValueChange={(value) => setFormData({ ...formData, attendance: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attend" id="attend" />
                  <Label htmlFor="attend" className="cursor-pointer">出席 (attend)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="decline" id="decline" />
                  <Label htmlFor="decline" className="cursor-pointer">欠席 (decline)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Affiliation */}
            <div className="space-y-2">
              <Label htmlFor="affiliation" className="text-lg font-bold">
                所属単会 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.affiliation}
                onValueChange={(value) => setFormData({ ...formData, affiliation: value })}
              >
                <SelectTrigger id="affiliation">
                  <SelectValue placeholder="所属単会を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="二戸市倫理法人会">二戸市倫理法人会</SelectItem>
                  <SelectItem value="盛岡市倫理法人会">盛岡市倫理法人会</SelectItem>
                  <SelectItem value="盛岡みなみ倫理法人会">盛岡みなみ倫理法人会</SelectItem>
                  <SelectItem value="紫波・矢巾倫理法人会">紫波・矢巾倫理法人会</SelectItem>
                  <SelectItem value="花巻市倫理法人会">花巻市倫理法人会</SelectItem>
                  <SelectItem value="北上市倫理法人会">北上市倫理法人会</SelectItem>
                  <SelectItem value="奥州市倫理法人会">奥州市倫理法人会</SelectItem>
                  <SelectItem value="久慈市倫理法人会">久慈市倫理法人会</SelectItem>
                  <SelectItem value="宮古市倫理法人会">宮古市倫理法人会</SelectItem>
                  <SelectItem value="遠野市倫理法人会">遠野市倫理法人会</SelectItem>
                  <SelectItem value="釜石市準倫理法人会">釜石市準倫理法人会</SelectItem>
                  <SelectItem value="けせん倫理法人会">けせん倫理法人会</SelectItem>
                  <SelectItem value="一関市倫理法人会">一関市倫理法人会</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position" className="text-lg font-bold">
                役職
              </Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="役職"
              />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="text-lg font-bold">
                お名前 <span className="text-red-500">*</span>
              </Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastName" className="sr-only">姓</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="姓"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="firstName" className="sr-only">名</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="名"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-lg font-bold">
                メールアドレス <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="メールアドレス"
                required
              />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-lg font-bold">
                メッセージ
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="メッセージ"
                rows={5}
              />
            </div>

            {/* Note */}
            <div className="bg-sakura-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="text-red-500">*</span> は必須項目です
              </p>
              <p className="text-sm text-gray-700 mt-2">
                一度に登録できるお連れ様は20名までです。<br />
                21名以上の出欠登録が必要な場合は、招待状を再読み込みし複数回に分けてご登録ください。
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "送信中..." : "送信する"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
