'use client'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Navbar from './Navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profile, loading, error } = useAuth()

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'var(--text)'}}>⏳ Caricamento...</div>

  if (error) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',color:'var(--danger)'}}>❌ {error}</div>

  if (!profile) {
    router.push('/auth/login')
    return null
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar />
      <main style={{paddingTop:'56px',paddingBottom:'24px'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 14px'}}>
          {children}
        </div>
      </main>
    </div>
  )
}
