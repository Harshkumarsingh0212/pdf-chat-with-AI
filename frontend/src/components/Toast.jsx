import { AlertIcon, XIcon } from './Icons'

function CheckIcon(props) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

const STYLES = {
  error: {
    wrap: 'bg-rose-600',
    icon: AlertIcon,
  },
  success: {
    wrap: 'bg-emerald-600',
    icon: CheckIcon,
  },
}

export default function Toast({ toasts, onDismiss }) {
  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const style = STYLES[toast.type] || STYLES.error
        const Icon = style.icon
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-xl px-4 py-3 text-sm text-white shadow-glow-lg ring-1 ring-white/10 animate-fade-in-up ${style.wrap}`}
          >
            <Icon width={18} height={18} className="mt-0.5 flex-shrink-0" />
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 rounded-md p-0.5 transition hover:bg-white/20"
              aria-label="Dismiss"
            >
              <XIcon width={14} height={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
