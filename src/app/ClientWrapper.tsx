'use client'
import { useEffect } from 'react'
import { initEmailJS } from '@/lib/email'
import { useSportTheme } from '@/hooks/useSportTheme'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useSportTheme()

  useEffect(() => {
    initEmailJS()
  }, [])

  return children
}
