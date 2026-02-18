import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800/60 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Authentication Error
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            There was an error during authentication. Please try again.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
