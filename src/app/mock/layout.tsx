import { Suspense } from "react";

export default function MockLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-600">
          加载中...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
