import { AuthButton } from "./auth-button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Instagram 投稿スケジューラー</h1>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
