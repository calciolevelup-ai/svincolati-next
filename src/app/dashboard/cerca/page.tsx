'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { scfg, initials } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { REGIONI } from '@/lib/constants'

export default function CercaPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [mode, setMode] = useState<'players' | 'staff' | 'teams'>('players')
  const [filters, setFilters] = useState({ name: '', ruolo: '', cat: '', regione: '' })
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const search = async () => {
    setLoading(true)
    try {
      if (mode === 'players') {
        const { data } = await supabase.from('player_profiles').select('*').eq('sport', profile?.sport)
        let filtered = data || []
        if (filters.name) filtered = filtered.filter(p => p.nome?.toLowerCase().includes(filters.name.toLowerCase()))
        if (filters.ruolo) filtered = filtered.filter(p => p.ruolo === filters.ruolo)
        if (filters.cat) filtered = filtered.filter(p => p.cat === filters.cat)
        if (filters.regione) filtered = filtered.filter(p => p.regione === filters.regione)
        setResults(filtered)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    search()
  }, [mode])

  const cfg = scfg(profile?.sport)

  return (
    <DashboardLayout>
      <div>
        <div className="page-head mb-4">
          <h1>Cerca</h1>
          <p>Trova giocatori, staff o squadre del tuo sport</p>
        </div>

        {/* Toggle Filtri */}
        <div style={{display:'flex',gap:'8px',marginBottom:'18px'}}>
          <button onClick={() => setMode('players')} className={`search-toggle-btn ${mode === 'players' ? 'active' : ''}`}>
            {cfg.icon} Giocatori
          </button>
          {profile?.role === 'club' && (
            <button onClick={() => setMode('staff')} className={`search-toggle-btn ${mode === 'staff' ? 'active' : ''}`}>
              🎓 Staff
            </button>
          )}
          <button onClick={() => setMode('teams')} className={`search-toggle-btn ${mode === 'teams' ? 'active' : ''}`}>
            🛡️ Squadre
          </button>
        </div>

        {/* Filtri */}
        <div className="panel mb-4">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:'10px',marginBottom:'12px'}}>
            <input
              type="text"
              placeholder="Cerca per nome..."
              value={filters.name}
              onChange={e => setFilters({...filters, name: e.target.value})}
              className="search-input"
            />
            <select
              value={filters.ruolo}
              onChange={e => setFilters({...filters, ruolo: e.target.value})}
              className="search-select"
            >
              <option value="">Tutti i ruoli</option>
              {cfg.ruoli?.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              value={filters.cat}
              onChange={e => setFilters({...filters, cat: e.target.value})}
              className="search-select"
            >
              <option value="">Tutte le categorie</option>
              {cfg.categorie?.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.regione}
              onChange={e => setFilters({...filters, regione: e.target.value})}
              className="search-select"
            >
              <option value="">Tutte le regioni</option>
              {REGIONI.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <Button onClick={search} loading={loading}>🔍 Filtra</Button>
            <Button onClick={() => { setFilters({name:'',ruolo:'',cat:'',regione:''}); search(); }} style={{background:'rgba(76, 194, 255, 0.15)',border:'1px solid rgba(76, 194, 255, 0.2)',color:'var(--blue)'}}>↻ Azzera</Button>
          </div>
        </div>

        {/* Risultati */}
        <div className="results">
          <div className="text-[var(--muted)] text-sm mb-4" style={{display:'flex',alignItems:'center',gap:'8px'}}>{results.length} 📋 risultati trovati</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((item: any) => (
              <div key={item.id} className="card" style={{display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                  <div style={{width:'44px',height:'44px',borderRadius:'10px',background:'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'18px',fontFamily:'Anton',fontWeight:'bold',color:'var(--acid)'}}>
                    {item.photo ? <img src={item.photo} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'10px'}} /> : initials(item.nome)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:'13px',fontWeight:'600',color:'var(--text)'}}>{item.nome}</div>
                    <div style={{fontSize:'12px',color:'var(--muted)',marginTop:'2px'}}>{item.ruolo || item.staffType}</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'10px',fontSize:'11px',color:'var(--muted-2)'}}>
                  {item.cat && <div style={{background:'rgba(76, 194, 255, 0.1)',padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(76, 194, 255, 0.15)'}}>📚 {item.cat}</div>}
                  {item.regione && <div style={{background:'rgba(65, 194, 133, 0.1)',padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(65, 194, 133, 0.15)'}}>📍 {item.regione}</div>}
                  {item.eta && <div style={{background:'rgba(76, 194, 255, 0.1)',padding:'6px 10px',borderRadius:'8px',border:'1px solid rgba(76, 194, 255, 0.15)',gridColumn:'1 / -1'}}>🎂 {item.eta} anni</div>}
                </div>
                <Button style={{width:'100%',marginTop:'auto'}}>💬 Contatta</Button>
              </div>
            ))}
          </div>
          {!loading && results.length === 0 && (
            <div style={{textAlign:'center',padding:'48px 20px',color:'var(--muted)',fontSize:'14px'}}>
              <div style={{fontSize:'32px',marginBottom:'12px'}}>🔍</div>
              Nessun risultato. Prova ad allargare i filtri.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
