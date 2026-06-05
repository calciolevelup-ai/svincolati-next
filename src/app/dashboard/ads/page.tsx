'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/c-ads')
  }, [router])

  return null
}
