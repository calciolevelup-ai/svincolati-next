'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { scfg, calcAge } from '@/lib/utils'
import { getVideoEmbedUrl } from '@/lib/video'
import { uploadPlayerPhoto } from '@/lib/photos'
import {
  getPlayerViewLog,
  getTotalViewCount,
  getMatchingAds,
  getSearchPreferences,
  saveSearchPreferences,
  togglePlayerAvailability,
  deletePlayerAccount
} from '@/lib/player-operations'

export default function CVEditPage() {
  const router = useRouter()
  const { profile, playerProfile } = useAuth()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    nome: '',
    ruolo: '',
    piede: 'Destro',
    cat: '',
    regione: '',
    provincia: '',
    squadra: '',
    altezza: '',
    disponibile: true,
    disponibile_da: '',
    bio: '',
    video: '',
    tessera: '',
    contatto: '',
    photo: ''
  })

  const [searchPrefs, setSearchPrefs] = useState({ cat_min: '', regione_pref: '', note: '' })
  const [career, setCareer] = useState<any[]>([])
  const [newEntry, setNewEntry] = useState({ stagione: '', squadra: '', categoria: '', presenze: '', reti: '' })
  const [viewLog, setViewLog] = useState<any[]>([])
  const [matchingAds, setMatchingAds] = useState<any[]>([])
  const [viewCount, setViewCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [dob, setDob] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [togglegingAvail, setTogggingAvail] = useState(false)

  // Load all data on mount
  useEffect(() => {
    if (!playerProfile) return
    loadAllData()
  }, [playerProfile])

  const loadAllData = async () => {
    if (!playerProfile) return

    // Load form data
    setFormData({
      nome: playerProfile.nome || '',
      ruolo: playerProfile.ruolo || '',
      piede: playerProfile.piede || 'Destro',
      cat: playerProfile.cat || '',
      regione: playerProfile.regione || '',
      provincia: playerProfile.provincia || '',
      squadra: playerProfile.squadra || '',
      altezza: playerProfile.altezza?.toString() || '',
      disponibile: playerProfile.disponibile ?? true,
      disponibile_da: playerProfile.disponibile_da || '',
      bio: playerProfile.bio || '',
      video: playerProfile.video || '',
      tessera: playerProfile.tessera || '',
      contatto: playerProfile.contatto || '',
      photo: playerProfile.photo || ''
    })

    // Load career history
    if (playerProfile.career_history) {
      setCareer(playerProfile.career_history)
    }

    // Load view log
    const vlog = await getPlayerViewLog(playerProfile.id, 5)
    setViewLog(vlog)

    // Load total views
    const vcount = await getTotalViewCount(playerProfile.id)
    setViewCount(vcount)

    // Load matching ads
    const matchAds = await getMatchingAds(playerProfile)
    setMatchingAds(matchAds)

    // Load search preferences
    const prefs = await getSearchPreferences(profile?.id || '')
    if (prefs) setSearchPrefs(prefs)
  }

  const cfg = scfg(profile?.sport)
  const age = dob ? calcAge(dob) : playerProfile?.eta

  const handleSave = async () => {
    setSaving(true)
    try {
      await supabase.from('player_profiles').update({
        ...formData,
        altezza: formData.altezza ? parseInt(formData.altezza) : null,
        eta: age
      }).eq('user_id', profile?.id)

      // Save search preferences
      await saveSearchPreferences(profile?.id || '', searchPrefs)

      alert('Profilo salvato!')
    } catch (err) {
      alert('Errore nel salvataggio')
      console.error(err)
    }
    setSaving(false)
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile?.id) return

    setUploadingPhoto(true)
    try {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      const photoUrl = await uploadPlayerPhoto(file, profile.id)
      if (photoUrl) {
        setFormData({ ...formData, photo: photoUrl })
        alert('Foto caricata con successo!')
      }
    } catch (err) {
      console.error(err)
      alert('Errore nel caricamento della foto')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleToggleAvailability = async () => {
    if (!playerProfile?.id) return
    setTogggingAvail(true)
    try {
      await togglePlayerAvailability(playerProfile.id, !formData.disponibile)
      setFormData({ ...formData, disponibile: !formData.disponibile })
      alert(formData.disponibile ? 'Profilo non disponibile' : 'Profilo disponibile')
    } catch (err) {
      console.error(err)
      alert('Errore nel cambio disponibilità')
    }
    setTogggingAvail(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Sei sicuro? Questa azione è irreversibile. Digita "ELIMINA" per confermare.')) return
    const confirmation = prompt('Digita ELIMINA per confermare:')
    if (confirmation !== 'ELIMINA') {
      alert('Cancellazione annullata')
      return
    }

    try {
      const success = await deletePlayerAccount(profile?.id || '')
      if (success) {
        alert('Account eliminato')
        router.push('/auth/login')
      } else {
        alert('Errore nella cancellazione')
      }
    } catch (err) {
      console.error(err)
      alert('Errore')
    }
  }

  const handleCopyCVLink = () => {
    const link = `${window.location.origin}/public-profile?p=${playerProfile?.id}`
    navigator.clipboard.writeText(link)
    alert('Link copiato negli appunti!')
  }

  const addCareerEntry = async () => {
    if (!newEntry.stagione || !newEntry.squadra) return

    const { data } = await supabase.from('career_history').insert({
      player_id: playerProfile?.id,
      ...newEntry
    }).select()

    if (data) {
      setCareer([...career, data[0]])
      setNewEntry({ stagione: '', squadra: '', categoria: '', presenze: '', reti: '' })
    }
  }

  const deleteCareerEntry = async (id: string) => {
    await supabase.from('career_history').delete().eq('id', id)
    setCareer(career.filter(c => c.id !== id))
  }

  if (!profile || profile.role !== 'player') {
    return (
      <DashboardLayout>
        <div style={{textAlign:'center',color:'var(--muted)'}}>Solo i giocatori possono modificare il CV</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:820,margin:'0 auto'}}>
        {/* HEADER */}
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:16,marginBottom:30}}>
          <div>
            <div style={{fontFamily:'Spline Sans Mono',fontSize:12,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--acid)',marginBottom:11}}>/ Il tuo profilo · {cfg?.icon} {cfg?.nome}</div>
            <h1 style={{fontFamily:'Anton',fontWeight:400,fontSize:'clamp(30px,4.5vw,46px)',textTransform:'uppercase',lineHeight:1,letterSpacing:'-.01em',color:'var(--text)'}}>Il tuo CV</h1>
            <p style={{color:'var(--muted)',maxWidth:'52ch',fontSize:15,marginTop:10}}>Aggiorna i tuoi dati: il profilo è già visibile alle società.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end',flexShrink:0}}>
            <button
              onClick={handleToggleAvailability}
              disabled={togglegingAvail}
              style={{background:formData.disponibile?'var(--acid)':'rgba(255,90,60,.2)',color:formData.disponibile?'#0b0d0a':'var(--danger)',fontFamily:'Archivo',fontWeight:800,fontSize:13,padding:'9px 16px',borderRadius:9,border:'none',cursor:'pointer',transition:'.16s'}}
            >
              {formData.disponibile?'🟢 Disponibile':'🔴 Non disponibile'}
            </button>
            <div style={{background:'var(--card-2)',border:'1px solid var(--line)',borderRadius:9,padding:'6px 13px',display:'flex',alignItems:'center',gap:8,fontFamily:'Spline Sans Mono',fontSize:12,color:'var(--muted)'}}>
              👁 <span style={{fontFamily:'Anton',fontSize:16,color:'var(--acid)'}}>{viewCount}</span> visite
            </div>
          </div>
        </div>

        {/* VIEW LOG - Chi ha visto il profilo */}
        {viewLog.length > 0 && (
          <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:'var(--radius)',padding:20,marginBottom:22}}>
            <div style={{fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--acid)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
              👁 Chi ha visto il tuo profilo
            </div>
            {viewLog.map((v: any) => (
              <div key={v.id} style={{display:'flex',gap:12,alignItems:'center',padding:'12px 0',borderBottom:'1px solid var(--line-soft)'}}>
                <div style={{width:40,height:40,borderRadius:9,background:'var(--bg-2)',border:'1px solid var(--line)',display:'grid',placeItems:'center',fontFamily:'Anton',fontSize:14,color:'var(--acid)',flexShrink:0}}>
                  {v.club_profiles?.club_name?.charAt(0).toUpperCase()}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:'var(--text)'}}>{v.club_profiles?.club_name || 'Società'}</div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>
                    {new Date(v.created_at).toLocaleDateString('it-IT', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {viewLog.length < viewCount && (
              <div style={{fontFamily:'Spline Sans Mono',fontSize:11,color:'var(--muted-2)',marginTop:8}}>+ {viewCount - viewLog.length} visite precedenti</div>
            )}
          </div>
        )}

        {/* MATCHING ADS - Squadre che potrebbero interessarti */}
        {matchingAds.length > 0 && (
          <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:'var(--radius)',padding:20,marginBottom:22}}>
            <div style={{fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--acid)',marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
              ⚡ Squadre che potrebbero interessarti
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:12}}>
              {matchingAds.slice(0, 6).map((ad: any) => (
                <div key={ad.id} style={{background:'var(--bg-2)',border:'1px solid var(--line)',borderRadius:10,padding:14,display:'flex',flexDirection:'column'}}>
                  <div style={{fontWeight:600,fontSize:14,color:'var(--text)'}}>{ad.club_profiles?.club_name}</div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:6}}>{ad.ruolo} · {ad.cat}</div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{ad.regione}</div>
                  <Button style={{marginTop:10,width:'100%',fontSize:12}}>Proponiti</Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMPORT BANNER */}
        <div style={{background:'linear-gradient(180deg,rgba(65,194,133,.06),var(--card))',border:'1px solid var(--acid-dim)',borderRadius:18,padding:24,display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap',marginBottom:22}}>
          <div>
            <div style={{fontWeight:800,fontSize:15}}>Hai già una carriera nei nostri archivi?</div>
            <div style={{color:'var(--muted)',fontSize:'13.5px',marginTop:4}}>Importa stagioni, squadre e reti: dovrai solo confermarle.</div>
          </div>
          <Button style={{flexShrink:0}}>Importa la mia carriera</Button>
        </div>

        {/* MAIN FORM */}
        <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,padding:30,marginBottom:22}}>
          <h2 style={{fontSize:18,fontWeight:'bold',marginBottom:24,color:'var(--text)'}}>Dati personali</h2>

          <div style={{display:'grid',gap:16}}>
            {/* Foto */}
            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Foto personale</label>
              <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
                <div style={{width:90,height:120,borderRadius:13,background:'var(--card-2)',border:'1px solid var(--line)',display:'grid',placeItems:'center',fontFamily:'Anton',fontSize:34,color:'var(--acid)',flexShrink:0,overflow:'hidden'}}>
                  {photoPreview || formData.photo ? (
                    <img src={photoPreview || formData.photo} alt="Photo" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  ) : '📷'}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={uploadingPhoto} style={{display:'none'}} id="photo-input" />
                  <label htmlFor="photo-input" style={{display:'inline-block',background:'var(--accent,var(--acid))',color:'#0b0d0a',fontFamily:'Archivo',fontWeight:800,fontSize:13,padding:'9px 16px',borderRadius:9,cursor:'pointer',marginBottom:8}}>
                    {uploadingPhoto ? '⏳ Caricamento...' : '📤 Carica foto'}
                  </label>
                  <div style={{fontFamily:'Spline Sans Mono',fontSize:11,color:'var(--muted-2)',letterSpacing:'.02em'}}>JPG o PNG · ridimensionata in automatico</div>
                </div>
              </div>
            </div>

            {/* Nome */}
            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Nome e cognome *</label>
              <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,transition:'.16s'}} />
            </div>

            {/* Data nascita, Ruolo, Categoria */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:14}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Data di nascita</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10}} />
                {age && <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>{age} anni</div>}
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Ruolo *</label>
                <select value={formData.ruolo} onChange={e => setFormData({...formData, ruolo: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,cursor:'pointer'}}>
                  <option value="">Seleziona</option>
                  {cfg?.ruoli?.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Categoria *</label>
                <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,cursor:'pointer'}}>
                  <option value="">Seleziona</option>
                  {cfg?.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Piede, Altezza, Disponibilità */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:14}}>
              {cfg?.foot && (
                <div>
                  <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Piede</label>
                  <select value={formData.piede} onChange={e => setFormData({...formData, piede: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,cursor:'pointer'}}>
                    <option>Destro</option>
                    <option>Sinistro</option>
                    <option>Ambidestro</option>
                  </select>
                </div>
              )}
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Altezza (cm)</label>
                <input type="number" value={formData.altezza} onChange={e => setFormData({...formData, altezza: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Disponibilità</label>
                <select value={formData.disponibile ? 'si' : 'no'} onChange={e => setFormData({...formData, disponibile: e.target.value === 'si'})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,cursor:'pointer'}}>
                  <option value="si">🟢 Disponibile</option>
                  <option value="no">🔴 Non disponibile</option>
                </select>
              </div>
            </div>

            {/* Regione, Provincia, Squadra */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:14}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Regione *</label>
                <select value={formData.regione} onChange={e => setFormData({...formData, regione: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,cursor:'pointer'}}>
                  <option value="">Seleziona</option>
                  {['Lazio','Campania','Lombardia','Veneto','Piemonte','Toscana','Emilia-Romagna','Sicilia'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Provincia</label>
                <input type="text" value={formData.provincia} onChange={e => setFormData({...formData, provincia: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Ultima squadra</label>
                <input type="text" value={formData.squadra} onChange={e => setFormData({...formData, squadra: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10}} />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Presentazione *</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,minHeight:100,resize:'vertical'}} />
            </div>

            {/* Video, Contatto */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))',gap:14}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Link video highlights</label>
                <input type="text" placeholder="https://youtube.com/..." value={formData.video} onChange={e => setFormData({...formData, video: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10}} />
                {formData.video && getVideoEmbedUrl(formData.video) && (
                  <div style={{marginTop:10,borderRadius:10,overflow:'hidden',position:'relative',paddingBottom:'56.25%',height:0}}>
                    <iframe
                      src={getVideoEmbedUrl(formData.video) || ''}
                      style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Contatto privato</label>
                <input type="text" placeholder="Email o telefono" value={formData.contatto} onChange={e => setFormData({...formData, contatto: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10}} />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} style={{marginTop:24,width:'100%'}} disabled={saving}>
            {saving ? '💾 Salvataggio...' : '💾 Salva profilo'}
          </Button>
        </div>

        {/* STORICO CARRIERA */}
        <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,padding:30,marginBottom:22}}>
          <h2 style={{fontSize:18,fontWeight:'bold',marginBottom:16,color:'var(--text)'}}>Storico carriera</h2>

          {career.length > 0 && (
            <div style={{marginBottom:16}}>
              {career.map((c: any) => (
                <div key={c.id} style={{background:'rgba(65,194,133,0.08)',padding:12,borderRadius:10,marginBottom:8,fontSize:13,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:600,color:'var(--text)'}}>{c.stagione} • {c.squadra}</div>
                    <div style={{color:'var(--muted)',fontSize:12,marginTop:2}}>{c.categoria} {c.presenze ? `• ${c.presenze} presenze` : ''} {c.reti ? `• ${c.reti} reti` : ''}</div>
                  </div>
                  <button onClick={() => deleteCareerEntry(c.id)} style={{background:'rgba(255,90,60,0.2)',color:'var(--danger)',border:'none',padding:'4px 8px',borderRadius:6,cursor:'pointer',fontSize:12}}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={{background:'rgba(28,33,24,0.3)',padding:12,borderRadius:10}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))',gap:10,marginBottom:10}}>
              <input type="text" placeholder="Stagione" value={newEntry.stagione} onChange={e => setNewEntry({...newEntry, stagione: e.target.value})} style={{fontSize:12,background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',padding:'9px 11px',borderRadius:8}} />
              <input type="text" placeholder="Squadra" value={newEntry.squadra} onChange={e => setNewEntry({...newEntry, squadra: e.target.value})} style={{fontSize:12,background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',padding:'9px 11px',borderRadius:8}} />
              <select value={newEntry.categoria} onChange={e => setNewEntry({...newEntry, categoria: e.target.value})} style={{fontSize:12,background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',padding:'9px 11px',borderRadius:8,cursor:'pointer'}}>
                <option value="">Categoria</option>
                {cfg?.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Presenze" value={newEntry.presenze} onChange={e => setNewEntry({...newEntry, presenze: e.target.value})} style={{fontSize:12,background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',padding:'9px 11px',borderRadius:8}} />
              <input type="number" placeholder={cfg?.score} value={newEntry.reti} onChange={e => setNewEntry({...newEntry, reti: e.target.value})} style={{fontSize:12,background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',padding:'9px 11px',borderRadius:8}} />
            </div>
            <Button onClick={addCareerEntry} style={{width:'100%',fontSize:12}}>+ Aggiungi stagione</Button>
          </div>
        </div>

        {/* COSA CERCO */}
        <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,padding:30,marginBottom:22}}>
          <h2 style={{fontSize:18,fontWeight:'bold',marginBottom:16,color:'var(--text)'}}>Cosa cerco</h2>

          <div style={{display:'grid',gap:14}}>
            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Categoria minima desiderata</label>
              <select value={searchPrefs.cat_min} onChange={e => setSearchPrefs({...searchPrefs, cat_min: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,cursor:'pointer'}}>
                <option value="">Qualsiasi</option>
                {cfg?.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Regione preferita</label>
              <select value={searchPrefs.regione_pref} onChange={e => setSearchPrefs({...searchPrefs, regione_pref: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,cursor:'pointer'}}>
                <option value="">Qualsiasi</option>
                {['Lazio','Campania','Lombardia','Veneto','Piemonte','Toscana','Emilia-Romagna','Sicilia'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Note libere</label>
              <textarea value={searchPrefs.note} onChange={e => setSearchPrefs({...searchPrefs, note: e.target.value})} placeholder="Es. Cerco progetto serio, disponibile 3 volte a settimana…" style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',fontFamily:'Archivo',fontSize:'14.5px',padding:'12px 14px',borderRadius:10,minHeight:80,resize:'vertical'}} />
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <button
            onClick={handleDeleteAccount}
            style={{background:'transparent',border:'1px solid rgba(255,90,60,.4)',color:'var(--danger)',fontFamily:'Archivo',fontWeight:800,fontSize:15,padding:'14px 24px',borderRadius:11,cursor:'pointer',transition:'.18s'}}
          >
            Elimina account
          </button>
          <button
            onClick={handleCopyCVLink}
            style={{background:'var(--card)',border:'1px solid var(--line)',color:'var(--acid)',fontFamily:'Archivo',fontWeight:800,fontSize:15,padding:'14px 24px',borderRadius:11,cursor:'pointer',transition:'.18s'}}
          >
            🔗 Copia link pubblico
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
