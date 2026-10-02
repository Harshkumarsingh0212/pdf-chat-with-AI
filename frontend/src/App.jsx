import { useEffect, useRef, useState } from 'react'
import api, { errorMessage } from './api'
import Sidebar from './components/Sidebar'
import ChatInput from './components/ChatInput'
import MessageBubble from './components/MessageBubble'
import TypingIndicator from './components/TypingIndicator'
import EmptyState from './components/EmptyState'
import Toast from './components/Toast'
import useToast from './hooks/useToast'
import { FileTextIcon, MenuIcon } from './components/Icons'

export default function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('pdf-chat-theme') === 'dark',
  )
  const [files, setFiles] = useState([])
  const [isReady, setIsReady] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [chats, setChats] = useState([])
  const [userInput, setUserInput] = useState('')
  const [pendingQuestion, setPendingQuestion] = useState(null)
  const [isAsking, setIsAsking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fileInputRef = useRef(null)
  const scrollRef = useRef(null)
  const { toasts, push: pushToast, success: pushSuccess, dismiss: dismissToast } = useToast()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('pdf-chat-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    api
      .get('/status/')
      .then((res) => setIsReady(Boolean(res.data?.ready)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chats, pendingQuestion])

  const handleUpload = async (fileList) => {
    const pdfFiles = fileList.filter((f) => f.name.toLowerCase().endsWith('.pdf'))
    if (pdfFiles.length === 0) {
      pushToast('Only PDF files are supported.')
      return
    }

    const formData = new FormData()
    pdfFiles.forEach((file) => formData.append('file_uploads', file))

    setIsUploading(true)
    try {
      const res = await api.post('/uploadfile/', formData)
      setFiles(res.data.filenames || [])
      setIsReady(true)
      setChats([])
      setSidebarOpen(false)
      pushSuccess(`Loaded ${res.data.filenames.length} document(s). Ask away!`)
    } catch (error) {
      pushToast(errorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = async () => {
    try {
      await api.delete('/reset/')
    } catch (error) {
      pushToast(errorMessage(error))
      return
    }
    setFiles([])
    setIsReady(false)
    setChats([])
    setSidebarOpen(false)
    pushSuccess('Started a new chat.')
  }

  const handleAsk = async () => {
    const question = userInput.trim()
    if (!question || isAsking) return

    setUserInput('')
    setPendingQuestion(question)
    setIsAsking(true)

    try {
      const res = await api.post('/question/', {
        chat_history: chats,
        question,
      })
      setChats(res.data.chat_history)
    } catch (error) {
      pushToast(errorMessage(error))
      setUserInput(question)
    } finally {
      setPendingQuestion(null)
      setIsAsking(false)
    }
  }

  const orderedChats = [...chats].reverse()
  const showEmptyState = !isReady && !pendingQuestion && orderedChats.length === 0

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar
        files={files}
        isReady={isReady}
        isUploading={isUploading}
        onUpload={handleUpload}
        onReset={handleReset}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        fileInputRef={fileInputRef}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <MenuIcon width={19} height={19} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <FileTextIcon width={14} height={14} />
            </div>
            <span className="font-display text-sm font-bold text-slate-800 dark:text-slate-50">
              PDF Chat AI
            </span>
          </div>
        </div>

        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div ref={scrollRef} className={`flex-1 overflow-y-auto ${showEmptyState ? 'mesh-bg' : ''}`}>
            {showEmptyState ? (
              <EmptyState onBrowseClick={() => fileInputRef.current?.click()} />
            ) : (
              <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6 sm:px-6">
                {orderedChats.map((chat, i) => (
                  <MessageBubble key={i} question={chat.question} answer={chat.answer} />
                ))}
                {pendingQuestion && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-brand-gradient px-4 py-2.5 text-sm text-white shadow-glow sm:max-w-[75%]">
                        {pendingQuestion}
                      </div>
                    </div>
                    <TypingIndicator />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <ChatInput
                value={userInput}
                onChange={setUserInput}
                onSubmit={handleAsk}
                disabled={!isReady || isAsking}
                placeholder={
                  isReady ? 'Ask a question about your document…' : 'Upload a PDF to start chatting'
                }
              />
              <p className="mt-2 text-center text-xs text-slate-400">
                Answers are generated from your uploaded PDF content and may be incomplete or inaccurate.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}
