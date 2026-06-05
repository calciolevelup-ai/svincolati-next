'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

const REGIONS = ['Lazio','Campania','Lombardia','Veneto','Piemonte','Toscana','Emilia-Romagna','Sicilia','Puglia','Marche']

export default function ClubProfilePage() {
  const { profile, clubProfile } = useAuth()
  const supabase = createClient()

  const [form, setForm] = useState({
    club_name: '',
    loc: '',
    regione: '',
    provincia: '',
    paese: '',
    impianto: '',
    impianto_indirizzo: '',
    figc: '',
    url: '',
    crest: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (clubProfile) {
      setForm({
        club_name: clubProfile.club_name || '',
        loc: clubProfile.loc || '',
        regione: clubProfile.regione || '',
        provincia: clubProfile.provincia || '',
        paese: clubProfile.paese || '',
        impianto: clubProfile.impianto || '',
        impianto_indirizzo: clubProfile.impianto_indirizzo || '',
        figc: clubProfile.figc || '',
        url: clubProfile.url || '',
        crest: clubProfile.crest || ''
      })
    }
  }, [clubProfile])

  const handleSave = async () => {
    setSaving(true)
    try {
      await supabase.from('club_profiles').update(form).eq('user_id', profile?.id)
      alert('Profilo salvato!')
    } catch (err) {
      alert('Errore nel salvataggio')
      console.error(err)
    }
    setSaving(false)
  }

  if (profile?.role !== 'club') {
    return <DashboardLayout><div style={{textAlign:'center',color:'var(--muted)'}}>Solo le società possono accedere</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:28,fontWeight:'bold',fontFamily:'Anton',color:'var(--text)',marginBottom:8}}>La mia squadra</h1>
          <p style={{fontSize:13,color:'var(--muted)'}}>Modifica i dati della tua società</p>
        </div>

        <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:14,padding:24}}>
          <div style={{display:'grid',gap:16}}>
            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Nome società *</label>
              <input type="text" value={form.club_name} onChange={e => setForm({...form, club_name: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Città</label>
                <input type="text" value={form.loc} onChange={e => setForm({...form, loc: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Regione *</label>
                <select value={form.regione} onChange={e => setForm({...form, regione: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}}>
                  <option value="">Seleziona</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Provincia</label>
                <input type="text" value={form.provincia} onChange={e => setForm({...form, provincia: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Zona/Quartiere</label>
                <input type="text" value={form.paese} onChange={e => setForm({...form, paese: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
              </div>
            </div>

            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Impianto sportivo</label>
              <input type="text" value={form.impianto} onChange={e => setForm({...form, impianto: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
            </div>

            <div>
              <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Indirizzo impianto</label>
              <input type="text" value={form.impianto_indirizzo} onChange={e => setForm({...form, impianto_indirizzo: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Codice FIGC</label>
                <input type="text" value={form.figc} onChange={e => setForm({...form, figc: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Sito web</label>
                <input type="url" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://..." style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,fontFamily:'Archivo',fontSize:'14.5px'}} />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{width:'100%',background:'var(--acid)',color:'#0b0d0a',fontWeight:800,fontSize:15,padding:'14px 24px',borderRadius:11,border:'none',cursor:'pointer',transition:'.18s',opacity:saving?0.7:1}}
            >
              {saving ? '💾 Salvataggio...' : '✓ Salva profilo'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
