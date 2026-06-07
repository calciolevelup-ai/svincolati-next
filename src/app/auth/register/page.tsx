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
  const [showPassword, setShowPassword] = useState(false)
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

      // Create profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').insert({
          id: user.id,
          role,
          sport,
          email,
          dob,
          onboarded: false
        })
      }

      router.push('/dashboard')
    } catch (err) {
      setError('Errore durante la registrazione')
      setLoading(false)
    }
  }

  const sportList = Object.entries(SPORTS).map(([key, cfg]) => ({key, ...cfg}))
  const currentSport = sport ? (SPORTS[sport as keyof typeof SPORTS]?.nome || 'calcio').toLowerCase() : 'calcio'
  const currentSportColor = sport ? SPORTS[sport as keyof typeof SPORTS]?.color || 'var(--acid)' : 'var(--acid)'
  const article = currentSport === 'pallavolo' ? 'della' : 'del'

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
              <span style={{color:'var(--text)'}}>Il mercato {sport ? article + ' ' : ''}</span>
              {sport && <><span style={{color:currentSportColor,transition:'.4s ease-in-out'}}>{currentSport}</span><br/></>}
              <span style={{color:'var(--text)'}}>dilettantistico</span>
            </h1>

            <p style={{marginTop:22,fontSize:17,color:'var(--muted)',maxWidth:'46ch',lineHeight:1.6,marginBottom:28}}>
              Una community chiusa che mette in contatto giocatori svincolati e società. Niente bacheche pubbliche aperte a tutti: si entra solo con un codice invito.
            </p>

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
              <Link href="/auth/login" style={{flex:1,background:'none',border:'none',color:'var(--muted)',fontFamily:'Archivo',fontWeight:700,fontSize:14,padding:10,borderRadius:8,cursor:'pointer',transition:'.16s',display:'grid',placeItems:'center',textDecoration:'none'}}>
                Accedi
              </Link>
              <button style={{flex:1,background:'var(--acid)',border:'none',color:'#0b0d0a',fontFamily:'Archivo',fontWeight:700,fontSize:14,padding:10,borderRadius:8,cursor:'pointer',transition:'.16s'}}>
                Registrati con invito
              </button>
            </div>

            {/* STEP 1: Sport */}
            {step === 'sport' && (
              <div>
                <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:20,textAlign:'center'}}>Scegli lo sport</h2>
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8,marginBottom:24}}>
                  {sportList.map(s => (
                    <button
                      key={s.key}
                      onClick={() => {setSport(s.key); setStep('role')}}
                      style={{border:sport===s.key?'2px solid var(--acid)':'2px solid var(--line)',background:sport===s.key?'rgba(65,194,133,.12)':'var(--bg-2)',color:'var(--text)',padding:12,borderRadius:10,cursor:'pointer',transition:'.24s',fontSize:12,fontWeight:'bold',height:80,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}
                    >
                      <div style={{fontSize:40}}>{s.icon}</div>
                      <div style={{fontSize:10,marginTop:4}}>{s.nome}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Role */}
            {step === 'role' && (
              <div>
                <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:20,textAlign:'center'}}>Chi sei?</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:24}}>
                  {[
                    {value:'player',title:'Giocatore',desc:'Cerco squadra'},
                    {value:'staff',title:'Staff',desc:'Allenatore/Preparatore'},
                    {value:'club',title:'Società',desc:'Cerco giocatori'},
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {setRole(opt.value); setStep('data')}}
                      style={{border:role===opt.value?'1px solid var(--acid)':'1px solid var(--line)',background:role===opt.value?'rgba(65,194,133,.06)':'var(--bg-2)',color:'var(--text)',padding:14,borderRadius:11,cursor:'pointer',transition:'.16s',textAlign:'left',fontSize:13}}
                    >
                      <div style={{fontWeight:800,display:'flex',alignItems:'center',gap:6}}>
                        {opt.title}
                        {role===opt.value && <span style={{color:'var(--acid)'}}>✓</span>}
                      </div>
                      <div style={{fontSize:11,color:'var(--muted)',marginTop:6}}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep('sport')} style={{color:'var(--muted)',background:'none',border:'none',cursor:'pointer',fontSize:12,textDecoration:'underline'}}>← Indietro</button>
              </div>
            )}

            {/* STEP 3: Data */}
            {step === 'data' && (
              <div>
                <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:20,textAlign:'center'}}>Crea account</h2>
                {error && <div style={{color:'var(--danger)',fontSize:13,marginBottom:16}}>❌ {error}</div>}
                <form onSubmit={() => setStep('consent')} style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div>
                    <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:6}}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nome@email.it" style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'10px 12px',borderRadius:9,fontFamily:'Archivo',fontSize:'13.5px',outline:'none'}} onFocus={e => e.target.style.borderColor = 'var(--acid)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                  <div>
                    <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:6}}>Password</label>
                    <div style={{position:'relative'}}>
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'10px 12px 10px 12px',borderRadius:9,fontFamily:'Archivo',fontSize:'13.5px',outline:'none',paddingRight:36}} onFocus={e => e.target.style.borderColor = 'var(--acid)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--muted)',fontSize:15}}>👁</button>
                    </div>
                  </div>
                  <div>
                    <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:6}}>Data di nascita</label>
                    <input type="date" value={dob} onChange={e => setDob(e.target.value)} required style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'10px 12px',borderRadius:9,fontFamily:'Archivo',fontSize:'13.5px',outline:'none'}} onFocus={e => e.target.style.borderColor = 'var(--acid)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                  <div>
                    <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:6}}>Codice invito</label>
                    <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value)} required placeholder="es. LEGA2026" style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'10px 12px',borderRadius:9,fontFamily:'Archivo',fontSize:'13.5px',outline:'none',textTransform:'uppercase'}} onFocus={e => e.target.style.borderColor = 'var(--acid)'} onBlur={e => e.target.style.borderColor = 'var(--line)'} />
                  </div>
                  <button type="button" onClick={() => setStep('consent')} style={{width:'100%',background:'var(--acid)',color:'#0b0d0a',fontWeight:800,fontSize:14,padding:'12px',borderRadius:9,border:'none',cursor:'pointer',marginTop:4}}>Continua</button>
                </form>
                <button onClick={() => setStep('role')} style={{color:'var(--muted)',background:'none',border:'none',cursor:'pointer',fontSize:12,textDecoration:'underline',marginTop:12}}>← Indietro</button>
              </div>
            )}

            {/* STEP 4: Consent */}
            {step === 'consent' && (
              <div>
                <h2 style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:20,textAlign:'center'}}>Privacy & Termini</h2>
                <div style={{marginBottom:20}}>
                  <label style={{display:'flex',alignItems:'flex-start',gap:12,cursor:'pointer',fontSize:13}}>
                    <input type="checkbox" checked={privacyOk} onChange={e => setPrivacyOk(e.target.checked)} style={{marginTop:4}} />
                    <div>Accetto la <Link href="/privacy" style={{color:'var(--acid)',textDecoration:'underline'}}>privacy policy</Link></div>
                  </label>
                </div>
                <button
                  onClick={handleRegister}
                  disabled={!privacyOk || loading}
                  style={{width:'100%',background:privacyOk?'var(--acid)':'var(--muted)',color:'#0b0d0a',fontWeight:800,fontSize:14,padding:'12px',borderRadius:9,border:'none',cursor:'pointer',opacity:privacyOk?1:0.5}}
                >
                  {loading ? '⏳...' : '✓ Registrati'}
                </button>
                <button onClick={() => setStep('data')} style={{color:'var(--muted)',background:'none',border:'none',cursor:'pointer',fontSize:12,textDecoration:'underline',marginTop:12,width:'100%'}}>← Indietro</button>
              </div>
            )}

            <div style={{textAlign:'center',marginTop:20,fontSize:13}}>
              Hai già un account? <Link href="/auth/login" style={{color:'var(--acid)',fontWeight:600,textDecoration:'none'}}>Accedi</Link>
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
