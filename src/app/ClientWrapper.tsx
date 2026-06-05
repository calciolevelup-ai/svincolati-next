'use client'
import { useEffect } from 'react'
import { initEmailJS } from '@/lib/email'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initEmailJS()
  }, [])

  return children
}
