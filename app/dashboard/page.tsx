import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BookmarkList from "./bookmark-list";
import AddBookmarkForm from "./add-bookmark-form";
import LogoutButton from "./logout-button";
import { DashboardProviders } from "./providers";
import { WelcomeToast } from "./welcome-toast";
import { Bookmark } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardProviders>
      <WelcomeToast />
      <div className="min-h-screen bg-gray-950">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Header */}
          <div className="mb-5 sm:mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex items-center gap-3">
              <div className="hidden sm:flex w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
                <Bookmark className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                  My Bookmarks
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>

          {/* Add Bookmark Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-5">
            <AddBookmarkForm />
          </div>

          {/* Bookmarks List Card */}
          <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <BookmarkList userId={user.id} />
          </div>
        </div>
      </div>
    </DashboardProviders>
  );
}
