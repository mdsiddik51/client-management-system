import React from 'react';
import Link from 'next/link';
import { Layers, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-gray-900 dark:text-white">
              <div className="w-8 h-8 rounded-xl bg-[#0A84FF] flex items-center justify-center text-white shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
              <span className="tracking-tight text-xl font-bold">ClientHub</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Apple-inspired client management for high-performing teams, consultancies, and modern agencies.
            </p>
            <div className="flex items-center gap-3 text-gray-400">
              <a href="#" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="#features" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions / Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Agencies
                </span>
              </li>
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Freelancers & Consultancies
                </span>
              </li>
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Software Teams
                </span>
              </li>
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Enterprise Portals
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Security
                </span>
              </li>
              <li>
                <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors">
                  Compliance
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div>© {new Date().getFullYear()} ClientHub Inc. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span>Designed with macOS aesthetics</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
