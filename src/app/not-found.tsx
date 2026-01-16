"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search } from "lucide-react";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="w-full text-slate-200 flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-125 w-125 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative max-w-3xl w-full text-center">
        {/* 404 */}
        <h1 className="text-[90px] sm:text-[120px] font-black tracking-tight text-white drop-shadow">
          404
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-white">
          Page Not Found
        </p>

        <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Don&apos;t worry — you can go back or return to the dashboard.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm border border-slate-700 hover:border-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-white text-slate-950 font-semibold hover:bg-slate-200 transition"
          >
            <Home size={18} />
            Home
          </Link>

          <Link
            href="/onboarding"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-slate-900 border border-slate-800 hover:border-white/30 hover:text-white transition"
          >
            <Search size={18} />
            Explore Kanvix
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-10 text-xs text-slate-500">
          If you think this is a mistake, contact support:{" "}
          <a
            href="mailto:adityakashyap5047@gmail.com"
            className="text-slate-300 hover:text-white underline underline-offset-4"
          >
            adityakashyap5047@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;