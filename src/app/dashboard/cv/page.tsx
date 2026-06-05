'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CVRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/dashboard/cv-edit')
  }, [router])

  return null
}
