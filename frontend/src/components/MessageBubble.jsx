import { BotIcon, UserIcon, AlertIcon } from './Icons'
import { renderAnswerHtml } from '../lib/formatText'

const NO_ANSWER_SNIPPET = 'answer is not available in the context'

export default function MessageBubble({ question, answer }) {
  const isNoAnswer = (answer || '').toLowerCase().includes(NO_ANSWER_SNIPPET)

  return (
    <div className="flex flex-col gap-4 animate-fade-in-up">
      <div className="flex items-start gap-3 justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-brand-gradient px-4 py-2.5 text-sm leading-relaxed text-white shadow-glow sm:max-w-[75%]">
          {question}
        </div>
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm dark:bg-slate-200 dark:text-slate-800">
          <UserIcon width={15} height={15} />
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-sm">
          <BotIcon width={15} height={15} />
        </div>
        <div
          className={`max-w-[80%] rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed shadow-card sm:max-w-[75%] ${
            isNoAnswer
              ? 'bg-amber-50 text-amber-900 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900'
              : 'bg-white text-slate-700 ring-1 ring-slate-100 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700/80'
          }`}
        >
          {isNoAnswer && (
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
              <AlertIcon width={14} height={14} />
              Not found in document
            </div>
          )}
          <div
            className="prose-answer"
            dangerouslySetInnerHTML={{ __html: renderAnswerHtml(answer) }}
          />
        </div>
      </div>
    </div>
  )
}
