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
import { Pencil, Trash2, Plus, Upload } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const POSITIONS = [
  "会長",
  "専任幹事",
  "事務長",
  "理事",
  "相談役",
  "委員長",
  "副委員長",
  "会員拡大委員会委員長",
  "活力朝礼委員会委員長",
  "広報委員会委員長",
  "研修委員会委員長",
  "地域貢献委員会委員長",
];

const COMMITTEES = [
  "会員拡大委員会",
  "活力朝礼委員会",
  "広報委員会",
  "研修委員会",
  "地域貢献委員会",
];

interface OfficerFormData {
  name: string;
  companyName: string;
  position: string;
  committee?: string;
  message?: string;
  photoUrl?: string;
  sortOrder: number;
}

export default function OfficerAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState<any>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: officers = [], isLoading } = trpc.officers.list.useQuery();

  const createOfficer = trpc.officers.create.useMutation({
    onSuccess: () => {
      toast.success("役員を登録しました");
      utils.officers.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  const updateOfficer = trpc.officers.update.useMutation({
    onSuccess: () => {
      toast.success("役員情報を更新しました");
      utils.officers.list.invalidate();
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  const deleteOfficer = trpc.officers.delete.useMutation({
    onSuccess: () => {
      toast.success("役員を削除しました");
      utils.officers.list.invalidate();
    },
    onError: (error) => {
      toast.error(`エラー: ${error.message}`);
    },
  });

  const uploadPhoto = trpc.officers.uploadPhoto.useMutation();

  const resetForm = () => {
    setEditingOfficer(null);
    setPhotoFile(null);
    setPhotoPreview(null);
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

    let photoUrl = editingOfficer?.photoUrl || "";

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

    const officerData: OfficerFormData = {
      name: formData.get("name") as string,
      companyName: formData.get("companyName") as string,
      position: formData.get("position") as string,
      committee: formData.get("committee") as string || undefined,
      message: formData.get("message") as string || undefined,
      photoUrl,
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    };

    if (editingOfficer) {
      updateOfficer.mutate({ id: editingOfficer.id, ...officerData });
    } else {
      createOfficer.mutate(officerData);
    }
  };

  const handleEdit = (officer: any) => {
    setEditingOfficer(officer);
    setPhotoPreview(officer.photoUrl || null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("本当に削除しますか？")) {
      deleteOfficer.mutate({ id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary">役員管理</h1>
              <p className="text-muted-foreground mt-2">
                役員情報の登録・編集・削除ができます
              </p>
            </div>
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
                    {editingOfficer ? "役員情報を編集" : "新しい役員を登録"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">氏名 *</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={editingOfficer?.name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">会社名 *</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        defaultValue={editingOfficer?.companyName}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">役職 *</Label>
                    <Select
                      name="position"
                      defaultValue={editingOfficer?.position}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="役職を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((pos) => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="committee">所属委員会（委員会委員長の場合のみ）</Label>
                    <Select
                      name="committee"
                      defaultValue={editingOfficer?.committee}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="委員会を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">なし</SelectItem>
                        {COMMITTEES.map((com) => (
                          <SelectItem key={com} value={com}>
                            {com}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">メッセージ</Label>
                    <Textarea
                      id="message"
                      name="message"
                      defaultValue={editingOfficer?.message}
                      rows={4}
                      placeholder="役員からのメッセージを入力してください"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photo">写真</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="flex-1"
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
                      defaultValue={editingOfficer?.sortOrder || 0}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      数字が小さいほど上に表示されます
                    </p>
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
                      {editingOfficer ? "更新" : "登録"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-12">読み込み中...</div>
          ) : officers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                まだ役員が登録されていません
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {officers.map((officer: any) => (
                <Card key={officer.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{officer.name}</CardTitle>
                        <CardDescription>{officer.companyName}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(officer)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(officer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {officer.photoUrl && (
                      <img
                        src={officer.photoUrl}
                        alt={officer.name}
                        className="w-full h-48 object-cover rounded mb-3"
                      />
                    )}
                    <p className="text-sm font-semibold mb-2 text-primary">{officer.position}</p>
                    {officer.committee && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {officer.committee}
                      </p>
                    )}
                    {officer.message && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {officer.message}
                      </p>
                    )}
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
