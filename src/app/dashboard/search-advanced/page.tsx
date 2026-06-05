'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { scfg, initials, calcAge } from '@/lib/utils'

type SearchMode = 'players' | 'staff' | 'teams'

const REGIONS = ['Lazio','Campania','Lombardia','Veneto','Piemonte','Toscana','Emilia-Romagna','Sicilia','Puglia','Marche']

const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export default function SearchAdvancedPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [mode, setMode] = useState<SearchMode>('players')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Common filters
  const [nameSearch, setNameSearch] = useState('')
  const [regione, setRegione] = useState('')
  const [provincia, setProvincia] = useState('')

  // Player filters
  const [ruolo, setRuolo] = useState('')
  const [piede, setPiede] = useState('')
  const [catMin, setCatMin] = useState('')
  const [catMax, setCatMax] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [heightMin, setHeightMin] = useState('')
  const [heightMax, setHeightMax] = useState('')

  // Staff filters
  const [staffType, setStaffType] = useState('')
  const [staffCat, setStaffCat] = useState('')

  // Team filters
  const [teamRuolo, setTeamRuolo] = useState('')
  const [teamCat, setTeamCat] = useState('')
  const [distance, setDistance] = useState('50')

  const cfg = scfg(profile?.sport)

  const handleSearch = async () => {
    setLoading(true)
    try {
      let query

      if (mode === 'players') {
        query = supabase.from('player_profiles').select('*').eq('sport', profile?.sport)

        if (nameSearch) query = query.ilike('nome', `%${nameSearch}%`)
        if (ruolo) query = query.eq('ruolo', ruolo)
        if (regione) query = query.eq('regione', regione)
        if (provincia) query = query.ilike('provincia', `%${provincia}%`)
        if (catMin) {
          const idx = cfg.categorie?.indexOf(catMin) || 0
          query = query.filter('cat', 'in', `(${cfg.categorie?.slice(idx).join(',')})`)
        }
        if (heightMin) query = query.gte('altezza', parseInt(heightMin))
        if (heightMax) query = query.lte('altezza', parseInt(heightMax))

        const { data } = await query.limit(100)
        let filtered = data || []

        // Age filtering (since calculated)
        if (ageMin || ageMax) {
          filtered = filtered.filter(p => {
            const age = p.eta || calcAge(profile?.dob)
            if (ageMin && age < parseInt(ageMin)) return false
            if (ageMax && age > parseInt(ageMax)) return false
            return true
          })
        }

        setResults(filtered)

      } else if (mode === 'staff') {
        query = supabase.from('player_profiles').select('*')
          .eq('sport', profile?.sport)
          .eq('staff_type', staffType)

        if (nameSearch) query = query.ilike('nome', `%${nameSearch}%`)
        if (staffCat) query = query.eq('staff_cat', staffCat)
        if (regione) query = query.eq('regione', regione)

        const { data } = await query.limit(100)
        setResults(data || [])

      } else if (mode === 'teams') {
        query = supabase.from('ads').select('*').eq('sport', profile?.sport)

        if (teamRuolo) query = query.eq('ruolo', teamRuolo)
        if (teamCat) query = query.eq('cat', teamCat)
        if (regione) query = query.eq('regione', regione)

        const { data } = await query
        let filtered = data || []

        // Distance filter (if user has location)
        if (distance && profile?.dob) {
          const userLat = 45.4642 // Default (Verona)
          const userLng = 10.9924
          filtered = filtered.filter(ad => {
            // Would need club location - placeholder
            return true
          })
        }

        setResults(filtered)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const clearFilters = () => {
    setNameSearch('')
    setRegione('')
    setProvincia('')
    setRuolo('')
    setPiede('')
    setCatMin('')
    setCatMax('')
    setAgeMin('')
    setAgeMax('')
    setHeightMin('')
    setHeightMax('')
    setStaffType('')
    setStaffCat('')
    setTeamRuolo('')
    setTeamCat('')
    setResults([])
  }

  useEffect(() => {
    clearFilters()
  }, [mode])

  return (
    <DashboardLayout>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div className="page-head mb-4">
          <h1>Ricerca avanzata</h1>
          <p>Trova giocatori, staff o squadre con filtri personalizzati</p>
        </div>

        {/* Mode Toggle */}
        <div style={{display:'flex',gap:8,marginBottom:20}}>
          <button onClick={() => setMode('players')} className={`search-toggle-btn ${mode === 'players' ? 'active' : ''}`}>
            ⚽ Giocatori
          </button>
          <button onClick={() => setMode('staff')} className={`search-toggle-btn ${mode === 'staff' ? 'active' : ''}`}>
            🎓 Staff
          </button>
          <button onClick={() => setMode('teams')} className={`search-toggle-btn ${mode === 'teams' ? 'active' : ''}`}>
            🛡️ Squadre
          </button>
        </div>

        {/* Filters Panel */}
        <div className="panel mb-4">
          <h2 style={{fontSize:14,fontWeight:'bold',marginBottom:16,color:'var(--text)'}}>Filtri</h2>

          {/* Common Filters */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:10,marginBottom:14}}>
            <input type="text" placeholder="Cerca per nome..." value={nameSearch} onChange={e => setNameSearch(e.target.value)} className="search-input" style={{fontSize:12}} />
            <select value={regione} onChange={e => setRegione(e.target.value)} className="search-select" style={{fontSize:12}}>
              <option value="">Tutte le regioni</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <input type="text" placeholder="Provincia" value={provincia} onChange={e => setProvincia(e.target.value)} className="search-input" style={{fontSize:12}} />
          </div>

          {/* Mode-Specific Filters */}
          {mode === 'players' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:10,marginBottom:14}}>
              <select value={ruolo} onChange={e => setRuolo(e.target.value)} className="search-select" style={{fontSize:12}}>
                <option value="">Ruolo</option>
                {cfg.ruoli?.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {cfg.foot && (
                <select value={piede} onChange={e => setPiede(e.target.value)} className="search-select" style={{fontSize:12}}>
                  <option value="">Piede</option>
                  <option value="Destro">Destro</option>
                  <option value="Sinistro">Sinistro</option>
                  <option value="Ambidestro">Ambidestro</option>
                </select>
              )}
              <select value={catMin} onChange={e => setCatMin(e.target.value)} className="search-select" style={{fontSize:12}}>
                <option value="">Categoria</option>
                {cfg.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Età min" value={ageMin} onChange={e => setAgeMin(e.target.value)} className="search-input" style={{fontSize:12}} />
              <input type="number" placeholder="Età max" value={ageMax} onChange={e => setAgeMax(e.target.value)} className="search-input" style={{fontSize:12}} />
              <input type="number" placeholder="Altezza min (cm)" value={heightMin} onChange={e => setHeightMin(e.target.value)} className="search-input" style={{fontSize:12}} />
              <input type="number" placeholder="Altezza max (cm)" value={heightMax} onChange={e => setHeightMax(e.target.value)} className="search-input" style={{fontSize:12}} />
            </div>
          )}

          {mode === 'staff' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:10,marginBottom:14}}>
              <select value={staffType} onChange={e => setStaffType(e.target.value)} className="search-select" style={{fontSize:12}}>
                <option value="">Tipo staff</option>
                <option>Allenatore</option>
                <option>Vice allenatore</option>
                <option>Preparatore atletico</option>
                <option>Massofisioterapista</option>
              </select>
              <select value={staffCat} onChange={e => setStaffCat(e.target.value)} className="search-select" style={{fontSize:12}}>
                <option value="">Categoria</option>
                {cfg.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {mode === 'teams' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:10,marginBottom:14}}>
              <select value={teamRuolo} onChange={e => setTeamRuolo(e.target.value)} className="search-select" style={{fontSize:12}}>
                <option value="">Ruolo</option>
                {cfg.ruoli?.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={teamCat} onChange={e => setTeamCat(e.target.value)} className="search-select" style={{fontSize:12}}>
                <option value="">Categoria</option>
                {cfg.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Raggio (km)" value={distance} onChange={e => setDistance(e.target.value)} className="search-input" style={{fontSize:12}} />
            </div>
          )}

          {/* Buttons */}
          <div style={{display:'flex',gap:8}}>
            <Button onClick={handleSearch} disabled={loading}>🔍 Cerca</Button>
            <Button onClick={clearFilters} style={{background:'rgba(76,194,255,0.15)',border:'1px solid rgba(76,194,255,0.2)',color:'var(--blue)'}}>↻ Azzera</Button>
            <div style={{flex:1,textAlign:'right',fontSize:12,color:'var(--muted)',display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
              {results.length} risultati
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:12}}>
          {results.length === 0 && !loading && (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
              <div style={{fontSize:32,marginBottom:12}}>🔍</div>
              {nameSearch || ruolo || regione ? 'Nessun risultato trovato. Prova altri filtri.' : 'Usa i filtri per cercare'}
            </div>
          )}

          {loading && (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
          )}

          {mode === 'players' && results.map((p: any) => (
            <div key={p.id} className="card">
              <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontFamily:'Anton',flexShrink:0}}>
                  {initials(p.nome)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:'bold',color:'var(--text)'}}>{p.nome}</div>
                  <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{p.ruolo} • {p.cat}</div>
                  <div style={{fontSize:10,color:'var(--muted-2)',marginTop:2}}>{p.eta && `${p.eta} anni`} {p.altezza && `• ${p.altezza}cm`}</div>
                </div>
              </div>
              <div style={{fontSize:11,color:'var(--muted-2)',lineHeight:1.3,marginBottom:10}}>{p.regione} {p.provincia && `• ${p.provincia}`}</div>
              <Button style={{width:'100%',fontSize:11,padding:'6px 12px'}}>👁 Visualizza</Button>
            </div>
          ))}

          {mode === 'staff' && results.map((s: any) => (
            <div key={s.id} className="card">
              <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:10}}>
                <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontFamily:'Anton',flexShrink:0}}>
                  {initials(s.nome)}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:'bold',color:'var(--text)'}}>{s.nome}</div>
                  <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{s.staff_type} • {s.staff_cat}</div>
                  <div style={{fontSize:10,color:'var(--muted-2)',marginTop:2}}>{s.esperienza_anni && `${s.esperienza_anni} anni esperienza`}</div>
                </div>
              </div>
              <Button style={{width:'100%',fontSize:11,padding:'6px 12px'}}>👁 Visualizza</Button>
            </div>
          ))}

          {mode === 'teams' && results.map((ad: any) => (
            <div key={ad.id} className="card">
              <div style={{marginBottom:10}}>
                <div style={{fontSize:13,fontWeight:'bold',color:'var(--text)'}}>{ad.ruolo}</div>
                <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{ad.cat} • {ad.regione}</div>
              </div>
              <div style={{fontSize:11,color:'var(--muted-2)',lineHeight:1.3,marginBottom:10}}>{ad.descr}</div>
              <div style={{fontSize:10,color:'var(--muted-2)',marginBottom:10}}>
                {(() => {
                  const days = Math.ceil((new Date(ad.expires_at).getTime() - Date.now()) / (24 * 3600 * 1000))
                  return days > 0 ? `${days} giorni` : 'Scaduto'
                })()}
              </div>
              <Button style={{width:'100%',fontSize:11,padding:'6px 12px'}}>👁 Visualizza</Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
