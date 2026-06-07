'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Le password non corrispondono')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri')
      setLoading(false)
      return
    }

    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError('Errore nel reset della password. Riprova o richiedi un nuovo link.')
    } else {
      setMessage('✓ Password cambiata con successo! Reindirizzamento...')
      setTimeout(() => router.push('/auth/login'), 2000)
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',flexDirection:'column'}}>
      {/* NAVBAR */}
      <nav style={{position:'sticky',top:0,zIndex:50,backdropFilter:'blur(14px)',background:'var(--nav-bg)',borderBottom:'1px solid var(--line-soft)'}}>
        <div style={{maxWidth:'1180px',margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',justifyContent:'space-between',height:68,gap:16}}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:11,cursor:'pointer',textDecoration:'none'}}>
            <div style={{width:30,height:30,borderRadius:7,background:'var(--acid)',display:'grid',placeItems:'center',color:'#0b0d0a',fontWeight:800,fontFamily:'Anton',fontSize:20,transform:'skewX(-7deg)'}}>S</div>
            <div style={{fontFamily:'Anton',fontSize:21,letterSpacing:'.06em',color:'var(--text)'}}>SVINCOLATI</div>
          </Link>

          <button style={{width:38,height:38,borderRadius:9,background:'var(--card-2)',border:'1px solid var(--line)',color:'var(--text)',cursor:'pointer',display:'grid',placeItems:'center',fontSize:16,lineHeight:1,transition:'.16s'}}>
            ☀️
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{flex:1,display:'flex',alignItems:'stretch',position:'relative'}}>
        {/* STRIPES */}
        <div style={{position:'absolute',right:'-60px',top:'-30px',width:'520px',height:'520px',zIndex:0,opacity:0.5,background:'repeating-linear-gradient(115deg, transparent 0 38px, rgba(65,194,133,.06) 38px 40px)',transform:'rotate(8deg)',pointerEvents:'none'}}></div>

        {/* LEFT: HERO */}
        <div style={{flex:1,display:'flex',alignItems:'center',padding:'60px 24px',position:'relative',zIndex:2}}>
          <div style={{maxWidth:'480px'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:9,fontFamily:'Spline Sans Mono',fontSize:12,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--acid)',border:'1px solid var(--line)',padding:'7px 13px',borderRadius:100,marginBottom:24,background:'var(--card)'}}>
              <span style={{width:7,height:7,borderRadius:'50%',background:'var(--acid)',boxShadow:'0 0 12px var(--acid)'}}></span>
              Accesso su invito
            </div>

            <h1 style={{fontFamily:'Anton',fontWeight:400,fontSize:'clamp(44px,7vw,86px)',lineHeight:0.92,letterSpacing:'-.01em',textTransform:'uppercase',marginBottom:22,color:'var(--text)'}}>
              <span style={{color:'var(--text)'}}>Crea una</span><br/>
              <span style={{color:'var(--acid)'}}>nuova</span> <span style={{color:'var(--text)'}}>password</span>
            </h1>

            <p style={{marginTop:22,fontSize:17,color:'var(--muted)',maxWidth:'46ch',lineHeight:1.6,marginBottom:28}}>
              Scegli una nuova password per il tuo account e procedi con l'accesso.
            </p>

            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{color:'var(--acid)',fontWeight:800,flexShrink:0}}>01</span>
                <div>
                  <div style={{fontSize:15,color:'var(--text)'}}><b>Password sicura</b> — almeno 6 caratteri.</div>
                </div>
              </div>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{color:'var(--acid)',fontWeight:800,flexShrink:0}}>02</span>
                <div>
                  <div style={{fontSize:15,color:'var(--text)'}}><b>Confermalo</b> — verifica che coincida.</div>
                </div>
              </div>
              <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <span style={{color:'var(--acid)',fontWeight:800,flexShrink:0}}>03</span>
                <div>
                  <div style={{fontSize:15,color:'var(--text)'}}><b>Accedi</b> — con la nuova password.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div style={{width:'400px',display:'flex',alignItems:'center',padding:'60px 24px',position:'relative',zIndex:3,background:'linear-gradient(135deg, transparent 0%, rgba(11,13,10,.3) 100%)'}}>
          <div style={{width:'100%'}}>
            <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:24,textAlign:'center'}}>Nuova Password</h2>

            {message && (
              <div style={{background:'rgba(65, 194, 133, 0.2)',border:'1px solid var(--acid)',borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:'var(--acid)'}}>
                {message}
              </div>
            )}

            {error && (
              <div style={{background:'rgba(255, 90, 60, 0.2)',border:'1px solid var(--danger)',borderRadius:10,padding:12,marginBottom:16,fontSize:12,color:'var(--danger)'}}>
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>
                  Nuova Password
                </label>
                <div style={{position:'relative'}}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Almeno 6 caratteri"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px 12px 14px',borderRadius:10,outline:'none',paddingRight:44}}
                    onFocus={e => e.target.style.borderColor = 'var(--acid)'}
                    onBlur={e => e.target.style.borderColor = 'var(--line)'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:17}}>👁</button>
                </div>
              </div>

              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>
                  Conferma Password
                </label>
                <div style={{position:'relative'}}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ripeti la password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px 12px 14px',borderRadius:10,outline:'none',paddingRight:44}}
                    onFocus={e => e.target.style.borderColor = 'var(--acid)'}
                    onBlur={e => e.target.style.borderColor = 'var(--line)'}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:17}}>👁</button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{width:'100%',padding:'14px 24px',background:'var(--acid)',color:'#0b0d0a',border:'none',borderRadius:11,fontFamily:'Archivo',fontWeight:800,fontSize:15,cursor:'pointer',transition:'.18s',opacity:loading?0.7:1}}
              >
                {loading ? '⏳ Aggiornamento...' : '🔒 Cambia Password'}
              </button>
            </form>

            <div style={{marginTop:20,textAlign:'center',fontSize:13}}>
              Torna al <Link href="/auth/login" style={{color:'var(--acid)',fontWeight:600,textDecoration:'none'}}>login</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:1024px) {
          div[style*="width:400px"] {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  )
}
