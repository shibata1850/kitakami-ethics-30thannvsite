import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Download, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function EventRsvpAdmin() {
  const { toast } = useToast();
  const [attendanceFilter, setAttendanceFilter] = useState<"attend" | "decline" | "all">("all");
  const [affiliationFilter, setAffiliationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: rsvps, isLoading, refetch } = trpc.eventRsvps.getAll.useQuery({
    attendance: attendanceFilter,
    affiliation: affiliationFilter === "all" ? undefined : affiliationFilter,
    search: searchQuery || undefined,
  });

  const { data: stats } = trpc.eventRsvps.getStats.useQuery();
  const { data: affiliations } = trpc.eventRsvps.getAffiliations.useQuery();

  const deleteRsvp = trpc.eventRsvps.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "削除完了",
        description: "回答データを削除しました。",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "削除エラー",
        description: error.message || "削除に失敗しました。",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("この回答データを削除してもよろしいですか?")) {
      deleteRsvp.mutate({ id });
    }
  };

  const handleExportCSV = () => {
    if (!rsvps || rsvps.length === 0) {
      toast({
        title: "エクスポートエラー",
        description: "エクスポートするデータがありません。",
      });
      return;
    }

    // CSV header
    const headers = ["ID", "出欠", "所属単会", "役職", "姓", "名", "メールアドレス", "メッセージ", "送信日時"];
    const csvContent = [
      headers.join(","),
      ...rsvps.map((rsvp) =>
        [
          rsvp.id,
          rsvp.attendance === "attend" ? "出席" : "欠席",
          `"${rsvp.affiliation}"`,
          `"${rsvp.position || ""}"`,
          `"${rsvp.lastName}"`,
          `"${rsvp.firstName}"`,
          rsvp.email,
          `"${rsvp.message || ""}"`,
          new Date(rsvp.createdAt).toLocaleString("ja-JP"),
        ].join(",")
      ),
    ].join("\n");

    // Create download link
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `event_rsvps_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "エクスポート完了",
      description: "CSVファイルをダウンロードしました。",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary">30周年イベント回答管理</h1>
          <p className="text-muted-foreground mt-2">
            式典・懇親会の出欠回答を管理します
          </p>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground">総回答数</div>
              <div className="text-3xl font-bold mt-2">{stats.total}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground">出席</div>
              <div className="text-3xl font-bold mt-2 text-green-600">{stats.attendCount}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm font-medium text-muted-foreground">欠席</div>
              <div className="text-3xl font-bold mt-2 text-red-600">{stats.declineCount}</div>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">出欠</label>
              <Select value={attendanceFilter} onValueChange={(value: any) => setAttendanceFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="attend">出席</SelectItem>
                  <SelectItem value="decline">欠席</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">所属単会</label>
              <Select value={affiliationFilter} onValueChange={setAffiliationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {affiliations?.map((affiliation) => (
                    <SelectItem key={affiliation} value={affiliation}>
                      {affiliation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">検索</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="氏名、メールアドレス"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={handleExportCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              CSVエクスポート
            </Button>
          </div>
        </Card>

        {/* Table */}
        <Card>
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !rsvps || rsvps.length === 0 ? (
            <div className="text-left md:text-center p-12 text-muted-foreground">
              回答データがありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>出欠</TableHead>
                    <TableHead>所属単会</TableHead>
                    <TableHead>役職</TableHead>
                    <TableHead>氏名</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>メッセージ</TableHead>
                    <TableHead>送信日時</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rsvps.map((rsvp) => (
                    <TableRow key={rsvp.id}>
                      <TableCell>
                        <Badge variant={rsvp.attendance === "attend" ? "default" : "secondary"}>
                          {rsvp.attendance === "attend" ? "出席" : "欠席"}
                        </Badge>
                      </TableCell>
                      <TableCell>{rsvp.affiliation}</TableCell>
                      <TableCell>{rsvp.position || "-"}</TableCell>
                      <TableCell>
                        {rsvp.lastName} {rsvp.firstName}
                      </TableCell>
                      <TableCell>{rsvp.email}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {rsvp.message || "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(rsvp.createdAt).toLocaleString("ja-JP")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(rsvp.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Affiliation Statistics */}
        {stats && Object.keys(stats.affiliationCounts).length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">所属単会別集計</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>所属単会</TableHead>
                    <TableHead className="text-right">出席</TableHead>
                    <TableHead className="text-right">欠席</TableHead>
                    <TableHead className="text-right">合計</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(stats.affiliationCounts).map(([affiliation, counts]) => (
                    <TableRow key={affiliation}>
                      <TableCell className="font-medium">{affiliation}</TableCell>
                      <TableCell className="text-right text-green-600">{counts.attend}</TableCell>
                      <TableCell className="text-right text-red-600">{counts.decline}</TableCell>
                      <TableCell className="text-right font-bold">
                        {counts.attend + counts.decline}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
