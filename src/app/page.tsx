const foundations = [
  {
    label: "Application",
    value: "Next.js App Router and strict TypeScript",
  },
  {
    label: "Interface",
    value: "Tailwind CSS and local shadcn components",
  },
  {
    label: "Quality",
    value: "Storybook, Vitest, and Playwright",
  },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-between px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
      <section className="flex max-w-4xl flex-col gap-10 sm:gap-14">
        <p className="text-muted-foreground font-mono text-xs font-medium tracking-[0.16em] uppercase">
          Technical foundation · Stage 6
        </p>

        <div className="space-y-5">
          <h1 className="text-5xl leading-none font-semibold tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            ReSchuhe
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-8 sm:text-xl">
            The application foundation is ready. Product structure and visual identity will be
            introduced only after their source documents are approved.
          </p>
        </div>

        <dl className="bg-card grid overflow-hidden rounded-xl border sm:grid-cols-3">
          {foundations.map((foundation) => (
            <div
              className="space-y-3 border-b p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0"
              key={foundation.label}
            >
              <dt className="text-muted-foreground font-mono text-xs tracking-[0.12em] uppercase">
                {foundation.label}
              </dt>
              <dd className="text-card-foreground text-sm leading-6">{foundation.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="text-muted-foreground mt-16 border-t pt-5 text-sm">
        Technical shell only — not an approved product or brand design.
      </footer>
    </main>
  );
}
