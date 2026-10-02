import { LayersIcon, MessageIcon, ShieldIcon, SparkleIcon, UploadIcon } from './Icons'

const FEATURES = [
  { icon: LayersIcon, label: 'Multi-PDF support' },
  { icon: MessageIcon, label: 'Context-aware chat' },
  { icon: ShieldIcon, label: 'Grounded answers' },
]

export default function EmptyState({ onBrowseClick }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Decorative glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-500/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-accent-400/20 blur-3xl dark:bg-accent-500/10"
      />

      <div className="relative animate-float">
        <div className="absolute inset-0 rounded-3xl bg-brand-gradient opacity-40 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-glow-lg">
          <SparkleIcon width={32} height={32} />
        </div>
      </div>

      <h2 className="font-display mt-6 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
        Chat with your <span className="gradient-text">PDFs</span>
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        Upload one or more PDF documents and ask questions in plain language.
        Answers are grounded in your document content using retrieval-augmented
        generation.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {FEATURES.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
          >
            <Icon width={13} height={13} className="text-brand-500" />
            {label}
          </span>
        ))}
      </div>

      <button
        onClick={onBrowseClick}
        className="group relative mt-7 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-glow-lg active:translate-y-0"
      >
        <span className="absolute inset-0 -translate-x-full bg-shimmer bg-[length:200%_100%] transition-transform duration-700 group-hover:translate-x-full" />
        <UploadIcon width={16} height={16} />
        Upload a PDF to get started
      </button>
    </div>
  )
}
