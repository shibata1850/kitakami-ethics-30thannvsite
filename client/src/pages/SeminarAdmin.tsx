import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";

export default function SeminarAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeminar, setEditingSeminar] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    speaker: "",
    theme: "",
    venue: "",
    description: "",
    sortOrder: 0,
  });

  const { data: seminars = [], refetch } = trpc.seminars.list.useQuery();
  const createMutation = trpc.seminars.create.useMutation();
  const updateMutation = trpc.seminars.update.useMutation();
  const deleteMutation = trpc.seminars.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSeminar) {
        await updateMutation.mutateAsync({ id: editingSeminar.id, ...formData });
        toast.success("セミナー予定を更新しました");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("セミナー予定を登録しました");
      }
      refetch();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "エラーが発生しました");
    }
  };

  const handleEdit = (seminar: any) => {
    setEditingSeminar(seminar);
    setFormData({
      date: seminar.date,
      time: seminar.time,
      speaker: seminar.speaker,
      theme: seminar.theme,
      venue: seminar.venue,
      description: seminar.description || "",
      sortOrder: seminar.sortOrder,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("このセミナー予定を削除してもよろしいですか？")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("セミナー予定を削除しました");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "削除に失敗しました");
    }
  };

  const resetForm = () => {
    setEditingSeminar(null);
    setFormData({
      date: "",
      time: "",
      speaker: "",
      theme: "",
      venue: "",
      description: "",
      sortOrder: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12">
      <div className="container max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">セミナー予定管理</h1>
            <p className="mt-2 text-gray-600">経営者モーニングセミナーの予定を管理します</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                新規登録
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSeminar ? "セミナー予定を編集" : "セミナー予定を登録"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="date">日付 *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">時間 *</Label>
                  <Input
                    id="time"
                    placeholder="例: 朝6:00〜7:00"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="speaker">講師名 *</Label>
                  <Input
                    id="speaker"
                    placeholder="例: 山田太郎"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="theme">テーマ *</Label>
                  <Input
                    id="theme"
                    placeholder="例: 経営者としての心構え"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="venue">会場 *</Label>
                  <Input
                    id="venue"
                    placeholder="例: ㈱南部家敷 本社 研修所八光館"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">説明（任意）</Label>
                  <Textarea
                    id="description"
                    placeholder="セミナーの詳細説明"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="sortOrder">表示順序</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button type="submit">
                    {editingSeminar ? "更新" : "登録"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日付
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    講師名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    テーマ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    会場
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {seminars.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p>まだセミナー予定が登録されていません</p>
                      <p className="text-sm mt-2">「新規登録」ボタンから追加してください</p>
                    </td>
                  </tr>
                ) : (
                  seminars.map((seminar: any) => (
                    <tr key={seminar.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(seminar.date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seminar.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {seminar.speaker}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {seminar.theme}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {seminar.venue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(seminar)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(seminar.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
