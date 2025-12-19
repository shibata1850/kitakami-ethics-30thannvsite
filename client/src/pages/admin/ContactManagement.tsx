import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, Eye, Trash2, Send, Filter } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

type ContactStatus = "pending" | "in_progress" | "completed";
type ContactType = "contact" | "seminar_application";

export default function ContactManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContactType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { data: contacts = [], refetch } = trpc.contacts.list.useQuery({
    type: typeFilter === "all" ? undefined : typeFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
    searchQuery: searchQuery || undefined,
  });

  const updateStatus = trpc.contacts.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("ステータスを更新しました");
      refetch();
    },
    onError: (error) => {
      toast.error(`更新に失敗しました: ${error.message}`);
    },
  });

  const sendReply = trpc.contacts.reply.useMutation({
    onSuccess: () => {
      toast.success("返信を送信しました");
      setIsReplyDialogOpen(false);
      setReplyText("");
      refetch();
    },
    onError: (error) => {
      toast.error(`送信に失敗しました: ${error.message}`);
    },
  });

  const deleteContact = trpc.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success("問い合わせを削除しました");
      setIsDetailDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(`削除に失敗しました: ${error.message}`);
    },
  });

  const handleViewDetail = (contact: any) => {
    setSelectedContact(contact);
    setIsDetailDialogOpen(true);
  };

  const handleReply = (contact: any) => {
    setSelectedContact(contact);
    setIsReplyDialogOpen(true);
  };

  const handleStatusChange = (contactId: number, newStatus: ContactStatus) => {
    updateStatus.mutate({ id: contactId, status: newStatus });
  };

  const handleSendReply = () => {
    if (!selectedContact || !replyText.trim()) {
      toast.error("返信内容を入力してください");
      return;
    }
    sendReply.mutate({ id: selectedContact.id, reply: replyText });
  };

  const handleDelete = (contactId: number) => {
    if (confirm("本当に削除しますか？")) {
      deleteContact.mutate({ id: contactId });
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    const statusConfig = {
      pending: { label: "未対応", variant: "destructive" as const },
      in_progress: { label: "対応中", variant: "default" as const },
      completed: { label: "完了", variant: "secondary" as const },
    };
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: ContactType) => {
    const typeConfig = {
      contact: { label: "一般問い合わせ", variant: "outline" as const },
      seminar_application: { label: "セミナー申込", variant: "default" as const },
    };
    const config = typeConfig[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">問い合わせ管理</h1>
        <p className="text-gray-600 mt-2">
          お問い合わせとセミナー申込の管理
        </p>
      </div>

      {/* フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            フィルター
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">検索</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="名前、メール、会社名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type-filter">種別</Label>
              <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                <SelectTrigger id="type-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="contact">一般問い合わせ</SelectItem>
                  <SelectItem value="seminar_application">セミナー申込</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status-filter">ステータス</Label>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="pending">未対応</SelectItem>
                  <SelectItem value="in_progress">対応中</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 問い合わせ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>問い合わせ一覧</CardTitle>
          <CardDescription>
            全{contacts.length}件の問い合わせ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>受信日時</TableHead>
                  <TableHead>種別</TableHead>
                  <TableHead>氏名</TableHead>
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>会社名</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      問い合わせがありません
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact: any) => (
                    <TableRow key={contact.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(contact.createdAt), "yyyy/MM/dd HH:mm", { locale: ja })}
                      </TableCell>
                      <TableCell>{getTypeBadge(contact.type)}</TableCell>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.companyName || "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={contact.status}
                          onValueChange={(value: ContactStatus) => handleStatusChange(contact.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">未対応</SelectItem>
                            <SelectItem value="in_progress">対応中</SelectItem>
                            <SelectItem value="completed">完了</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(contact)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReply(contact)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(contact.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 詳細ダイアログ */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>問い合わせ詳細</DialogTitle>
            <DialogDescription>
              {selectedContact && format(new Date(selectedContact.createdAt), "yyyy年MM月dd日 HH:mm", { locale: ja })}
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">種別</Label>
                  <div className="mt-1">{getTypeBadge(selectedContact.type)}</div>
                </div>
                <div>
                  <Label className="text-gray-600">ステータス</Label>
                  <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                </div>
              </div>

              <div>
                <Label className="text-gray-600">氏名</Label>
                <p className="mt-1 font-medium">{selectedContact.name}</p>
              </div>

              <div>
                <Label className="text-gray-600">メールアドレス</Label>
                <p className="mt-1">{selectedContact.email}</p>
              </div>

              {selectedContact.phone && (
                <div>
                  <Label className="text-gray-600">電話番号</Label>
                  <p className="mt-1">{selectedContact.phone}</p>
                </div>
              )}

              {selectedContact.companyName && (
                <div>
                  <Label className="text-gray-600">会社名</Label>
                  <p className="mt-1">{selectedContact.companyName}</p>
                </div>
              )}

              <div>
                <Label className="text-gray-600">メッセージ</Label>
                <p className="mt-1 whitespace-pre-wrap bg-gray-50 p-4 rounded-md">
                  {selectedContact.message}
                </p>
              </div>

              {selectedContact.reply && (
                <div>
                  <Label className="text-gray-600">返信内容</Label>
                  <p className="mt-1 whitespace-pre-wrap bg-green-50 p-4 rounded-md border border-green-200">
                    {selectedContact.reply}
                  </p>
                  {selectedContact.repliedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      返信日時: {format(new Date(selectedContact.repliedAt), "yyyy年MM月dd日 HH:mm", { locale: ja })}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 返信ダイアログ */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>返信を送信</DialogTitle>
            <DialogDescription>
              {selectedContact?.name} 様への返信
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-600">元のメッセージ</Label>
                <p className="mt-1 whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm">
                  {selectedContact.message}
                </p>
              </div>

              <div>
                <Label htmlFor="reply">返信内容</Label>
                <Textarea
                  id="reply"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="返信内容を入力してください..."
                  className="min-h-[200px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSendReply} disabled={!replyText.trim()}>
              <Send className="h-4 w-4 mr-2" />
              送信
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
