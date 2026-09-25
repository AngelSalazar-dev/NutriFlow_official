export default function AuthLoading() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 items-center justify-center">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center animate-pulse">
          <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mx-auto" />
      </div>
    </div>
  );
}
