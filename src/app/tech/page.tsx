import {
  Code2,
  Database,
  FileCode2,
  GitCommit,
  Layers,
  LayoutDashboard,
  Lock,
  Server,
  TestTube2,
  Zap,
  BookOpen,
  Cpu,
  Palette,
  Shield,
  Box,
} from "lucide-react";

const stats = [
  { label: "Lines of Code", value: "15,556", sublabel: "TypeScript/TSX", icon: Code2 },
  { label: "Source Files", value: "134", sublabel: ".ts and .tsx files", icon: FileCode2 },
  { label: "Components", value: "60+", sublabel: "React components", icon: LayoutDashboard },
  { label: "Server Actions", value: "12", sublabel: "Secure API endpoints", icon: Server },
  { label: "Database Models", value: "12", sublabel: "Prisma schema", icon: Database },
  { label: "Unit Tests", value: "113", sublabel: "Across 7 test suites", icon: TestTube2 },
  { label: "Feature Modules", value: "5", sublabel: "Domain-driven modules", icon: Layers },
  { label: "Documentation", value: "1,561", sublabel: "Lines across 15 docs", icon: BookOpen },
  { label: "Git Commits", value: "15", sublabel: "Since Mar 6, 2026", icon: GitCommit },
];

const estimatedTokens = {
  total: "~4.5M",
  breakdown: [
    { label: "Code generation & iteration", value: "~2.5M" },
    { label: "Architecture & planning", value: "~800K" },
    { label: "Debugging & testing", value: "~600K" },
    { label: "Documentation", value: "~400K" },
    { label: "Code review & refactoring", value: "~200K" },
  ],
};

const toolsUsed = [
  {
    category: "AI Development",
    icon: Cpu,
    tools: [
      { name: "Claude Code (CLI)", description: "AI-powered development assistant — primary tool for all code generation, architecture, and iteration" },
      { name: "Claude Opus 4", description: "Large language model powering code generation, planning, and review" },
    ],
  },
  {
    category: "Framework & Runtime",
    icon: Zap,
    tools: [
      { name: "Next.js 14.2", description: "React framework with App Router, server components, and server actions" },
      { name: "React 18", description: "UI library with hooks, context, and Suspense" },
      { name: "TypeScript 5", description: "Strict mode type safety across the entire codebase" },
      { name: "Node.js", description: "JavaScript runtime for server-side execution" },
    ],
  },
  {
    category: "Styling & Design",
    icon: Palette,
    tools: [
      { name: "Tailwind CSS v3", description: "Utility-first CSS framework with custom theme" },
      { name: "shadcn/ui", description: "Headless component primitives (new-york style)" },
      { name: "Radix UI", description: "Accessible primitives for dialogs, alerts, dropdowns" },
      { name: "Lucide React", description: "Icon library used throughout the interface" },
      { name: "next-themes", description: "Dark/light mode with system preference detection" },
      { name: "class-variance-authority", description: "Component variant management" },
    ],
  },
  {
    category: "Data & State",
    icon: Database,
    tools: [
      { name: "Prisma 5", description: "Type-safe ORM with migrations, seeding, and transactions" },
      { name: "Zustand", description: "Lightweight client-side state management" },
      { name: "React Hook Form", description: "Performant form handling with controlled inputs" },
      { name: "Zod", description: "Runtime schema validation for forms, APIs, and server actions" },
      { name: "date-fns", description: "Date manipulation and formatting utilities" },
    ],
  },
  {
    category: "Auth & Security",
    icon: Shield,
    tools: [
      { name: "NextAuth.js v5 (beta)", description: "JWT-based authentication with Credentials providers" },
      { name: "bcryptjs", description: "Password hashing with salt rounds for all stored credentials" },
      { name: "Custom rate limiter", description: "In-memory sliding window (5 attempts / 15 min)" },
      { name: "Role-based middleware", description: "Route protection for Organizer, Judge, and Captain roles" },
    ],
  },
  {
    category: "Testing & Quality",
    icon: TestTube2,
    tools: [
      { name: "Vitest", description: "Fast unit testing framework with 113 tests across 7 suites" },
      { name: "ESLint", description: "Code linting with Next.js configuration" },
      { name: "E2E simulation script", description: "Full competition lifecycle with 2,000+ assertions" },
    ],
  },
  {
    category: "Dev Tooling",
    icon: Box,
    tools: [
      { name: "tsx", description: "TypeScript execution for scripts and seeding" },
      { name: "PostCSS", description: "CSS processing pipeline for Tailwind" },
      { name: "dotenv", description: "Environment variable management" },
    ],
  },
];

const integrations = [
  {
    name: "Supabase",
    description: "Managed PostgreSQL database hosting",
    details: "Provides the production Postgres instance with connection pooling. Used via Prisma ORM with both pooled (DATABASE_URL) and direct (DIRECT_URL) connections.",
    color: "bg-emerald-500",
  },
  {
    name: "Vercel",
    description: "Deployment & hosting platform",
    details: "Next.js-optimized hosting with edge middleware, server-side rendering, and automatic preview deployments for pull requests.",
    color: "bg-slate-800 dark:bg-slate-200",
  },
  {
    name: "GitHub",
    description: "Source control & collaboration",
    details: "Git repository hosting with pull request workflows, code review, and CI integration. 15 commits across the project lifecycle.",
    color: "bg-slate-700 dark:bg-slate-300",
  },
  {
    name: "Prisma (Cloud Schema)",
    description: "Database toolkit & migrations",
    details: "Type-safe database client generation, schema migrations, and development seeding. 12 models with full relational mapping.",
    color: "bg-indigo-500",
  },
  {
    name: "NextAuth.js",
    description: "Authentication framework",
    details: "JWT-based auth with two Credentials providers (Judge: CBJ+PIN, Organizer: email+password). 24-hour token expiry with role-based access control.",
    color: "bg-violet-500",
  },
];

export default function TechPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Code2 className="h-8 w-8 text-red-600 dark:text-red-500" />
            <span className="text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Technical Overview
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            BBQ Judge — Under the Hood
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            A KCBS competition judging platform built entirely with AI-assisted
            development. Every line of code, every architectural decision, and
            every test was crafted through collaboration with Claude.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Stats Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">By the Numbers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex items-start gap-4"
              >
                <div className="p-2 rounded-md bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-500 shrink-0">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {stat.sublabel}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Token Estimation */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Estimated Token Usage</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Approximate Claude API tokens consumed during development of this project.
          </p>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-red-600 dark:text-red-500">
                {estimatedTokens.total}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                total tokens (input + output)
              </span>
            </div>
            <div className="space-y-3">
              {estimatedTokens.breakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {item.label}
                  </span>
                  <span className="text-sm font-mono font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Used */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Tools & Technologies</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Every library, framework, and tool used to build this application.
          </p>
          <div className="space-y-6">
            {toolsUsed.map((category) => (
              <div
                key={category.category}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-red-600 dark:text-red-500" />
                  <h3 className="font-semibold text-sm uppercase tracking-wide">
                    {category.category}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {category.tools.map((tool) => (
                    <div key={tool.name} className="px-5 py-3 flex items-start gap-3">
                      <span className="font-medium text-sm shrink-0 min-w-[180px]">
                        {tool.name}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {tool.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Integrations</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            External services and platforms this application connects to.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${integration.color}`} />
                  <h3 className="font-bold">{integration.name}</h3>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {integration.description}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {integration.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Architecture Highlights */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Architecture Highlights</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Key design decisions that shape how this codebase is organized.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Layers,
                title: "Feature Module Pattern",
                description:
                  "Domain-driven modules (competition, judging, scoring, tabulation, users) with strict barrel exports. Nothing leaks outside index.ts.",
              },
              {
                icon: Lock,
                title: "Defense in Depth",
                description:
                  "Route middleware + server action auth guards + table ownership verification. Every mutation checks authorization at multiple layers.",
              },
              {
                icon: Database,
                title: "Transactional Safety",
                description:
                  "Critical operations (box distribution, category submission, correction approval) wrapped in Prisma transactions with cascade-safe guards.",
              },
              {
                icon: Zap,
                title: "Pure Business Logic",
                description:
                  "KCBS scoring rules extracted as pure functions with 113 unit tests. Tiebreaking, weighted totals, and validation all testable without a database.",
              },
            ].map((highlight) => (
              <div
                key={highlight.title}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <highlight.icon className="h-4 w-4 text-red-600 dark:text-red-500" />
                  <h3 className="font-bold text-sm">{highlight.title}</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with Claude Code — from architecture to deployment, every line AI-assisted.
          </p>
        </footer>
      </main>
    </div>
  );
}
