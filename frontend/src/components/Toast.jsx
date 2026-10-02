import { AlertIcon, XIcon } from './Icons'

export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-lg bg-rose-600 px-4 py-3 text-sm text-white shadow-lg animate-fade-in-up"
        >
          <AlertIcon width={18} height={18} className="mt-0.5 flex-shrink-0" />
          <p className="flex-1">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="flex-shrink-0 rounded p-0.5 hover:bg-white/20"
            aria-label="Dismiss"
          >
            <XIcon width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
