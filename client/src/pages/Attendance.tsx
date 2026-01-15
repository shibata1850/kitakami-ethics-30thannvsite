import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Check,
  X,
  AlertCircle,
  Loader2,
  History,
  FileText,
  HelpCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Base44 Form type
interface Base44Form {
  id: string;
  title: string;
  event_id?: string;
  event_date?: string;
  deadline?: string;
  questions?: Base44FormQuestion[];
  status?: string;
  created_date: string;
}

interface Base44FormQuestion {
  id: string;
  question: string;
  type: 'text' | 'radio' | 'checkbox' | 'textarea' | 'select';
  options?: string[];
  required?: boolean;
}

// Attendance response type
interface AttendanceResponse {
  id: number;
  eventDate: string | null;
  formTitle: string | null;
  status: "pending" | "attend" | "absent" | "late";
  respondedAt: Date | null;
}

// Base44 Form Response type
interface Base44FormResponse {
  id: string;
  form_id: string;
  user_email?: string;
  attendance: 'attend' | 'absent' | 'undecided';
  guest_count?: number;
  comment?: string;
  answers?: Record<string, any>;
  created_date: string;
}

type AttendanceStatus = "attend" | "absent" | "undecided";

const statusLabels: Record<AttendanceStatus, string> = {
  attend: "出席",
  absent: "欠席",
  undecided: "未定",
};

const statusColors: Record<AttendanceStatus, string> = {
  attend: "bg-green-100 text-green-700 border-green-300",
  absent: "bg-red-100 text-red-700 border-red-300",
  undecided: "bg-gray-100 text-gray-700 border-gray-300",
};

export default function Attendance() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedForm, setSelectedForm] = useState<Base44Form | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>("attend");
  const [guestCount, setGuestCount] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch Base44 attendance forms
  const { data: attendanceForms = [], isLoading: formsLoading } = trpc.attendanceForms.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch user's Base44 form responses
  const { data: myFormResponses = [], refetch: refetchFormResponses } = trpc.attendanceForms.getMyResponses.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Fetch user's local attendance history
  const { data: myHistory = [], isLoading: historyLoading, refetch: refetchHistory } = trpc.attendance.myHistory.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Submit Base44 form response mutation
  const submitFormMutation = trpc.attendanceForms.submitResponse.useMutation({
    onSuccess: () => {
      toast.success("出欠を登録しました");
      setIsDialogOpen(false);
      refetchFormResponses();
      refetchHistory();
      resetForm();
    },
    onError: (error) => {
      toast.error(`登録に失敗しました: ${error.message}`);
    },
  });


  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  const resetForm = () => {
    setSelectedStatus("attend");
    setGuestCount(0);
    setComment("");
    setFormAnswers({});
    setSelectedForm(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg text-muted-foreground">読み込み中...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const formatDate = (dateStr: string | undefined | null) => {
    if (!dateStr) return "未定";
    return new Date(dateStr).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatDeadline = (dateStr: string | undefined | null) => {
    if (!dateStr) return null;
    const deadline = new Date(dateStr);
    const now = new Date();
    const isExpired = deadline < now;
    return {
      text: formatDate(dateStr),
      isExpired,
    };
  };

  // Check if user has already responded to a form
  const getMyFormResponse = (formId: string): Base44FormResponse | undefined => {
    return (myFormResponses as Base44FormResponse[]).find((r) => r.form_id === formId);
  };

  // Handle opening form dialog
  const handleOpenFormDialog = (form: Base44Form) => {
    setSelectedForm(form);

    const existing = getMyFormResponse(form.id);
    if (existing) {
      setSelectedStatus(existing.attendance);
      setGuestCount(existing.guest_count || 0);
      setComment(existing.comment || "");
      setFormAnswers(existing.answers || {});
    } else {
      resetForm();
      setSelectedForm(form);
    }
    setIsDialogOpen(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedForm) {
      // Submit to Base44 form
      submitFormMutation.mutate({
        formId: selectedForm.id,
        attendance: selectedStatus,
        guestCount: guestCount > 0 ? guestCount : undefined,
        comment: comment || undefined,
        answers: Object.keys(formAnswers).length > 0 ? formAnswers : undefined,
      });
    }
  };

  // Render form questions
  const renderFormQuestions = (questions: Base44FormQuestion[]) => {
    return questions.map((q) => (
      <div key={q.id} className="space-y-2">
        <Label className={q.required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
          {q.question}
        </Label>
        {q.type === "text" && (
          <Input
            value={formAnswers[q.id] || ""}
            onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
            placeholder="入力してください"
          />
        )}
        {q.type === "textarea" && (
          <Textarea
            value={formAnswers[q.id] || ""}
            onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
            placeholder="入力してください"
            rows={3}
          />
        )}
        {q.type === "radio" && q.options && (
          <RadioGroup
            value={formAnswers[q.id] || ""}
            onValueChange={(value) => setFormAnswers({ ...formAnswers, [q.id]: value })}
          >
            {q.options.map((opt, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem value={opt} id={`${q.id}-${idx}`} />
                <Label htmlFor={`${q.id}-${idx}`} className="font-normal">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {q.type === "select" && q.options && (
          <select
            className="w-full p-2 border rounded-md"
            value={formAnswers[q.id] || ""}
            onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
          >
            <option value="">選択してください</option>
            {q.options.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>
        )}
      </div>
    ));
  };

  const isSubmitting = submitFormMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-blue-100 py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-blue-700 mb-4">出欠登録システム</h1>
              <p className="text-lg text-gray-700">
                モーニングセミナーやイベントへの出欠を簡単に登録できます。
              </p>
              <p className="text-sm text-gray-500 mt-2">
                ログイン中: {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="forms" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="forms" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  出欠フォーム
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  登録履歴
                </TabsTrigger>
              </TabsList>

              {/* Forms Tab - Base44 Forms */}
              <TabsContent value="forms">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    出欠確認フォーム
                  </h2>

                  {formsLoading ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Loader2 className="mx-auto h-8 w-8 text-blue-400 animate-spin mb-4" />
                        <p className="text-gray-500">フォームを読み込み中...</p>
                      </CardContent>
                    </Card>
                  ) : attendanceForms.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">現在、回答可能な出欠フォームはありません。</p>
                        <p className="text-sm text-gray-400 mt-2">
                          新しいフォームが追加されるまでお待ちください。
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    (attendanceForms as Base44Form[]).map((form) => {
                      const response = getMyFormResponse(form.id);
                      const hasResponded = !!response;
                      const deadline = formatDeadline(form.deadline);

                      return (
                        <Card key={form.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  {form.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  {form.event_date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4 text-blue-600" />
                                      <span>{formatDate(form.event_date)}</span>
                                    </div>
                                  )}
                                  {deadline && (
                                    <div className={`flex items-center gap-1 ${deadline.isExpired ? 'text-red-500' : ''}`}>
                                      <Clock className="h-4 w-4" />
                                      <span>締切: {deadline.text}</span>
                                      {deadline.isExpired && <span className="text-xs">(締切済)</span>}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {hasResponded && (
                                  <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full border ${
                                      statusColors[response.attendance]
                                    }`}
                                  >
                                    {statusLabels[response.attendance]}
                                  </span>
                                )}

                                <Button
                                  onClick={() => handleOpenFormDialog(form)}
                                  variant={hasResponded ? "outline" : "default"}
                                  className={hasResponded ? "" : "bg-blue-600 hover:bg-blue-700"}
                                  disabled={deadline?.isExpired}
                                >
                                  {deadline?.isExpired ? "締切済" : hasResponded ? "変更する" : "回答する"}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    あなたの出欠登録履歴
                  </h2>

                  {historyLoading ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Loader2 className="mx-auto h-8 w-8 text-blue-400 animate-spin mb-4" />
                        <p className="text-gray-500">履歴を読み込み中...</p>
                      </CardContent>
                    </Card>
                  ) : myHistory.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">まだ出欠登録がありません。</p>
                        <p className="text-sm text-gray-400 mt-2">
                          「出欠フォーム」タブから登録してください。
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {myHistory.map((record) => (
                        <Card key={record.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {record.formTitle || "イベント"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {formatDate(record.eventDate)}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 text-sm font-medium rounded-full border ${
                                  record.status === "attend" ? statusColors.attend :
                                  record.status === "absent" ? statusColors.absent :
                                  record.status === "late" ? "bg-yellow-100 text-yellow-700 border-yellow-300" :
                                  statusColors.undecided
                                }`}
                              >
                                {record.status === "attend" ? "出席" :
                                 record.status === "absent" ? "欠席" :
                                 record.status === "late" ? "遅刻" :
                                 "未定"}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Help Section */}
        <section className="py-8 bg-gray-50">
          <div className="container">
            <Card className="max-w-4xl mx-auto bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <AlertCircle className="h-5 w-5" />
                  ご利用にあたって
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="list-disc list-inside space-y-2">
                  <li>「出欠フォーム」タブでは、Base44システムと連携した出欠確認フォームに回答できます。</li>
                  <li>出欠の登録・変更は各イベントの締切日までに行ってください。</li>
                  <li>登録後も変更は可能です。「変更する」ボタンから再登録できます。</li>
                  <li>急な変更がある場合は、事務局までご連絡ください。</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Registration Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>出欠登録</DialogTitle>
            <DialogDescription>
              {selectedForm?.title || "イベント"}
              {selectedForm?.event_date && (
                <span className="block mt-1">
                  ({formatDate(selectedForm.event_date)})
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {/* Attendance Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">出欠を選択してください</Label>
              <RadioGroup
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as AttendanceStatus)}
                className="grid grid-cols-3 gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="attend" id="attend" />
                  <Label htmlFor="attend" className="flex items-center gap-1 cursor-pointer">
                    <Check className="h-4 w-4 text-green-600" />
                    出席
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="absent" id="absent" />
                  <Label htmlFor="absent" className="flex items-center gap-1 cursor-pointer">
                    <X className="h-4 w-4 text-red-600" />
                    欠席
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="undecided" id="undecided" />
                  <Label htmlFor="undecided" className="flex items-center gap-1 cursor-pointer">
                    <HelpCircle className="h-4 w-4 text-gray-600" />
                    未定
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Guest Count (for forms) */}
            {selectedForm && (
              <div className="space-y-2">
                <Label htmlFor="guestCount">同伴者数</Label>
                <Input
                  id="guestCount"
                  type="number"
                  min="0"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            )}

            {/* Form Questions */}
            {selectedForm?.questions && selectedForm.questions.length > 0 && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900">追加の質問</h4>
                {renderFormQuestions(selectedForm.questions)}
              </div>
            )}

            {/* Comment */}
            <div className="space-y-2">
              <Label htmlFor="comment">コメント（任意）</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="連絡事項があればご記入ください"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  登録中...
                </>
              ) : (
                "登録する"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
