import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  MapPin,
  Check,
  X,
  AlertCircle,
  Loader2,
  History,
  CalendarCheck,
  Users,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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
  status?: string;
  description?: string;
}

// Attendance response type
interface AttendanceResponse {
  id: number;
  eventDate: string | null;
  formTitle: string | null;
  status: "pending" | "attend" | "absent" | "late";
  respondedAt: Date | null;
}

type AttendanceStatus = "attend" | "absent" | "late";

const statusLabels: Record<AttendanceStatus, string> = {
  attend: "出席",
  absent: "欠席",
  late: "遅刻",
};

const statusColors: Record<AttendanceStatus, string> = {
  attend: "bg-green-100 text-green-700 border-green-300",
  absent: "bg-red-100 text-red-700 border-red-300",
  late: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

export default function Attendance() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedEvent, setSelectedEvent] = useState<Base44Event | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>("attend");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch upcoming events from Base44
  const { data: upcomingEvents = [], isLoading: eventsLoading } = trpc.base44Events.upcoming.useQuery();

  // Fetch user's attendance history
  const { data: myHistory = [], isLoading: historyLoading, refetch: refetchHistory } = trpc.attendance.myHistory.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Register attendance mutation
  const registerMutation = trpc.attendance.register.useMutation({
    onSuccess: () => {
      toast.success("出欠を登録しました");
      setIsDialogOpen(false);
      refetchHistory();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
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

  const getEventDateString = (event: Base44Event): string => {
    if (!event.event_date) return "";
    return event.event_date.split("T")[0];
  };

  // Check if user has already registered for an event
  const getMyRegistration = (eventDate: string): AttendanceResponse | undefined => {
    return myHistory.find((h) => h.eventDate === eventDate);
  };

  const handleOpenDialog = (event: Base44Event) => {
    setSelectedEvent(event);
    const existing = getMyRegistration(getEventDateString(event));
    if (existing && existing.status !== "pending") {
      setSelectedStatus(existing.status as AttendanceStatus);
    } else {
      setSelectedStatus("attend");
    }
    setIsDialogOpen(true);
  };

  const handleRegister = () => {
    if (!selectedEvent) return;

    const eventDate = getEventDateString(selectedEvent);
    if (!eventDate) {
      toast.error("イベントの日付が不明です");
      return;
    }

    registerMutation.mutate({
      eventDate,
      eventTitle: selectedEvent.title || "イベント",
      base44EventId: selectedEvent.id,
      status: selectedStatus,
    });
  };

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
            <Tabs defaultValue="events" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4" />
                  出欠登録
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  登録履歴
                </TabsTrigger>
              </TabsList>

              {/* Events Tab */}
              <TabsContent value="events">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    今後のイベント・セミナー
                  </h2>

                  {eventsLoading ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Loader2 className="mx-auto h-8 w-8 text-blue-400 animate-spin mb-4" />
                        <p className="text-gray-500">イベント情報を読み込み中...</p>
                      </CardContent>
                    </Card>
                  ) : upcomingEvents.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-500">現在、予定されているイベントはありません。</p>
                      </CardContent>
                    </Card>
                  ) : (
                    (upcomingEvents as Base44Event[]).map((event) => {
                      const eventDate = getEventDateString(event);
                      const registration = getMyRegistration(eventDate);
                      const hasRegistered = registration && registration.status !== "pending";

                      return (
                        <Card key={event.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1">
                                {/* Event Type Badge */}
                                {event.event_type && (
                                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full mb-2">
                                    {event.event_type}
                                  </span>
                                )}

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                  {event.title || "イベント"}
                                </h3>

                                {/* Date & Time */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-blue-600" />
                                    <span>{formatDate(event.event_date)}</span>
                                  </div>
                                  {(event.start_time || event.end_time) && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      <span>
                                        {event.start_time}
                                        {event.start_time && event.end_time && " 〜 "}
                                        {event.end_time}
                                      </span>
                                    </div>
                                  )}
                                  {event.venue && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4 text-blue-600" />
                                      <span>{event.venue}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Registration Status */}
                                {hasRegistered && (
                                  <span
                                    className={`px-3 py-1 text-sm font-medium rounded-full border ${
                                      statusColors[registration.status as AttendanceStatus]
                                    }`}
                                  >
                                    {statusLabels[registration.status as AttendanceStatus]}
                                  </span>
                                )}

                                {/* Register Button */}
                                <Button
                                  onClick={() => handleOpenDialog(event)}
                                  variant={hasRegistered ? "outline" : "default"}
                                  className={hasRegistered ? "" : "bg-blue-600 hover:bg-blue-700"}
                                >
                                  {hasRegistered ? "変更する" : "出欠登録"}
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
                          「出欠登録」タブからイベントを選択して登録してください。
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
                                  statusColors[record.status as AttendanceStatus] || "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {statusLabels[record.status as AttendanceStatus] || record.status}
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
                  <li>出欠の登録・変更は各イベントの開催前日までに行ってください。</li>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>出欠登録</DialogTitle>
            <DialogDescription>
              {selectedEvent?.title || "イベント"} ({formatDate(selectedEvent?.event_date)})
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              出欠を選択してください
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as AttendanceStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attend">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    出席
                  </div>
                </SelectItem>
                <SelectItem value="absent">
                  <div className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-600" />
                    欠席
                  </div>
                </SelectItem>
                <SelectItem value="late">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    遅刻
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button
              onClick={handleRegister}
              disabled={registerMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {registerMutation.isPending ? (
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
