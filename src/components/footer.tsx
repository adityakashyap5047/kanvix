import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 mt-10 border-t border-slate-800">
      {/* Top CTA */}
      <div className="border-b border-slate-800">
        <div className="container max-w-[90%] mx-auto px-4 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Manage projects smarter with <Image src="/kanvix/kanvix_rect.png" alt="Kanvix" width={100} height={20} className="inline-block mb-1" />
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Plan sprints, manage issues, track progress, and ship faster — all in one place.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/project"
              className="px-5 py-2 rounded-sm bg-white text-slate-950 font-medium hover:bg-slate-200 transition"
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="px-5 py-2 rounded-sm border border-slate-700 hover:border-slate-400 hover:text-white transition"
            >
              Documentation
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container max-w-[90%] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* BRAND */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image src="/kanvix/kanvix.png" height={40} width={40} alt="Kanvix Logo" />
              <Image
                src="/kanvix/kanvix_rect_line.png"
                height={40}
                width={120}
                alt="Kanvix Logo Text"
              />
            </div>

            <p className="text-sm text-slate-400 mt-4 max-w-md leading-relaxed">
              Kanvix is a modern sprint & project management tool built for teams and individuals.
              Organize tasks, track progress and ship better products — faster.
            </p>

            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://github.com/adityakashyap5047"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-800 hover:border-white/40 hover:text-white transition"
              >
                <Github size={18} />
              </a>

              <a
                href="https://www.linkedin.com/in/adityakashyap5047"
                className="p-2 rounded-lg border border-slate-800 hover:border-white/40 hover:text-white transition"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="mailto:adityakashyap5047@gmail.com"
                className="p-2 rounded-lg border border-slate-800 hover:border-white/40 hover:text-white transition"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* PRODUCT */}
          <div
            className="
              lg:border-l lg:border-white/10 lg:pl-8
              md:col-start-2 md:row-start-1
              xs:col-start-1 xs:row-start-2

              lg:col-start-3 lg:row-start-1
            "
          >
            <h4 className="font-semibold text-white mb-4">
              Product
              <span className="block w-14 h-0.5 bg-white/30 rounded-full mt-2"></span>
            </h4>

            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-white transition" href="/features">
                  Features
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" href="/pricing">
                  Pricing
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" href="/roadmap">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" href="/changelog">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div
            className="
              lg:border-l lg:border-white/10 lg:pl-8
              md:col-start-1 md:row-start-2
              xs:col-start-2 xs:row-start-2

              lg:col-start-4 lg:row-start-1
            "
          >
            <h4 className="font-semibold text-white mb-4">
              Company
              <span className="block w-16 h-0.5 bg-white/30 rounded-full mt-2"></span>
            </h4>

            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link className="hover:text-white transition" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" href="/careers">
                  Careers
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" href="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="hover:text-white transition" href="/blog">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* STAY UPDATED */}
          <div
            className="
              lg:border-l lg:border-white/10 lg:pl-8
              sm:col-span-2
              md:col-span-1
              md:col-start-2 md:row-start-2
              sm:col-start-1 sm:row-start-3

              lg:col-span-1 lg:col-start-5 lg:row-start-1
            "
          >
            <h4 className="font-semibold text-white mb-4">
              Stay Updated
              <span className="block w-24 h-0.5 bg-white/30 rounded-full mt-2"></span>
            </h4>

            <p className="text-sm text-slate-400 mb-4">
              Subscribe for updates, releases & sprint productivity tips.
            </p>

            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-sm bg-slate-900 border border-slate-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              />

              <button
                type="button"
                className="rounded-sm cursor-pointer bg-white text-slate-950 py-2 text-sm font-semibold hover:bg-slate-200 transition"
              >
                Subscribe
              </button>
            </form>

            <p className="text-[11px] text-slate-500 mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container max-w-[90%] mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Kanvix. All rights reserved.</p>

          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/security" className="hover:text-white transition">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
