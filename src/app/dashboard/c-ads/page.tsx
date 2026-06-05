'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { scfg } from '@/lib/utils'

export default function ClubAdsPage() {
  const { profile, clubProfile } = useAuth()
  const supabase = createClient()

  const [ads, setAds] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    ruolo: '',
    cat: '',
    regione: '',
    provincia: '',
    descr: ''
  })
  const [loading, setLoading] = useState(false)

  const cfg = scfg(profile?.sport)

  useEffect(() => {
    loadAds()
  }, [])

  const loadAds = async () => {
    const { data } = await supabase.from('ads').select('*').eq('club_id', profile?.id).order('created_at', { ascending: false })
    if (data) setAds(data)
  }

  const handleCreateAd = async () => {
    if (!formData.ruolo || !formData.cat || !formData.regione) {
      alert('Riempi i campi obbligatori')
      return
    }

    setLoading(true)
    try {
      const { data } = await supabase.from('ads').insert({
        club_id: profile?.id,
        sport: profile?.sport,
        ...formData,
        expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
      }).select()

      if (data) {
        setAds([data[0], ...ads])
        setFormData({ ruolo: '', cat: '', regione: '', provincia: '', descr: '' })
        setShowForm(false)
      }
    } catch (err) {
      alert('Errore nella creazione')
      console.error(err)
    }
    setLoading(false)
  }

  const deleteAd = async (id: string) => {
    if (!confirm('Eliminare questo annuncio?')) return
    await supabase.from('ads').delete().eq('id', id)
    setAds(ads.filter(a => a.id !== id))
  }

  if (profile?.role !== 'club') {
    return (
      <DashboardLayout>
        <div style={{textAlign:'center',color:'var(--muted)'}}>Solo le società possono creare annunci</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div className="flex-between mb-4">
          <div className="page-head">
            <h1>Ricerche & Preferiti</h1>
            <p>Crea annunci per trovare giocatori</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕' : '+ Nuovo annuncio'}
          </Button>
        </div>

        {showForm && (
          <div className="panel mb-4">
            <h2 style={{fontSize:16,fontWeight:'bold',marginBottom:12,color:'var(--text)'}}>Crea un nuovo annuncio</h2>

            <div className="grid" style={{gap:12}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <label>Ruolo ricercato *</label>
                  <select value={formData.ruolo} onChange={e => setFormData({...formData, ruolo: e.target.value})} className="search-select">
                    <option value="">Seleziona</option>
                    {cfg.ruoli?.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label>Categoria *</label>
                  <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="search-select">
                    <option value="">Seleziona</option>
                    {cfg.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
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
                <label>Descrizione *</label>
                <textarea value={formData.descr} onChange={e => setFormData({...formData, descr: e.target.value})} className="search-input" style={{minHeight:80,resize:'none'}} placeholder="Descrivi il profilo che stai cercando..." />
              </div>

              <Button onClick={handleCreateAd} disabled={loading} style={{width:'100%'}}>
                {loading ? '⏳ Creazione...' : '✓ Crea annuncio'}
              </Button>
            </div>
          </div>
        )}

        <div>
          {ads.length === 0 ? (
            <div style={{textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
              <div style={{fontSize:32,marginBottom:12}}>📝</div>
              Nessun annuncio. Creane uno per trovare giocatori!
            </div>
          ) : (
            <div className="grid">
              {ads.map(ad => {
                const daysLeft = Math.ceil((new Date(ad.expires_at).getTime() - Date.now()) / (24 * 3600 * 1000))
                return (
                  <div key={ad.id} className="card">
                    <div className="flex-between" style={{marginBottom:10}}>
                      <div>
                        <div style={{fontSize:15,fontWeight:'bold',color:'var(--text)'}}>{ad.ruolo}</div>
                        <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{ad.cat} • {ad.regione}</div>
                      </div>
                      <div style={{fontSize:11,background:'rgba(76,194,255,0.1)',color:'var(--blue)',padding:'4px 8px',borderRadius:6}}>
                        {daysLeft}g rimasti
                      </div>
                    </div>
                    <div style={{fontSize:13,color:'var(--muted)',marginBottom:10,lineHeight:1.4}}>{ad.descr}</div>
                    <button onClick={() => deleteAd(ad.id)} style={{color:'var(--danger)',background:'none',border:'none',cursor:'pointer',fontSize:12,fontWeight:600}}>🗑 Elimina</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
