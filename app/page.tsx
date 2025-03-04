import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Instagram 投稿スケジューラー</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 投稿作成フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>新規投稿作成</CardTitle>
            <CardDescription>
              投稿内容とスケジュールを設定してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="caption">キャプション</Label>
                <Textarea
                  id="caption"
                  placeholder="投稿のキャプションを入力してください..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>画像アップロード</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Button variant="outline" className="w-full">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    画像を選択
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>投稿日時</Label>
                <Calendar mode="single" className="rounded-md border" />
                <div className="mt-2">
                  <Input type="time" className="w-full" />
                </div>
              </div>

              <Button className="w-full">スケジュール投稿を作成</Button>
            </div>
          </CardContent>
        </Card>

        {/* スケジュール済み投稿一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>スケジュール済み投稿</CardTitle>
            <CardDescription>予約済みの投稿一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* プレースホルダー投稿 */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">
                    2024/03/15 09:00
                  </span>
                  <Button variant="destructive" size="sm">
                    キャンセル
                  </Button>
                </div>
                <p className="text-sm line-clamp-2">
                  サンプル投稿のキャプションです...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
