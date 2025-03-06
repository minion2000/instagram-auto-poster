import { Suspense } from "react";
import { SchedulePostForm } from "@/components/instagram/schedule-post-form";
import { PostList } from "@/components/instagram/post-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InstagramPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>新規投稿のスケジュール</CardTitle>
          </CardHeader>
          <CardContent>
            <SchedulePostForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>スケジュール済み投稿</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <PostList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
