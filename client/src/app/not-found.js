'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-[120px] font-bold text-gray-100 dark:text-gray-800 leading-none select-none">
          404
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 bg-[#0A84FF] text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-all duration-200"
          >
            Go Home
          </Link>
          <button
            onClick={() => history.back()}
            className="inline-flex items-center px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
