"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button disabled variant="outline">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        読み込み中...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {session.user?.name} としてログイン中
        </p>
        <Button variant="outline" onClick={() => signOut()}>
          ログアウト
        </Button>
      </div>
    );
  }

  return (
    <Button variant="default" onClick={() => signIn("google")}>
      Googleでログイン
    </Button>
  );
}
