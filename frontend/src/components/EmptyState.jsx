import { SparkleIcon, UploadIcon } from './Icons'

export default function EmptyState({ onBrowseClick }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
        <SparkleIcon width={28} height={28} />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Chat with your PDFs
      </h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Upload one or more PDF documents and ask questions in plain language.
        Answers are grounded in your document content using retrieval-augmented
        generation.
      </p>
      <button
        onClick={onBrowseClick}
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98]"
      >
        <UploadIcon width={16} height={16} />
        Upload a PDF to get started
      </button>
    </div>
  )
}
