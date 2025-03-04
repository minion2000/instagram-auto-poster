"use client";

import { useState } from "react";
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
import { ImageIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface PostFormData {
  caption: string;
  imageFile: File | null;
  scheduledDate: Date | undefined;
  scheduledTime: string;
}

export function PostForm() {
  const [formData, setFormData] = useState<PostFormData>({
    caption: "",
    imageFile: null,
    scheduledDate: undefined,
    scheduledTime: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.scheduledDate ||
      !formData.scheduledTime ||
      !formData.imageFile
    ) {
      alert("日時と画像は必須です");
      return;
    }

    setIsSubmitting(true);
    try {
      // ここでローカルストレージに保存
      const scheduledPosts = JSON.parse(
        localStorage.getItem("scheduledPosts") || "[]"
      );
      const newPost = {
        id: Date.now(),
        caption: formData.caption,
        imageUrl: imagePreview,
        scheduledAt: new Date(
          formData.scheduledDate.getFullYear(),
          formData.scheduledDate.getMonth(),
          formData.scheduledDate.getDate(),
          parseInt(formData.scheduledTime.split(":")[0]),
          parseInt(formData.scheduledTime.split(":")[1])
        ).toISOString(),
        status: "pending",
      };
      scheduledPosts.push(newPost);
      localStorage.setItem("scheduledPosts", JSON.stringify(scheduledPosts));

      // フォームをリセット
      setFormData({
        caption: "",
        imageFile: null,
        scheduledDate: undefined,
        scheduledTime: "",
      });
      setImagePreview(null);
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
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="プレビュー"
                    className="max-h-[200px] mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, imageFile: null }));
                    }}
                  >
                    画像を削除
                  </Button>
                </div>
              ) : (
                <label htmlFor="imageInput">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <div>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      画像を選択
                    </div>
                  </Button>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>投稿日時</Label>
            <div className="border rounded-md p-4">
              <DayPicker
                mode="single"
                selected={formData.scheduledDate}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledDate: date || undefined,
                  }))
                }
                locale={ja}
                disabled={disabledDays}
                showOutsideDays={false}
                className="mx-auto"
              />
            </div>
            <div className="mt-2">
              <Input
                type="time"
                className="w-full"
                value={formData.scheduledTime}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    scheduledTime: e.target.value,
                  }))
                }
              />
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
