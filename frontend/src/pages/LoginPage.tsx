import { useState } from "react";
import { login } from "../api/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { token } = await login(username, password);
      localStorage.setItem("jwt", token);
      window.location.href = "/";
    } catch (err) {
      setError("ログインに失敗しました");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold text-center">ログイン</h1>
        <input
          className="border rounded px-3 py-2"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="rounded px-3 py-2 border"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}