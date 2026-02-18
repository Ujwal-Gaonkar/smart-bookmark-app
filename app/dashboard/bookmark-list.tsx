"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { deleteBookmark, updateBookmark } from "./actions";
import { useToast } from "@/app/components/toast";
import { useConfirm } from "@/app/components/confirm-dialog";
import {
  Trash2,
  ExternalLink,
  Bookmark as BookmarkIcon,
  Pencil,
  Check,
  X,
  Search,
} from "lucide-react";
import type { Database } from "@/types/supabase";

type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

interface BookmarkListProps {
  userId: string;
}

const bookmarkEvents = {
  listeners: [] as (() => void)[],
  emit() {
    this.listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  },
};

export { bookmarkEvents };

export default function BookmarkList({ userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  const fetchBookmarks = useCallback(async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
    setLoading(false);
  }, [userId, supabase]);

  useEffect(() => {
    fetchBookmarks();

    const unsubscribeEvents = bookmarkEvents.subscribe(() => {
      fetchBookmarks();
    });

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("bookmark-updates");
      bc.onmessage = () => fetchBookmarks();
    } catch {}

    const handleFocus = () => fetchBookmarks();
    window.addEventListener("focus", handleFocus);

    return () => {
      unsubscribeEvents();
      bc?.close();
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;
    const q = searchQuery.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(q) || b.url.toLowerCase().includes(q)
    );
  }, [bookmarks, searchQuery]);

  const startEdit = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditUrl(bookmark.url);
    setEditTitle(bookmark.title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditUrl("");
    setEditTitle("");
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editUrl.trim() || !editTitle.trim()) {
      showToast("Title and URL are required", "error");
      return;
    }

    setSaving(true);
    const result = await updateBookmark(
      editingId,
      editUrl.trim(),
      editTitle.trim()
    );

    if (result.error) {
      showToast(result.error, "error");
      setSaving(false);
      return;
    }

    showToast("Bookmark updated successfully!", "success");
    setEditingId(null);
    setSaving(false);
    fetchBookmarks();
    try {
      new BroadcastChannel("bookmark-updates").postMessage("updated");
    } catch {}
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = await showConfirm({
      title: "Delete Bookmark",
      message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!confirmed) return;

    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const result = await deleteBookmark(id);
    if (result.error) {
      showToast("Failed to delete bookmark", "error");
      fetchBookmarks();
      return;
    }

    showToast("Bookmark deleted", "delete");
    try {
      new BroadcastChannel("bookmark-updates").postMessage("deleted");
    } catch {}
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-gray-800/50 border border-gray-700/40 rounded-xl animate-pulse"
          >
            <div className="h-4 w-48 bg-gray-700 rounded mb-2" />
            <div className="h-3 w-72 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Header with count + search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white whitespace-nowrap">
            Your Bookmarks
          </h2>
          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 rounded-full">
            {bookmarks.length}
          </span>
        </div>
        {bookmarks.length > 0 && (
          <div className="relative sm:ml-auto w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all"
            />
          </div>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-10 sm:py-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center">
            <BookmarkIcon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600" />
          </div>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            No bookmarks yet
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Add your first bookmark above to get started!
          </p>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div className="text-center py-10">
          <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            No bookmarks match &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="group p-3 sm:p-3.5 bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-gray-700/60 rounded-xl transition-all duration-200"
            >
              {editingId === bookmark.id ? (
                /* Edit Mode */
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                      placeholder="Bookmark title"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex items-start sm:items-center gap-3">
                  {/* Favicon */}
                  <div className="hidden sm:flex w-8 h-8 rounded-lg bg-gray-700/50 border border-gray-600/30 items-center justify-center flex-shrink-0">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`}
                      alt=""
                      className="w-4 h-4 rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 group/link"
                    >
                      <h3 className="text-sm sm:text-base font-semibold text-gray-200 group-hover/link:text-indigo-400 transition-colors truncate">
                        {bookmark.title}
                      </h3>
                      <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 group-hover/link:text-indigo-400 flex-shrink-0 transition-colors" />
                    </a>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {bookmark.url}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {new Date(bookmark.created_at).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(bookmark)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      title="Edit bookmark"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(bookmark.id, bookmark.title)
                      }
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
