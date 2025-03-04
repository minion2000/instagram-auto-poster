import { PostForm } from "@/components/post-form";
import { ScheduledPosts } from "@/components/scheduled-posts";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Instagram 投稿スケジューラー</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PostForm />
        <ScheduledPosts />
      </div>
    </main>
  );
}
