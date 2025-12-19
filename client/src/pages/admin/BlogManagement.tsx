import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, Calendar, Tag } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CATEGORIES = ["活動報告", "お知らせ", "イベント", "その他"];

export default function BlogManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts, refetch } = trpc.blogPosts.adminList.useQuery({
    category: filterCategory === "all" ? undefined : filterCategory,
    status: filterStatus === "all" ? undefined : (filterStatus as "draft" | "published"),
    searchQuery: searchQuery || undefined,
  });

  const createMutation = trpc.blogPosts.create.useMutation({
    onSuccess: () => {
      toast.success("ブログ記事を作成しました");
      refetch();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`作成に失敗しました: ${error.message}`);
    },
  });

  const updateMutation = trpc.blogPosts.update.useMutation({
    onSuccess: () => {
      toast.success("ブログ記事を更新しました");
      refetch();
      setIsEditDialogOpen(false);
      setEditingPost(null);
    },
    onError: (error) => {
      toast.error(`更新に失敗しました: ${error.message}`);
    },
  });

  const deleteMutation = trpc.blogPosts.delete.useMutation({
    onSuccess: () => {
      toast.success("ブログ記事を削除しました");
      refetch();
    },
    onError: (error) => {
      toast.error(`削除に失敗しました: ${error.message}`);
    },
  });

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const status = formData.get("status") as "draft" | "published";

    createMutation.mutate({
      title,
      slug,
      content,
      excerpt: excerpt || undefined,
      category,
      tags: tags || undefined,
      status,
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const status = formData.get("status") as "draft" | "published";

    updateMutation.mutate({
      id: editingPost.id,
      title,
      slug,
      content,
      excerpt: excerpt || undefined,
      category,
      tags: tags || undefined,
      status,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("本当に削除しますか？")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleEditClick = (post: any) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">ブログ管理</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  新規作成
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>新規ブログ記事作成</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <Label htmlFor="create-title">タイトル *</Label>
                    <Input
                      id="create-title"
                      name="title"
                      required
                      placeholder="記事のタイトルを入力"
                      onChange={(e) => {
                        const slugInput = document.getElementById("create-slug") as HTMLInputElement;
                        if (slugInput && !slugInput.value) {
                          slugInput.value = generateSlug(e.target.value);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-slug">スラッグ（URL用） *</Label>
                    <Input
                      id="create-slug"
                      name="slug"
                      required
                      placeholder="url-slug"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-content">本文（Markdown形式） *</Label>
                    <Textarea
                      id="create-content"
                      name="content"
                      required
                      rows={10}
                      placeholder="Markdown形式で記事本文を入力"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-excerpt">抜粋（一覧表示用）</Label>
                    <Textarea
                      id="create-excerpt"
                      name="excerpt"
                      rows={3}
                      placeholder="記事の抜粋を入力（省略可）"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-category">カテゴリー *</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリーを選択" />
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
                  <div>
                    <Label htmlFor="create-tags">タグ（カンマ区切り）</Label>
                    <Input
                      id="create-tags"
                      name="tags"
                      placeholder="タグ1, タグ2, タグ3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="create-status">公開ステータス *</Label>
                    <Select name="status" defaultValue="draft" required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">下書き</SelectItem>
                        <SelectItem value="published">公開</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      キャンセル
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? "作成中..." : "作成"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>検索</Label>
                  <Input
                    placeholder="タイトル・本文で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <Label>カテゴリー</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ステータス</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="すべて" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべて</SelectItem>
                      <SelectItem value="draft">下書き</SelectItem>
                      <SelectItem value="published">公開</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterStatus("all");
                }}
              >
                リセット
              </Button>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {posts?.map((post: any) => (
              <Card key={post.id} className="border-pink-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{post.title}</h3>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "公開" : "下書き"}
                        </Badge>
                        <Badge variant="outline" className="border-pink-300 text-pink-700">
                          {post.category}
                        </Badge>
                      </div>
                      {post.excerpt && (
                        <p className="text-muted-foreground mb-2">{post.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ja-JP") : "未公開"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.viewCount} 閲覧
                        </span>
                        {post.tags && (
                          <span className="flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            {post.tags}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {posts?.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  ブログ記事がありません
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ブログ記事編集</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">タイトル *</Label>
                <Input
                  id="edit-title"
                  name="title"
                  required
                  defaultValue={editingPost.title}
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">スラッグ（URL用） *</Label>
                <Input
                  id="edit-slug"
                  name="slug"
                  required
                  defaultValue={editingPost.slug}
                />
              </div>
              <div>
                <Label htmlFor="edit-content">本文（Markdown形式） *</Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  required
                  rows={10}
                  defaultValue={editingPost.content}
                />
              </div>
              <div>
                <Label htmlFor="edit-excerpt">抜粋（一覧表示用）</Label>
                <Textarea
                  id="edit-excerpt"
                  name="excerpt"
                  rows={3}
                  defaultValue={editingPost.excerpt || ""}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">カテゴリー *</Label>
                <Select name="category" required defaultValue={editingPost.category}>
                  <SelectTrigger>
                    <SelectValue />
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
              <div>
                <Label htmlFor="edit-tags">タグ（カンマ区切り）</Label>
                <Input
                  id="edit-tags"
                  name="tags"
                  defaultValue={editingPost.tags || ""}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">公開ステータス *</Label>
                <Select name="status" required defaultValue={editingPost.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="published">公開</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingPost(null);
                  }}
                >
                  キャンセル
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "更新中..." : "更新"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
