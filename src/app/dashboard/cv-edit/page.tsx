'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { scfg, calcAge } from '@/lib/utils'

export default function CVEditPage() {
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

  const [career, setCareer] = useState<any[]>([])
  const [newEntry, setNewEntry] = useState({ stagione: '', squadra: '', categoria: '', presenze: '', reti: '' })
  const [saving, setSaving] = useState(false)
  const [dob, setDob] = useState('')

  useEffect(() => {
    if (playerProfile) {
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
      if (playerProfile.career_history) {
        setCareer(playerProfile.career_history)
      }
    }
  }, [playerProfile])

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

      alert('Profilo salvato!')
    } catch (err) {
      alert('Errore nel salvataggio')
      console.error(err)
    }
    setSaving(false)
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
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div className="page-head mb-4">
          <h1>Modifica il mio CV</h1>
          <p>Completa il tuo profilo per avere più visibilità</p>
        </div>

        <div className="panel mb-4">
          <h2 style={{fontSize:18,fontWeight:'bold',marginBottom:16,color:'var(--text)'}}>Dati personali</h2>

          <div className="grid" style={{gap:12}}>
            <div>
              <label>Nome completo *</label>
              <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="search-input" />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label>Data di nascita *</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="search-input" />
                {age && <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>{age} anni</div>}
              </div>
              <div>
                <label>Ruolo *</label>
                <select value={formData.ruolo} onChange={e => setFormData({...formData, ruolo: e.target.value})} className="search-select">
                  <option value="">Seleziona ruolo</option>
                  {cfg.ruoli?.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
              <div>
                <label>Categoria *</label>
                <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="search-select">
                  <option value="">Seleziona</option>
                  {cfg.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {cfg.foot && (
                <div>
                  <label>Piede</label>
                  <select value={formData.piede} onChange={e => setFormData({...formData, piede: e.target.value})} className="search-select">
                    <option>Destro</option>
                    <option>Sinistro</option>
                    <option>Ambidestro</option>
                  </select>
                </div>
              )}
              <div>
                <label>Altezza (cm)</label>
                <input type="number" value={formData.altezza} onChange={e => setFormData({...formData, altezza: e.target.value})} className="search-input" />
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label>Regione *</label>
                <select value={formData.regione} onChange={e => setFormData({...formData, regione: e.target.value})} className="search-select">
                  <option value="">Seleziona</option>
                  {['Lazio','Campania','Lombardia','Veneto','Piemonte','Toscana','Emilia-Romagna','Sicilia'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label>Provincia</label>
                <input type="text" value={formData.provincia} onChange={e => setFormData({...formData, provincia: e.target.value})} className="search-input" />
              </div>
            </div>

            <div>
              <label>Ultima squadra</label>
              <input type="text" value={formData.squadra} onChange={e => setFormData({...formData, squadra: e.target.value})} className="search-input" />
            </div>

            <div>
              <label>Bio/Descrizione *</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="search-input" style={{minHeight:100,resize:'none'}} />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label>Link video</label>
                <input type="text" placeholder="es: youtube.com/..." value={formData.video} onChange={e => setFormData({...formData, video: e.target.value})} className="search-input" />
              </div>
              <div>
                <label>Contatto privato</label>
                <input type="text" placeholder="Email o telefono" value={formData.contatto} onChange={e => setFormData({...formData, contatto: e.target.value})} className="search-input" />
              </div>
            </div>
          </div>

          <Button onClick={handleSave} style={{marginTop:16,width:'100%'}} disabled={saving}>
            {saving ? '💾 Salvataggio...' : '💾 Salva profilo'}
          </Button>
        </div>

        <div className="panel mb-4">
          <h2 style={{fontSize:18,fontWeight:'bold',marginBottom:16,color:'var(--text)'}}>Storico carriera</h2>

          {career.length > 0 && (
            <div style={{marginBottom:16}}>
              {career.map((c, i) => (
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
              <input type="text" placeholder="Stagione" value={newEntry.stagione} onChange={e => setNewEntry({...newEntry, stagione: e.target.value})} className="search-input" style={{fontSize:12}} />
              <input type="text" placeholder="Squadra" value={newEntry.squadra} onChange={e => setNewEntry({...newEntry, squadra: e.target.value})} className="search-input" style={{fontSize:12}} />
              <select value={newEntry.categoria} onChange={e => setNewEntry({...newEntry, categoria: e.target.value})} className="search-select" style={{fontSize:12}}>
                <option value="">Categoria</option>
                {cfg.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Presenze" value={newEntry.presenze} onChange={e => setNewEntry({...newEntry, presenze: e.target.value})} className="search-input" style={{fontSize:12}} />
              <input type="number" placeholder={cfg.score} value={newEntry.reti} onChange={e => setNewEntry({...newEntry, reti: e.target.value})} className="search-input" style={{fontSize:12}} />
            </div>
            <Button onClick={addCareerEntry} style={{width:'100%',fontSize:12}}>+ Aggiungi stagione</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
