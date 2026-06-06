'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Errore durante l\'accesso')
      setLoading(false)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',position:'relative'}}>
      {/* Stripes background */}
      <div style={{position:'absolute',right:'-60px',top:'-30px',width:'520px',height:'520px',zIndex:0,opacity:0.5,background:'repeating-linear-gradient(115deg, transparent 0 38px, rgba(65,194,133,.06) 38px 40px)',transform:'rotate(8deg)',pointerEvents:'none'}}></div>

      {/* Main content */}
      <div style={{position:'relative',zIndex:3,padding:'48px 0 80px'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',padding:'0 24px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:'54px',alignItems:'flex-start'}}>
            {/* LEFT: Title */}
            <div style={{paddingRight:40}}>
              <h1 style={{fontFamily:'Anton',fontWeight:400,fontSize:'clamp(44px,7vw,86px)',lineHeight:0.92,letterSpacing:'-.01em',textTransform:'uppercase',transition:'.4s ease-in-out',color:'var(--text)'}}>
                Il mercato del<br/>
                <span style={{color:'var(--acid)'}}>calcio</span> dilettantistico
              </h1>
              <p style={{marginTop:'22px',fontSize:'17px',color:'var(--muted)',maxWidth:'46ch',lineHeight:1.6}}>
                Una community chiusa che mette in contatto giocatori svincolati e società. Niente bacheche pubbliche aperte a tutti: si entra solo con un codice invito.
              </p>
            </div>

            {/* RIGHT: Form */}
            <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,padding:30,animation:'rise .5s cubic-bezier(.2,.7,.2,1) both',width:'100%'}}>
              <h2 style={{fontSize:18,fontWeight:'bold',color:'var(--text)',marginBottom:24,textAlign:'center'}}>Accedi al tuo account</h2>

          {error && (
            <div style={{background:'rgba(255, 90, 60, 0.15)',border:'1px solid rgba(255, 90, 60, 0.2)',color:'var(--danger)',padding:12,borderRadius:10,fontSize:13,marginBottom:16}}>
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{marginBottom:16}}>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tuo@email.com"
                style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,transition:'.16s'}}
              />
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,transition:'.16s'}}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              style={{width:'100%',fontFamily:'Archivo',fontWeight:800,fontSize:15,padding:'14px 24px',borderRadius:11,background:'var(--acid)',color:'#0b0d0a',border:'none',cursor:'pointer',transition:'.18s',display:'flex',alignItems:'center',justifyContent:'center',opacity:loading?0.7:1}}
            >
              {loading ? '⏳ Accesso...' : '✓ Accedi'}
            </button>
              </form>

              <div style={{textAlign:'center',display:'flex',flexDirection:'column',gap:12,marginTop:24}}>
                <Link href="/auth/register" style={{color:'var(--acid)',fontSize:13,fontWeight:600,textDecoration:'none',transition:'.16s'}}>
                  Non hai un account? Registrati
                </Link>
                <Link href="/auth/forgot-password" style={{color:'var(--muted)',fontSize:12,textDecoration:'none',transition:'.16s'}}>
                  Password dimenticata?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media(max-width:880px){
          div[style*="grid-template-columns:1.05fr"] {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
          div[style*="gridTemplateColumns:'1.05fr"] {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `}</style>
    </div>
  )
}
