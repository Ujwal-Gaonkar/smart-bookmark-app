"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBookmark } from "./actions";
import { bookmarkEvents } from "./bookmark-list";
import { useToast } from "@/app/components/toast";
import { Plus, Loader2 } from "lucide-react";

export default function AddBookmarkForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    try {
      const result = await addBookmark(url.trim(), title.trim() || undefined);

      if (result.error) {
        setError(result.error);
        showToast(result.error, "error");
        return;
      }

      setUrl("");
      setTitle("");
      showToast("Bookmark added successfully!", "success");
      bookmarkEvents.emit();
      try {
        new BroadcastChannel("bookmark-updates").postMessage("added");
      } catch {}
      router.refresh();
    } catch {
      setError("Failed to add bookmark. Please try again.");
      showToast("Failed to add bookmark", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
        <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
        Add New Bookmark
      </h2>

      {error && (
        <div className="p-2.5 sm:p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="flex-1">
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste URL here..."
            required
            className="w-full px-3.5 py-2.5 text-sm bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
        <div className="sm:w-48">
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="w-full px-3.5 py-2.5 text-sm bg-gray-800/80 border border-gray-700/60 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:from-indigo-700 active:to-purple-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add
            </>
          )}
        </button>
      </div>
    </form>
  );
}
