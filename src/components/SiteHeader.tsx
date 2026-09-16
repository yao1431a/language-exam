import Link from "next/link";

export function SiteHeader({
  crumb,
}: {
  crumb?: { href: string; label: string }[];
}) {
  return (
    <header className="border-b border-[color:var(--line)]/70 bg-[color:var(--panel)]/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group">
          <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[color:var(--ink)]">
            语测馆
          </p>
          <p className="text-xs text-[color:var(--muted)] group-hover:text-[color:var(--accent)]">
            Language Exam Vault
          </p>
        </Link>
        {crumb && crumb.length > 0 && (
          <nav className="hidden text-sm text-[color:var(--muted)] sm:block">
            {crumb.map((item, index) => (
              <span key={item.href}>
                {index > 0 && <span className="mx-2 opacity-40">/</span>}
                <Link href={item.href} className="hover:text-[color:var(--accent)]">
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
