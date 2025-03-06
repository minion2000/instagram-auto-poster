import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

async function getPosts() {
  return await prisma.instagramPost.findMany({
    orderBy: {
      scheduleFor: "asc",
    },
  });
}

export async function PostList() {
  const posts = await getPosts();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>画像</TableHead>
            <TableHead>説明文</TableHead>
            <TableHead>投稿予定日時</TableHead>
            <TableHead>ステータス</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <img
                  src={post.mediaUrl}
                  alt="投稿画像"
                  className="h-16 w-16 object-cover rounded"
                />
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {post.caption}
              </TableCell>
              <TableCell>
                {format(post.scheduleFor, "yyyy/MM/dd HH:mm")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    post.status === "POSTED"
                      ? "success"
                      : post.status === "FAILED"
                      ? "destructive"
                      : "default"
                  }
                >
                  {post.status === "POSTED"
                    ? "投稿済み"
                    : post.status === "FAILED"
                    ? "失敗"
                    : "待機中"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
