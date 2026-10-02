import { useCallback, useState } from 'react'

let nextId = 1

export default function useToast() {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, timeout = 5000) => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, message }])
      if (timeout) {
        setTimeout(() => dismiss(id), timeout)
      }
    },
    [dismiss],
  )

  return { toasts, push, dismiss }
}
