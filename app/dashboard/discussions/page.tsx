"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";

interface PostDto {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  user: { username: string };
  _count: { comments: number };
}

export default function DiscussionsPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ posts: PostDto[] }>("/discussions", token)
      .then((res) => setPosts(res.posts))
      .catch(() => setPosts([]));

    const socket = getSocket(token);
    socket.emit("post:join", "global");
    function handleNewPost(post: PostDto) {
      setPosts((prev) => [post, ...prev]);
    }
    socket.on("discussion:new-post", handleNewPost);
    return () => {
      socket.off("discussion:new-post", handleNewPost);
    };
  }, [token]);

  async function createPost() {
    setError(null);
    if (!title.trim() || !body.trim()) {
      setError("Add a title and a few words before posting.");
      return;
    }
    try {
      await api.post("/discussions", { title, body }, token);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't publish that post.");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase text-chalk">Fan Discussions</h1>
      <p className="mt-1 font-body text-chalk/60">Talk tactics — new posts appear live for everyone here.</p>

      <div className="mt-6 space-y-2 rounded-lg border border-pitch-700/40 bg-pitch-900/60 p-5">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-md border border-pitch-700/50 bg-pitch-900 px-3 py-2 font-body text-chalk outline-none focus:border-gold-500"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What did you think of that match?"
          rows={3}
          className="w-full rounded-md border border-pitch-700/50 bg-pitch-900 px-3 py-2 font-body text-chalk outline-none focus:border-gold-500"
        />
        {error && <p className="font-body text-sm text-live">{error}</p>}
        <button
          onClick={createPost}
          className="rounded-md bg-gold-500 px-4 py-2 font-display text-sm font-semibold uppercase text-ink hover:bg-gold-600"
        >
          Post
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="rounded-lg border border-pitch-700/40 bg-pitch-900/60 p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-chalk">{p.title}</h2>
              <span className="font-body text-xs text-chalk/40">{p._count.comments} replies</span>
            </div>
            <p className="mt-1 font-body text-sm text-chalk/70">{p.body}</p>
            <p className="mt-2 font-body text-xs text-chalk/40">— {p.user.username}</p>
          </div>
        ))}
        {posts.length === 0 && <p className="font-body text-chalk/50">No posts yet — start the conversation.</p>}
      </div>
    </div>
  );
}
