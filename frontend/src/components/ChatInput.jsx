import { useRef } from 'react'
import { SendIcon } from './Icons'

export default function ChatInput({ value, onChange, onSubmit, disabled, placeholder }) {
  const textareaRef = useRef(null)

  const handleChange = (event) => {
    onChange(event.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!disabled && value.trim()) onSubmit()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!disabled && value.trim()) onSubmit()
      }}
      className="flex items-end gap-2 rounded-[1.5rem] border border-slate-200 bg-white p-2 pl-4 shadow-card transition-shadow duration-200 focus-within:border-brand-300 focus-within:shadow-glow dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-brand-600/60"
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        className="max-h-40 flex-1 resize-none bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-100"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow transition-all duration-200 hover:scale-105 hover:shadow-glow-lg active:scale-95 disabled:cursor-not-allowed disabled:scale-100 disabled:bg-none disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-700"
        aria-label="Send message"
      >
        <SendIcon width={16} height={16} />
      </button>
    </form>
  )
}
