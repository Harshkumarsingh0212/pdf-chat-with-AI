import { useRef, useState } from 'react'
import {
  FileTextIcon,
  MoonIcon,
  RefreshIcon,
  SunIcon,
  UploadIcon,
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
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:w-80">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
            <FileTextIcon width={18} height={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              PDF Chat AI
            </p>
            <p className="text-xs text-slate-400">Powered by Gemini</p>
          </div>
        </div>
        <button
          onClick={onToggleDarkMode}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <SunIcon width={16} height={16} /> : <MoonIcon width={16} height={16} />}
        </button>
      </div>

      <div className="px-5">
        <label
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
            isDragging
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
              : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60'
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-600 shadow-sm dark:bg-slate-800">
            <UploadIcon width={18} height={18} />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
            {isUploading ? 'Processing…' : 'Drop PDFs here or click to browse'}
          </p>
          <p className="text-xs text-slate-400">Supports multiple files</p>
        </label>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto px-5">
        {files.length > 0 && (
          <>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Loaded documents
            </p>
            <ul className="space-y-1.5">
              {files.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  <FileTextIcon width={14} height={14} className="flex-shrink-0 text-brand-500" />
                  <span className="truncate">{name}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
          />
          <span className="text-slate-500 dark:text-slate-400">
            {isReady ? 'Ready to chat' : 'No document loaded'}
          </span>
        </div>
        <button
          onClick={onReset}
          disabled={!isReady && files.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshIcon width={14} height={14} />
          Start new chat
        </button>
      </div>
    </aside>
  )
}
