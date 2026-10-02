import { BotIcon } from './Icons'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-sm">
        <BotIcon width={15} height={15} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3.5 shadow-card ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700/80">
        <span className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-brand-500 [animation-delay:-0.32s]" />
        <span className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-brand-500 [animation-delay:-0.16s]" />
        <span className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-brand-500" />
      </div>
    </div>
  )
}
