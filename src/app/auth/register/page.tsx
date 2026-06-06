'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SPORTS } from '@/lib/constants'

type Step = 'sport' | 'role' | 'data' | 'consent'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<Step>('sport')
  const [sport, setSport] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [dob, setDob] = useState('')
  const [privacyOk, setPrivacyOk] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Errore durante la registrazione')
      setLoading(false)
    }
  }

  const sportList = Object.entries(SPORTS).map(([key, cfg]) => ({key, ...cfg}))
  const currentSportColor = sport ? SPORTS[sport as keyof typeof SPORTS]?.color || 'var(--acid)' : 'var(--acid)'

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',transition:'.4s ease-in-out'}}>
      <div style={{maxWidth:500,width:'100%'}}>
        <div style={{textAlign:'center',marginBottom:48,transition:'.4s ease-in-out'}}>
          <div style={{fontSize:48,marginBottom:16}}>⚽</div>
          <h1 style={{fontFamily:'Anton',fontSize:28,letterSpacing:'.06em',transition:'.4s ease-in-out'}}>
            <span style={{color:currentSportColor,transition:'.4s ease-in-out'}}>SVINCOLATI</span>
          </h1>
        </div>

        <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,padding:30}}>
          {/* Step 1: Sport */}
          {step === 'sport' && (
            <div>
              <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:24,textAlign:'center'}}>Scegli lo sport</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(100px, 1fr))',gap:8,marginBottom:24}}>
                {sportList.map(s => (
                  <button
                    key={s.key}
                    onClick={() => {setSport(s.key); setStep('role')}}
                    style={{border:sport===s.key?'2px solid var(--acid)':'2px solid var(--line)',background:sport===s.key?'rgba(65,194,133,.12)':'var(--bg-2)',color:'var(--text)',padding:16,borderRadius:10,cursor:'pointer',transition:'.24s',fontSize:14,fontWeight:'bold'}}
                  >
                    {s.icon} {s.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Role */}
          {step === 'role' && (
            <div>
              <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:24,textAlign:'center'}}>Chi sei?</h2>
              <div style={{display:'grid',gap:10,marginBottom:24}}>
                {[
                  {value:'player',title:'Giocatore',desc:'Cerco squadra'},
                  {value:'staff',title:'Staff',desc:'Allenatore/Preparatore'},
                  {value:'club',title:'Società',desc:'Cerco giocatori'},
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => {setRole(opt.value); setStep('data')}}
                    style={{border:role===opt.value?'1px solid var(--acid)':'1px solid var(--line)',background:role===opt.value?'rgba(65,194,133,.06)':'var(--bg-2)',color:'var(--text)',padding:14,borderRadius:11,cursor:'pointer',transition:'.16s',textAlign:'left'}}
                  >
                    <div style={{fontWeight:800,fontSize:'14.5px',display:'flex',alignItems:'center',gap:8}}>
                      {opt.title}
                      {role===opt.value && <span style={{color:'var(--acid)'}}>✓</span>}
                    </div>
                    <div style={{fontSize:12,color:'var(--muted)',marginTop:4,fontFamily:'Spline Sans Mono',letterSpacing:'.02em'}}>{opt.desc}</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setStep('sport')} style={{color:'var(--muted)',background:'none',border:'none',cursor:'pointer',fontSize:12,textDecoration:'underline'}}>← Indietro</button>
            </div>
          )}

          {/* Step 3: Email, Password, Invite */}
          {step === 'data' && (
            <div>
              <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:24,textAlign:'center'}}>Crea account</h2>
              {error && <div style={{color:'var(--danger)',fontSize:13,marginBottom:16}}>❌ {error}</div>}
              <form onSubmit={() => setStep('consent')}>
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
                </div>
                <div style={{marginBottom:16}}>
                  <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Data di nascita</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)} required style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
                </div>
                <div style={{marginBottom:24}}>
                  <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Codice invito</label>
                  <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="es. LEGA2026" required style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
                </div>
                <button type="button" onClick={() => setStep('consent')} style={{width:'100%',background:'var(--acid)',color:'#0b0d0a',fontWeight:800,fontSize:15,padding:'14px 24px',borderRadius:11,border:'none',cursor:'pointer'}}>Continua</button>
              </form>
            </div>
          )}

          {/* Step 4: Consent */}
          {step === 'consent' && (
            <div>
              <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:24,textAlign:'center'}}>Privacy & Termini</h2>
              <div style={{marginBottom:24}}>
                <label style={{display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer'}}>
                  <input type="checkbox" checked={privacyOk} onChange={e => setPrivacyOk(e.target.checked)} style={{marginTop:4}} />
                  <div style={{fontSize:13,color:'var(--text)'}}>Accetto la <Link href="/privacy" style={{color:'var(--acid)',textDecoration:'underline'}}>privacy policy</Link></div>
                </label>
              </div>
              <button 
                onClick={handleRegister}
                disabled={!privacyOk || loading}
                style={{width:'100%',background:privacyOk?'var(--acid)':'var(--muted)',color:'#0b0d0a',fontWeight:800,fontSize:15,padding:'14px 24px',borderRadius:11,border:'none',cursor:'pointer',opacity:privacyOk?1:0.5}}
              >
                {loading ? '⏳...' : '✓ Registrati'}
              </button>
            </div>
          )}

          <div style={{textAlign:'center',marginTop:24,fontSize:13}}>
            Hai già un account? <Link href="/auth/login" style={{color:'var(--acid)',fontWeight:600,textDecoration:'none'}}>Accedi</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
