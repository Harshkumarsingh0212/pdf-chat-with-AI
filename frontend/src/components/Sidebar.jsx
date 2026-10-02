import { useRef, useState } from 'react'
import {
  FileTextIcon,
  MoonIcon,
  RefreshIcon,
  SunIcon,
  UploadIcon,
  XIcon,
} from './Icons'

export default function Sidebar({
  files,
  isReady,
  isUploading,
  onUpload,
  onReset,
  darkMode,
  onToggleDarkMode,
  fileInputRef,
  isOpen,
  onClose,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const internalInputRef = useRef(null)
  const inputRef = fileInputRef || internalInputRef

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(event.dataTransfer.files || [])
    if (dropped.length) onUpload(dropped)
  }

  const handleBrowse = (event) => {
    const chosen = Array.from(event.target.files || [])
    if (chosen.length) onUpload(chosen)
    event.target.value = ''
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-[86%] max-w-xs flex-col border-r border-slate-200/80 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-slate-800/80 dark:bg-slate-900 sm:max-w-sm md:static md:z-auto md:w-80 md:max-w-none md:translate-x-0 md:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
              <FileTextIcon width={19} height={19} />
            </div>
            <div>
              <p className="font-display text-sm font-bold tracking-tight text-slate-800 dark:text-slate-50">
                PDF Chat AI
              </p>
              <p className="text-[11px] font-medium text-slate-400">Powered by Gemini</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleDarkMode}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 md:hidden"
              aria-label="Close menu"
            >
              <XIcon width={17} height={17} />
            </button>
          </div>
        </div>

        <div className="px-5">
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`group relative flex cursor-pointer flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border-2 border-dashed px-4 py-9 text-center transition-all duration-200 ${
              isDragging
                ? 'scale-[1.02] border-brand-500 bg-brand-50/80 dark:bg-brand-950/30'
                : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50/80 dark:border-slate-700 dark:hover:border-brand-700/60 dark:hover:bg-slate-800/40'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              multiple
              hidden
              onChange={handleBrowse}
            />
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-600 shadow-card transition-transform duration-200 group-hover:scale-110 dark:bg-slate-800 ${
                isUploading ? 'animate-pulse-glow' : ''
              }`}
            >
              <UploadIcon width={19} height={19} />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isUploading ? 'Processing…' : 'Drop PDFs here'}
            </p>
            <p className="text-xs text-slate-400">or click to browse · multiple files OK</p>
          </label>
        </div>

        <div className="mt-5 flex-1 overflow-y-auto px-5">
          {files.length > 0 && (
            <>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Loaded documents
              </p>
              <ul className="space-y-1.5">
                {files.map((name) => (
                  <li
                    key={name}
                    className="group flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-600 ring-1 ring-transparent transition hover:ring-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:ring-slate-700"
                  >
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/50 dark:text-brand-300">
                      <FileTextIcon width={13} height={13} />
                    </span>
                    <span className="truncate font-medium">{name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800/80">
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {isReady && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
              />
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isReady ? 'Ready to chat' : 'No document loaded'}
            </span>
          </div>
          <button
            onClick={onReset}
            disabled={!isReady && files.length === 0}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <RefreshIcon
              width={14}
              height={14}
              className="transition-transform duration-300 group-hover:-rotate-180"
            />
            Start new chat
          </button>
        </div>
      </aside>
    </>
  )
}
