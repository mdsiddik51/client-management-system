export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <div className="space-y-6 w-full max-w-sm px-4">
        {/* Logo skeleton */}
        <div className="flex justify-center">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
        {/* Content skeletons */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-4/5" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse w-3/5" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl animate-pulse" />
          <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl animate-pulse" />
          <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl animate-pulse" />
          <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
