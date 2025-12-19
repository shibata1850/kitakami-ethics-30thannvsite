import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload, Download, FileUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCommitteeColor } from "@/lib/committeeColors";

const CATEGORIES = [
  "専門サービス（士業,保険,デザイン,議員等）",
  "飲食・食品",
  "建築・不動産",
  "美容・健康",
  "製造・ものづくり",
  "医療・福祉",
  "電気・通信・IT",
  "小売・販売",
  "その他",
  "教育・スクール",
  "事業承継",
];

const COMMITTEES = [
  "会員拡大委員会",
  "活力朝礼委員会",
  "広報委員会",
  "研修委員会",
  "地域貢献委員会",
];

interface MemberFormData {
  name: string;
  companyName: string;
  title: string;
  message: string;
  photoUrl?: string;
  category: string;
  committee?: string;
  sortOrder: number;
}

export default function MemberAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: members = [], isLoading } = trpc.members.list.useQuery({});

  const createMember = trpc.members.create.useMutation({
    onSuccess: () => {
      toast.success("会員を登録しました");
      utils.members.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  const updateMember = trpc.members.update.useMutation({
    onSuccess: () => {
      toast.success("会員情報を更新しました");
      utils.members.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  const deleteMember = trpc.members.delete.useMutation({
    onSuccess: () => {
      toast.success("会員を削除しました");
      utils.members.list.invalidate();
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  const uploadPhoto = trpc.members.uploadPhoto.useMutation();
  const exportCSV = trpc.members.exportCSV.useQuery(undefined, { enabled: false });
  const importCSV = trpc.members.importCSV.useMutation({
    onSuccess: (result) => {
      toast.success(`${result.success}件の会員をインポートしました`);
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length}件のエラーがありました`);
        console.error("Import errors:", result.errors);
      }
      utils.members.list.invalidate();
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  const resetForm = () => {
    setEditingMember(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleExportCSV = async () => {
    try {
      const result = await exportCSV.refetch();
      if (result.data?.csv) {
        const blob = new Blob(["\uFEFF" + result.data.csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `会員一覧_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success("CSVファイルをダウンロードしました");
      }
    } catch (error: any) {
      toast.error(`エラー: ${error.message}`);
    }
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const csvContent = event.target?.result as string;
          await importCSV.mutateAsync({ csvContent });
        } catch (error: any) {
          toast.error(`エラー: ${error.message}`);
        }
      };
      reader.readAsText(file, "UTF-8");
      // Reset input
      e.target.value = "";
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    let photoUrl = editingMember?.photoUrl || "";

    // Upload photo if a new one is selected
    if (photoFile) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(photoFile);
        await new Promise((resolve) => {
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(",")[1];
            const result = await uploadPhoto.mutateAsync({
              fileName: photoFile.name,
              fileData: base64Data,
              mimeType: photoFile.type,
            });
            photoUrl = result.url;
            resolve(result);
          };
        });
      } catch (error) {
        toast.error("写真のアップロードに失敗しました");
        return;
      }
    }

    const memberData: MemberFormData = {
      name: formData.get("name") as string,
      companyName: formData.get("companyName") as string,
      title: formData.get("title") as string,
      message: formData.get("message") as string,
      photoUrl,
      category: formData.get("category") as string,
      committee: formData.get("committee") as string,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    };

    if (editingMember) {
      updateMember.mutate({ id: editingMember.id, ...memberData });
    } else {
      createMember.mutate(memberData);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setPhotoPreview(member.photoUrl || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("本当に削除しますか？")) {
      deleteMember.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">会員管理</h1>
              <p className="text-muted-foreground mt-2">
                会員情報の登録・編集・削除ができます
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                CSVエクスポート
              </Button>
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <FileUp className="mr-2 h-4 w-4" />
                  CSVインポート
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                  />
                </label>
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => resetForm()}>
                    <Plus className="mr-2 h-4 w-4" />
                    新規登録
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingMember ? "会員情報を編集" : "新しい会員を登録"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">氏名 *</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingMember?.name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">会社名 *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        defaultValue={editingMember?.companyName}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">タイトル *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="例: 倫理法人会での学びと成長"
                      defaultValue={editingMember?.title}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">会員の声 *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="倫理法人会での体験や学びについて..."
                      defaultValue={editingMember?.message}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">カテゴリー *</Label>
                      <Select
                        name="category"
                        defaultValue={editingMember?.category}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="committee">所属委員会</Label>
                      <Select
                        name="committee"
                        defaultValue={editingMember?.committee}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMITTEES.map((com) => (
                            <SelectItem key={com} value={com}>
                              {com}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">会員写真</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                      {photoPreview && (
                        <img
                          src={photoPreview}
                          alt="プレビュー"
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortOrder">表示順序</Label>
                    <Input
                      id="sortOrder"
                      name="sortOrder"
                      type="number"
                      defaultValue={editingMember?.sortOrder || 0}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button type="submit">
                      {editingMember ? "更新" : "登録"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">読み込み中...</div>
          ) : members.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                まだ会員が登録されていません
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member: any) => (
                <Card key={member.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.companyName}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {member.photoUrl && (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="w-full h-48 object-cover rounded mb-3"
                      />
                    )}
                    <p className="text-sm font-semibold mb-2">{member.title}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {member.message}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {member.category}
                      </span>
                      {member.committee && (
                        <span className={`text-xs px-2 py-1 rounded ${getCommitteeColor(member.committee)}`}>
                          {member.committee}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
