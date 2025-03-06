"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  mediaUrl: z.string().url("有効なURLを入力してください"),
  caption: z.string().min(1, "説明文を入力してください"),
  scheduleFor: z.string().min(1, "投稿日時を選択してください"),
});

export function SchedulePostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mediaUrl: "",
      caption: "",
      scheduleFor: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/instagram/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          scheduleFor: new Date(values.scheduleFor).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("投稿のスケジュールに失敗しました");
      }

      toast({
        title: "投稿がスケジュールされました",
        description: "指定した日時に自動的に投稿されます",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "エラー",
        description:
          error instanceof Error
            ? error.message
            : "予期せぬエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mediaUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>画像URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>説明文</FormLabel>
              <FormControl>
                <Textarea placeholder="投稿の説明文を入力" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduleFor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>投稿日時</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "送信中..." : "スケジュール"}
        </Button>
      </form>
    </Form>
  );
}
