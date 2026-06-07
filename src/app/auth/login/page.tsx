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
  const [showPassword, setShowPassword] = useState(false)
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
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'}}>
      {/* NAVBAR */}
      <nav style={{position:'sticky',top:0,zIndex:50,backdropFilter:'blur(14px)',background:'var(--nav-bg)',borderBottom:'1px solid var(--line-soft)'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:68,gap:16}}>
          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',gap:11,cursor:'pointer',textDecoration:'none'}}>
            <div style={{width:30,height:30,borderRadius:7,background:'var(--acid)',display:'grid',placeItems:'center',color:'#0b0d0a',fontWeight:800,fontFamily:'Anton',fontSize:20,transform:'skewX(-7deg)'}}>S</div>
            <div style={{fontFamily:'Anton',fontSize:21,letterSpacing:'.06em',color:'var(--text)'}}>SVINCOLATI</div>
          </Link>

          {/* Theme toggle */}
          <button style={{width:38,height:38,borderRadius:9,background:'var(--card-2)',border:'1px solid var(--line)',color:'var(--text)',cursor:'pointer',display:'grid',placeItems:'center',fontSize:16,lineHeight:1,transition:'.16s'}}>
            ☀️
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{flex:1,display:'flex',alignItems:'stretch',position:'relative'}}>
        {/* STRIPES PATTERN */}
        <div style={{position:'absolute',right:'-60px',top:'-30px',width:'520px',height:'520px',zIndex:0,opacity:0.5,background:'repeating-linear-gradient(115deg, transparent 0 38px, rgba(65,194,133,.06) 38px 40px)',transform:'rotate(8deg)',pointerEvents:'none'}}></div>

        {/* LEFT: HERO */}
        <div style={{flex:1,display:'flex',alignItems:'center',padding:'60px 24px',position:'relative',zIndex:2}}>
          <div style={{maxWidth:'480px'}}>
            {/* Eyebrow */}
            <div style={{display:'inline-flex',alignItems:'center',gap:9,fontFamily:'Spline Sans Mono',fontSize:12,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--acid)',border:'1px solid var(--line)',padding:'7px 13px',borderRadius:100,marginBottom:24,background:'var(--card)'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'var(--acid)',boxShadow:'0 0 12px var(--acid)'}}></span>
              Accesso su invito
            </div>

            {/* Title */}
            <h1 style={{fontFamily:'Anton',fontWeight:400,fontSize:'clamp(44px,7vw,86px)',lineHeight:0.92,letterSpacing:'-.01em',textTransform:'uppercase',marginBottom:22,color:'var(--text)'}}>
              <span style={{color:'var(--text)'}}>Il mercato del</span><br/>
              <span style={{color:'var(--acid)'}}>calcio dilettantistico</span>.
            </h1>

            {/* Subtitle */}
            <p style={{marginTop:22,fontSize:17,color:'var(--muted)',maxWidth:'46ch',lineHeight:1.6,marginBottom:28}}>
              Una community chiusa che mette in contatto giocatori svincolati e società. Niente bacheche pubbliche aperte a tutti: si entra solo con un codice invito.
            </p>

            {/* Points */}
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{color:'var(--acid)',fontWeight:800,flexShrink:0}}>01</span>
                <div>
                  <div style={{fontSize:15,color:'var(--text)'}}><b>Giocatori</b> — pubblica il tuo CV calcistico e proponiti alle società.</div>
                  <div style={{color:'var(--muted)',fontSize:'13.5px',marginTop:4}}>Ruolo, categoria, statistiche, video.</div>
                </div>
              </div>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{color:'var(--acid)',fontWeight:800,flexShrink:0}}>02</span>
                <div>
                  <div style={{fontSize:15,color:'var(--text)'}}><b>Società verificate</b> — pubblica le ricerche e ricevi candidature mirate.</div>
                  <div style={{color:'var(--muted)',fontSize:'13.5px',marginTop:4}}>Badge di verifica tramite codice FIGC.</div>
                </div>
              </div>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{color:'var(--acid)',fontWeight:800,flexShrink:0}}>03</span>
                <div>
                  <div style={{fontSize:15,color:'var(--text)'}}><b>Chat interna</b> — i contatti restano dentro la piattaforma.</div>
                  <div style={{color:'var(--muted)',fontSize:'13.5px',marginTop:4}}>Nessun numero esposto fino al primo contatto.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div style={{width:'400px',display:'flex',alignItems:'center',padding:'60px 24px',position:'relative',zIndex:3,background:'linear-gradient(135deg, transparent 0%, rgba(11,13,10,.3) 100%)'}}>
          <div style={{width:'100%'}}>
            {/* Tabs */}
            <div style={{display:'flex',gap:6,background:'var(--bg-2)',border:'1px solid var(--line)',padding:5,borderRadius:11,marginBottom:24}}>
              <button style={{flex:1,background:'var(--acid)',border:'none',color:'#0b0d0a',fontFamily:'Archivo',fontWeight:700,fontSize:14,padding:10,borderRadius:8,cursor:'pointer',transition:'.16s'}}>
                Accedi
              </button>
              <Link href="/auth/register" style={{flex:1,background:'none',border:'none',color:'var(--muted)',fontFamily:'Archivo',fontWeight:700,fontSize:14,padding:10,borderRadius:8,cursor:'pointer',transition:'.16s',display:'grid',placeItems:'center',textDecoration:'none'}}>
                Registrati con invito
              </Link>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:16}}>
              {error && (
                <div style={{background:'rgba(255, 90, 60, 0.15)',border:'1px solid rgba(255, 90, 60, 0.2)',color:'var(--danger)',padding:12,borderRadius:10,fontSize:13}}>
                  ❌ {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome@email.it"
                  style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,transition:'.16',outline:'none'}}
                  onFocus={e => e.target.style.borderColor = 'var(--acid)'}
                  onBlur={e => e.target.style.borderColor = 'var(--line)'}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>
                  Password
                </label>
                <div style={{position:'relative'}}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px 12px 14px',borderRadius:10,transition:'.16s',outline:'none',paddingRight:44}}
                    onFocus={e => e.target.style.borderColor = 'var(--acid)'}
                    onBlur={e => e.target.style.borderColor = 'var(--line)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:17,lineHeight:1,padding:2,transition:'.16s'}}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--muted)'}
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={loading}
                type="submit"
                style={{width:'100%',padding:'14px 24px',background:'var(--acid)',color:'#0b0d0a',border:'none',borderRadius:11,fontFamily:'Archivo',fontWeight:800,fontSize:15,cursor:'pointer',transition:'.18s',display:'flex',alignItems:'center',justifyContent:'center',opacity:loading?0.7:1}}
              >
                {loading ? '⏳ Accesso...' : '✓ Entra'}
              </button>
            </form>

            {/* Links */}
            <div style={{marginTop:20,textAlign:'center'}}>
              <Link href="/auth/forgot-password" style={{color:'var(--muted)',fontSize:12,textDecoration:'none',transition:'.16s',borderBottom:'1px solid transparent'}}>
                Hai dimenticato la password?
              </Link>
            </div>

            {/* Register link */}
            <div style={{marginTop:16,textAlign:'center',fontSize:13,color:'var(--muted)'}}>
              Non hai un account? <Link href="/auth/register" style={{color:'var(--acid)',fontWeight:600,textDecoration:'none'}}>Registrati</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media(max-width:1024px) {
          div[style*="width:400px"] {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
