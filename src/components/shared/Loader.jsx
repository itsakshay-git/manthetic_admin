
export default function Loader() {
  return (
    <div className="flex h-screen animate-pulse bg-muted">
      <aside className="w-[220px] bg-gray-200 dark:bg-muted border-r border-gray-300 dark:border-muted-foreground p-4 space-y-4">
        <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto" />
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-300 rounded w-full" />
        ))}
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-gray-100 dark:bg-background border-b border-gray-300 dark:border-muted-foreground px-4 flex items-center justify-between">
          <div className="h-6 w-40 bg-gray-300 rounded" />
          <div className="h-8 w-8 bg-gray-300 rounded-full" />
        </header>
        <main className="flex-1 p-6 space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3" />
          <div className="grid grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-gray-300 rounded-lg w-full" />
        </main>
      </div>
    </div>
  );
}
