"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { ja } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useUploadThing } from "@/lib/uploadthing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface PostFormData {
  image: string;
  caption: string;
  scheduledDate: string;
  scheduledTime: string;
}

export function PostForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  const [formData, setFormData] = useState<PostFormData>({
    image: "",
    caption: "",
    scheduledDate: "",
    scheduledTime: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImagePreview(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.scheduledDate || !formData.scheduledTime || !selectedFile) {
      alert("日時と画像は必須です");
      return;
    }

    if (!session?.user) {
      alert("ログインが必要です");
      return;
    }

    setIsSubmitting(true);
    try {
      // 画像をアップロード
      const uploadResult = await startUpload([selectedFile]);
      if (!uploadResult) {
        throw new Error("画像のアップロードに失敗しました");
      }

      // 日付と時間を組み合わせてDateオブジェクトを作成
      const [year, month, day] = formData.scheduledDate
        .split("T")[0]
        .split("-");
      const [hours, minutes] = formData.scheduledTime.split(":");
      const scheduledDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      // 投稿を作成
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caption: formData.caption,
          imageUrl: uploadResult[0].url,
          scheduledAt: scheduledDateTime.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("投稿の作成に失敗しました");
      }

      // フォームをリセット
      setFormData({
        image: "",
        caption: "",
        scheduledDate: "",
        scheduledTime: "",
      });
      setImagePreview(null);
      setSelectedFile(null);

      alert("投稿がスケジュールされました");
      router.refresh();
    } catch (error) {
      console.error("投稿の保存に失敗しました:", error);
      alert("投稿の保存に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = {
    before: new Date(),
  };

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ログインが必要です</CardTitle>
          <CardDescription>
            投稿を作成するにはログインしてください
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>新規投稿作成</CardTitle>
        <CardDescription>
          投稿内容とスケジュールを設定してください
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="caption">キャプション</Label>
            <Textarea
              id="caption"
              placeholder="投稿のキャプションを入力してください..."
              className="min-h-[100px]"
              value={formData.caption}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, caption: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>画像アップロード</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageInput"
                onChange={handleImageChange}
              />
              {!imagePreview ? (
                <label htmlFor="imageInput">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <div className="flex items-center justify-center">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      画像を選択
                    </div>
                  </Button>
                </label>
              ) : (
                <div className="space-y-2">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={imagePreview}
                      alt="プレビュー"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setImagePreview(null);
                      setSelectedFile(null);
                    }}
                  >
                    画像を削除
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>投稿日時</Label>
            <div className="border rounded-md p-4">
              <DayPicker
                mode="single"
                selected={
                  formData.scheduledDate
                    ? new Date(formData.scheduledDate)
                    : undefined
                }
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: date ? date.toISOString() : "",
                  }))
                }
                locale={ja}
                disabled={disabledDays}
                showOutsideDays={false}
                className="mx-auto"
              />
              <div className="mt-4">
                <Label htmlFor="scheduledTime">時間</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduledTime: e.target.value,
                    }))
                  }
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              "スケジュール投稿を作成"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
