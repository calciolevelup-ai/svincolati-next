'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'

export default function ClubPlayersPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [players, setPlayers] = useState<any[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // Load all players for this sport
    const { data: playersData } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('sport', profile?.sport)
      .order('views', { ascending: false })
      .limit(100)

    // Load favorites
    const { data: favData } = await supabase
      .from('favorites')
      .select('target_id')
      .eq('user_id', profile?.id)
      .eq('target_type', 'player')

    setPlayers(playersData || [])
    setFavorites(favData?.map(f => f.target_id) || [])
    setLoading(false)
  }

  const toggleFavorite = async (playerId: string) => {
    if (favorites.includes(playerId)) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', profile?.id)
        .eq('target_id', playerId)
      setFavorites(favorites.filter(f => f !== playerId))
    } else {
      await supabase.from('favorites').insert({
        user_id: profile?.id,
        target_id: playerId,
        target_type: 'player'
      })
      setFavorites([...favorites, playerId])
    }
  }

  const filteredPlayers = players.filter(p =>
    p.nome?.toLowerCase().includes(searchName.toLowerCase())
  )

  if (profile?.role !== 'club') {
    return (
      <DashboardLayout>
        <div style={{textAlign:'center',color:'var(--muted)'}}>Solo le società possono visualizzare i giocatori</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <div className="page-head mb-4">
          <h1>Directory giocatori</h1>
          <p>Sfoglia tutti i giocatori disponibili</p>
        </div>

        {/* Search */}
        <div style={{marginBottom:20}}>
          <input
            type="text"
            placeholder="Cerca per nome..."
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Players Grid */}
        {loading ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
        ) : filteredPlayers.length === 0 ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
            <div style={{fontSize:32,marginBottom:12}}>⚽</div>
            Nessun giocatore trovato
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',gap:12}}>
            {filteredPlayers.map(p => (
              <div key={p.id} className="card" style={{position:'relative'}}>
                {/* Star Button */}
                <button
                  onClick={() => toggleFavorite(p.id)}
                  style={{
                    position:'absolute',
                    top:10,
                    right:10,
                    background:'none',
                    border:'none',
                    fontSize:20,
                    cursor:'pointer',
                    filter: favorites.includes(p.id) ? 'brightness(1.2)' : 'brightness(0.8)'
                  }}
                >
                  {favorites.includes(p.id) ? '⭐' : '☆'}
                </button>

                {/* Player Info */}
                <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:10}}>
                  <div style={{width:44,height:44,borderRadius:10,background:p.photo ? undefined : 'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontFamily:'Anton',flexShrink:0,overflow:'hidden',backgroundImage:p.photo ? `url(${p.photo})` : undefined,backgroundSize:'cover',backgroundPosition:'center'}}>
                    {!p.photo && initials(p.nome)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:'bold',color:'var(--text)',display:'flex',alignItems:'center',gap:6}}>
                      {p.nome}
                      <VerifiedBadge verified={p.verified} tessera={p.tessera} />
                    </div>
                    <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{p.ruolo} • {p.cat}</div>
                    <div style={{fontSize:10,color:'var(--muted-2)',marginTop:2}}>
                      {p.eta && `${p.eta}anni`} {p.altezza && `• ${p.altezza}cm`}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div style={{fontSize:11,color:'var(--muted-2)',marginBottom:8,lineHeight:1.3}}>
                  📍 {p.regione} {p.provincia && `• ${p.provincia}`}
                </div>

                {/* Bio Preview */}
                {p.bio && (
                  <div style={{fontSize:11,color:'var(--muted)',lineHeight:1.4,marginBottom:10,maxHeight:50,overflow:'hidden'}}>
                    {p.bio.substring(0, 100)}...
                  </div>
                )}

                {/* Stats */}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:10,fontSize:10,color:'var(--muted-2)'}}>
                  <div style={{background:'rgba(65,194,133,0.08)',padding:'6px 8px',borderRadius:6,textAlign:'center'}}>
                    👁 {p.views || 0} visualizzazioni
                  </div>
                  <div style={{background:'rgba(76,194,255,0.08)',padding:'6px 8px',borderRadius:6,textAlign:'center'}}>
                    {p.disponibile ? '✅ Disponibile' : '❌ Non disp.'}
                  </div>
                </div>

                {/* Action Button */}
                <Button style={{width:'100%',fontSize:12,padding:'8px 12px'}}>
                  💬 Contatta
                </Button>
              </div>
            ))}
          </div>
        )}

        <div style={{fontSize:12,color:'var(--muted)',textAlign:'center',marginTop:24}}>
          {filteredPlayers.length} giocatori trovati
        </div>
      </div>
    </DashboardLayout>
  )
}
