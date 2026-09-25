export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex w-72 flex-col gap-4 p-6 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="h-10 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        <div className="space-y-3 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 p-8 space-y-8">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" style={{ animationDelay: '100ms' }} />
          </div>
          <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 h-40 animate-pulse"
              style={{ animationDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="flex justify-between mb-4">
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-10 w-10 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              </div>
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full mt-4" />
            </div>
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 h-96 animate-pulse" style={{ animationDelay: '600ms' }}>
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-8" />
            <div className="h-full w-full bg-slate-100 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 h-96 animate-pulse" style={{ animationDelay: '700ms' }}>
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-8" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
