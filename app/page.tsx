"use client";

import { PostForm } from "@/components/post-form";
import { ScheduledPosts } from "@/components/scheduled-posts";
import { Header } from "@/components/header";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        {status === "loading" ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse">読み込み中...</div>
          </div>
        ) : !session ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>ログインが必要です</CardTitle>
              <CardDescription>
                投稿をスケジュールするにはログインが必要です
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => signIn("google")}>
                Googleでログイン
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PostForm />
            <ScheduledPosts />
          </div>
        )}
      </main>
    </div>
  );
}
