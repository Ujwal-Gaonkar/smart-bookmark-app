import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import { LoginProviders } from "./providers";
import { Bookmark, Sparkles, Globe, Shield } from "lucide-react";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <LoginProviders>
      <div className="min-h-screen flex bg-gray-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
        </div>

        {/* Left side — branding (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center relative px-12">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Smart Bookmarks
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
              Your links,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                organized.
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed">
              Save, organize, and access your favorite links from anywhere.
              Simple, fast, and beautifully designed.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: Globe,
                  title: "Access Anywhere",
                  desc: "Your bookmarks sync across all your devices",
                },
                {
                  icon: Sparkles,
                  title: "Smart Organization",
                  desc: "Auto-validates links so you never save a broken URL",
                },
                {
                  icon: Shield,
                  title: "Secure & Private",
                  desc: "Your data is protected with row-level security",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <feature.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {feature.title}
                    </p>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side — login form */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 relative z-10">
          <div className="w-full max-w-sm sm:max-w-md">
            {/* Mobile branding */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Bookmark className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Smart Bookmarks
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Save, organize, and access your favorite links
              </p>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
                  Welcome back
                </h2>
                <p className="text-sm text-gray-500">
                  Sign in to continue to your bookmarks
                </p>
              </div>
              <LoginForm />
            </div>

            <p className="text-center text-xs text-gray-600 mt-6">
              Secure authentication powered by Google
            </p>
          </div>
        </div>
      </div>
    </LoginProviders>
  );
}
