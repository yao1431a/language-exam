import Link from "next/link";

const NAV = [
  { href: "/", label: "今日" },
  { href: "/vocab", label: "词汇" },
  { href: "/speak", label: "口语" },
  { href: "/notes", label: "句本" },
  { href: "/toolbox", label: "工具箱" },
  { href: "/settings", label: "设置" },
];

export function SiteHeader({
  crumb,
}: {
  crumb?: { href: string; label: string }[];
}) {
  return (
    <header className="border-b border-[color:var(--line)]/70 bg-[color:var(--panel)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group">
            <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[color:var(--ink)]">
              语力馆
            </p>
            <p className="text-xs text-[color:var(--muted)] group-hover:text-[color:var(--accent)]">
              Fluency Lab · IELTS 7+
            </p>
          </Link>
          {crumb && crumb.length > 0 && (
            <nav className="hidden text-sm text-[color:var(--muted)] md:block">
              {crumb.map((item, index) => (
                <span key={`${item.href}-${item.label}`}>
                  {index > 0 && <span className="mx-2 opacity-40">/</span>}
                  <Link href={item.href} className="hover:text-[color:var(--accent)]">
                    {item.label}
                  </Link>
                </span>
              ))}
            </nav>
          )}
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-[color:var(--muted)] transition hover:bg-[color:var(--accent-soft)] hover:text-[color:var(--accent)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
