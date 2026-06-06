'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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
      setMessage('✅ Password cambiata con successo! Reindirizzamento...')
      setTimeout(() => router.push('/auth/login'), 2000)
    }
    setLoading(false)
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
            <div>
              <h1 style={{fontFamily:'Anton',fontWeight:400,fontSize:'clamp(44px,7vw,86px)',lineHeight:0.92,letterSpacing:'-.01em',textTransform:'uppercase'}}>
                <span style={{color:'var(--acid)'}}>Crea una nuova</span>
                <br/>
                <span style={{color:'var(--acid)'}}>password</span>
              </h1>
              <p style={{marginTop:'22px',fontSize:'17px',color:'var(--muted)',maxWidth:'46ch',lineHeight:1.6}}>
                Inserisci la tua nuova password per completare il reset.
              </p>
            </div>

            {/* RIGHT: Form */}
            <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,padding:30,animation:'rise .5s cubic-bezier(.2,.7,.2,1) both',width:'100%'}}>
              <h1 style={{
                fontFamily: 'Anton',
                fontSize: 24,
                textTransform: 'uppercase',
                color: 'var(--text)',
                marginBottom: 24,
                letterSpacing: '-.01em'
              }}>
                Nuova Password
              </h1>

              {message && (
                <div style={{
                  background: 'rgba(65, 194, 133, 0.2)',
                  border: '1px solid var(--acid)',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                  fontSize: 12,
                  color: 'var(--acid)'
                }}>
                  {message}
                </div>
              )}

              {error && (
                <div style={{
                  background: 'rgba(255, 90, 60, 0.2)',
                  border: '1px solid var(--danger)',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                  fontSize: 12,
                  color: 'var(--danger)'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Spline Sans Mono',
                    fontSize: 11,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 8
                  }}>
                    Nuova Password <span style={{ color: 'var(--acid)' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Almeno 6 caratteri"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,transition:'.16s'}}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: 'block',
                    fontFamily: 'Spline Sans Mono',
                    fontSize: 11,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--muted)',
                    marginBottom: 8
                  }}>
                    Conferma Password <span style={{ color: 'var(--acid)' }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Ripeti la password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,transition:'.16s'}}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: 'var(--acid)',
                    color: '#0b0d0a',
                    border: 'none',
                    borderRadius: 11,
                    fontFamily: 'Archivo',
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: 'pointer',
                    transition: '.18s',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? '⏳ Aggiornamento...' : '🔒 Cambia Password'}
                </button>
              </form>
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
