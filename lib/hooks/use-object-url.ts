'use client'

import { useEffect, useRef, useState } from 'react'

export const useObjectUrl = (): {
  url: string | null
  setFile: (file: File | null) => string | null
} => {
  const [url, setUrl] = useState<string | null>(null)
  const urlRef = useRef<string | null>(null)

  const revoke = () => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
  }

  useEffect(() => revoke, [])

  const setFile = (file: File | null): string | null => {
    revoke()

    if (!file) {
      setUrl(null)
      return null
    }

    const next = URL.createObjectURL(file)
    urlRef.current = next
    setUrl(next)
    return next
  }

  return { url, setFile }
}
