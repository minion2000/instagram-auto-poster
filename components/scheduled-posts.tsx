"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Pencil, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";

interface ScheduledPost {
  id: number;
  caption: string;
  imageUrl: string;
  scheduledAt: string;
  status: "pending" | "posted" | "error";
}

export function ScheduledPosts() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  const loadPosts = () => {
    try {
      const savedPosts = JSON.parse(
        localStorage.getItem("scheduledPosts") || "[]"
      );
      setPosts(savedPosts);
    } catch (error) {
      console.error("投稿の読み込みに失敗しました:", error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return format(new Date(), "yyyy/MM/dd HH:mm", { locale: ja });
      }
      return format(date, "yyyy/MM/dd HH:mm", { locale: ja });
    } catch (error) {
      console.error("日付のフォーマットに失敗しました:", error);
      return format(new Date(), "yyyy/MM/dd HH:mm", { locale: ja });
    }
  };

  const formatDateForInput = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return format(new Date(), "yyyy-MM-dd'T'HH:mm", { locale: ja });
      }
      return format(date, "yyyy-MM-dd'T'HH:mm", { locale: ja });
    } catch (error) {
      console.error("日付のフォーマットに失敗しました:", error);
      return format(new Date(), "yyyy-MM-dd'T'HH:mm", { locale: ja });
    }
  };

  useEffect(() => {
    loadPosts();

    // 1秒ごとに投稿一覧を更新
    const interval = setInterval(loadPosts, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleDelete = (id: number) => {
    try {
      // 現在の投稿一覧を取得
      const currentPosts = JSON.parse(
        localStorage.getItem("scheduledPosts") || "[]"
      );
      // 指定されたIDの投稿を除外
      const updatedPosts = currentPosts.filter(
        (post: ScheduledPost) => post.id !== id
      );
      // 更新された投稿一覧を保存
      localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts));
      // 状態を更新
      setPosts(updatedPosts);
    } catch (error) {
      console.error("投稿の削除に失敗しました:", error);
      alert("投稿の削除に失敗しました");
    }
  };

  const handleUpdate = (post: ScheduledPost) => {
    try {
      // 現在の投稿一覧を取得
      const currentPosts = JSON.parse(
        localStorage.getItem("scheduledPosts") || "[]"
      );
      // 指定されたIDの投稿を更新
      const updatedPosts = currentPosts.map((p: ScheduledPost) =>
        p.id === post.id ? post : p
      );
      // 更新された投稿一覧を保存
      localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts));
      // 状態を更新
      setPosts(updatedPosts);
      setEditingPost(null);
    } catch (error) {
      console.error("投稿の更新に失敗しました:", error);
      alert("投稿の更新に失敗しました");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>スケジュール済み投稿</CardTitle>
        <CardDescription>予約済みの投稿一覧</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">
              予約済みの投稿はありません
            </p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    {formatDate(post.scheduledAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        post.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : post.status === "posted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {post.status === "pending"
                        ? "待機中"
                        : post.status === "posted"
                        ? "投稿済み"
                        : "エラー"}
                    </span>
                    {post.status === "pending" && (
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPost(post)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="dialog-content">
                            <DialogHeader className="dialog-header">
                              <div className="flex items-center justify-between">
                                <DialogTitle className="dialog-title">
                                  投稿を編集
                                </DialogTitle>
                                <DialogClose asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setEditingPost(null)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </DialogClose>
                              </div>
                              <DialogDescription className="dialog-description">
                                投稿内容を編集できます
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="form-group">
                                <Label>キャプション</Label>
                                <Textarea
                                  value={editingPost?.caption || ""}
                                  onChange={(e) =>
                                    setEditingPost((prev) =>
                                      prev
                                        ? { ...prev, caption: e.target.value }
                                        : null
                                    )
                                  }
                                  className="min-h-[100px] bg-background"
                                />
                              </div>
                              <div className="form-group">
                                <Label>投稿日時</Label>
                                <Input
                                  type="datetime-local"
                                  value={formatDateForInput(
                                    editingPost?.scheduledAt ||
                                      new Date().toISOString()
                                  )}
                                  onChange={(e) =>
                                    setEditingPost((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            scheduledAt: new Date(
                                              e.target.value
                                            ).toISOString(),
                                          }
                                        : null
                                    )
                                  }
                                  className="bg-background"
                                />
                              </div>
                              <div className="form-group">
                                <Label>現在の画像</Label>
                                <div className="relative w-full h-[200px] bg-background rounded-lg overflow-hidden">
                                  {post.imageUrl && (
                                    <Image
                                      src={post.imageUrl}
                                      alt={post.caption}
                                      width={300}
                                      height={300}
                                      className="rounded-lg object-cover"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4 border-t">
                              <DialogClose asChild>
                                <Button variant="outline">キャンセル</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  onClick={() => {
                                    if (editingPost) {
                                      handleUpdate(editingPost);
                                    }
                                  }}
                                >
                                  更新
                                </Button>
                              </DialogClose>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    削除
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="alert-dialog-content">
                                  <AlertDialogHeader className="alert-dialog-header">
                                    <AlertDialogTitle className="alert-dialog-title">
                                      投稿を削除
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="alert-dialog-description">
                                      この投稿を削除してもよろしいですか？
                                      この操作は取り消せません。
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="mt-4 border-t pt-4">
                                    <div className="flex items-start space-x-4">
                                      {post.imageUrl && (
                                        <Image
                                          src={post.imageUrl}
                                          alt={post.caption}
                                          width={300}
                                          height={300}
                                          className="w-20 h-20 object-cover rounded"
                                        />
                                      )}
                                      <div>
                                        <p className="text-sm font-medium text-foreground">
                                          {formatDate(post.scheduledAt)}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                          {post.caption}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <AlertDialogFooter className="alert-dialog-footer">
                                    <AlertDialogCancel className="bg-background hover:bg-accent hover:text-accent-foreground">
                                      キャンセル
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDelete(post.id)}
                                    >
                                      削除
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="alert-dialog-content">
                            <AlertDialogHeader className="alert-dialog-header">
                              <AlertDialogTitle className="alert-dialog-title">
                                投稿を削除
                              </AlertDialogTitle>
                              <AlertDialogDescription className="alert-dialog-description">
                                この投稿を削除してもよろしいですか？
                                この操作は取り消せません。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="mt-4 border-t pt-4">
                              <div className="flex items-start space-x-4">
                                {post.imageUrl && (
                                  <Image
                                    src={post.imageUrl}
                                    alt={post.caption}
                                    width={300}
                                    height={300}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {formatDate(post.scheduledAt)}
                                  </p>
                                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {post.caption}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <AlertDialogFooter className="alert-dialog-footer">
                              <AlertDialogCancel className="bg-background hover:bg-accent hover:text-accent-foreground">
                                キャンセル
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDelete(post.id)}
                              >
                                削除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.caption}
                      width={300}
                      height={300}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <p className="text-sm line-clamp-3">{post.caption}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
