import { BotIcon } from './Icons'

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in-up">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
        <BotIcon width={16} height={16} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <span className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-slate-400 [animation-delay:-0.32s]" />
        <span className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-slate-400 [animation-delay:-0.16s]" />
        <span className="h-1.5 w-1.5 animate-bounce-dot rounded-full bg-slate-400" />
      </div>
    </div>
  )
}
