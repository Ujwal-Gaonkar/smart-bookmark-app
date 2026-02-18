import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 px-4 py-8 overflow-hidden relative">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Giant 404 */}
        <div className="relative mb-6 sm:mb-8">
          <h1 className="text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
              404
            </h2>
          </div>
        </div>

        {/* Broken bookmark icon */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <div className="relative">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-400/80 w-12 h-12 sm:w-14 sm:h-14"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
              <path d="m9 9.5 2 2 4-4" opacity="0.4" />
            </svg>
            {/* Crack line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-400/60 to-transparent rotate-[-25deg] translate-y-1" />
            </div>
          </div>
        </div>

        {/* Message */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
          Page Not Found
        </h3>
        <p className="text-sm sm:text-base text-gray-400 mb-8 sm:mb-10 max-w-sm mx-auto leading-relaxed">
          Looks like this bookmark leads nowhere. The page you&apos;re looking
          for doesn&apos;t exist or has been moved.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:from-indigo-700 active:to-purple-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go to Dashboard
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 active:bg-white/15 text-gray-300 hover:text-white text-sm sm:text-base font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Subtle footer */}
        <p className="mt-10 sm:mt-14 text-xs text-gray-600">
          Smart Bookmarks
        </p>
      </div>
    </div>
  );
}
