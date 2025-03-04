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

  useEffect(() => {
    // ローカルストレージから投稿を読み込む
    const loadPosts = () => {
      const savedPosts = JSON.parse(
        localStorage.getItem("scheduledPosts") || "[]"
      );
      setPosts(savedPosts);
    };

    loadPosts();
    // ストレージの変更を監視
    window.addEventListener("storage", loadPosts);
    return () => window.removeEventListener("storage", loadPosts);
  }, []);

  const handleDelete = (id: number) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    localStorage.setItem("scheduledPosts", JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
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
                    {format(new Date(post.scheduledAt), "yyyy/MM/dd HH:mm", {
                      locale: ja,
                    })}
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
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      キャンセル
                    </Button>
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
