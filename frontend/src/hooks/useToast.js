import { useCallback, useState } from 'react'

let nextId = 1

export default function useToast() {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, timeout = 5000, type = 'error') => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, message, type }])
      if (timeout) {
        setTimeout(() => dismiss(id), timeout)
      }
    },
    [dismiss],
  )

  const success = useCallback(
    (message, timeout = 3000) => push(message, timeout, 'success'),
    [push],
  )

  return { toasts, push, success, dismiss }
}
