'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'

type StatusFilter = 'all' | 'inviata' | 'vista' | 'accettata' | 'rifiutata'

export default function ClubCandidaturesPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [candidatures, setCandidatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    loadCandidatures()
  }, [])

  const loadCandidatures = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('candidatures')
      .select(`
        *,
        player:player_profiles(*),
        ad:ads(*)
      `)
      .eq('club_id', profile?.id)
      .order('created_at', { ascending: false })

    if (data) setCandidatures(data)
    setLoading(false)
  }

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('candidatures').update({ status: newStatus }).eq('id', id)
    loadCandidatures()
  }

  const filteredCandidatures = statusFilter === 'all'
    ? candidatures
    : candidatures.filter(c => c.status === statusFilter)

  const counts = {
    all: candidatures.length,
    inviata: candidatures.filter(c => c.status === 'inviata').length,
    vista: candidatures.filter(c => c.status === 'vista').length,
    accettata: candidatures.filter(c => c.status === 'accettata').length,
    rifiutata: candidatures.filter(c => c.status === 'rifiutata').length
  }

  const statusBadge: Record<string, { color: string; label: string }> = {
    inviata: { color: 'rgba(76, 194, 255, 0.2)', label: '📤 Inviata' },
    vista: { color: 'rgba(255, 180, 0, 0.2)', label: '👀 Vista' },
    accettata: { color: 'rgba(65, 194, 133, 0.2)', label: '✅ Accettata' },
    rifiutata: { color: 'rgba(255, 90, 60, 0.15)', label: '❌ Rifiutata' }
  }

  if (profile?.role !== 'club') {
    return (
      <DashboardLayout>
        <div style={{textAlign:'center',color:'var(--muted)'}}>Solo le società possono visualizzare le candidature ricevute</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:800,margin:'0 auto'}}>
        <div className="page-head mb-4">
          <h1>Candidature ricevute</h1>
          <p>Gestisci le candidature dai giocatori</p>
        </div>

        {/* Status Filters */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(110px, 1fr))',gap:8,marginBottom:20}}>
          <button
            onClick={() => setStatusFilter('all')}
            className={`search-toggle-btn ${statusFilter === 'all' ? 'active' : ''}`}
            style={{fontSize:11}}
          >
            Tutte ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('inviata')}
            className={`search-toggle-btn ${statusFilter === 'inviata' ? 'active' : ''}`}
            style={{fontSize:11}}
          >
            📤 ({counts.inviata})
          </button>
          <button
            onClick={() => setStatusFilter('vista')}
            className={`search-toggle-btn ${statusFilter === 'vista' ? 'active' : ''}`}
            style={{fontSize:11}}
          >
            👀 ({counts.vista})
          </button>
          <button
            onClick={() => setStatusFilter('accettata')}
            className={`search-toggle-btn ${statusFilter === 'accettata' ? 'active' : ''}`}
            style={{fontSize:11}}
          >
            ✅ ({counts.accettata})
          </button>
          <button
            onClick={() => setStatusFilter('rifiutata')}
            className={`search-toggle-btn ${statusFilter === 'rifiutata' ? 'active' : ''}`}
            style={{fontSize:11}}
          >
            ❌ ({counts.rifiutata})
          </button>
        </div>

        {/* Candidatures List */}
        {loading ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
        ) : filteredCandidatures.length === 0 ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
            <div style={{fontSize:32,marginBottom:12}}>📋</div>
            Ancora nessuna candidatura
          </div>
        ) : (
          <div className="grid">
            {filteredCandidatures.map(c => {
              const badge = statusBadge[c.status]
              const daysAgo = Math.ceil((Date.now() - new Date(c.created_at).getTime()) / (24 * 3600 * 1000))

              return (
                <div key={c.id} className="panel">
                  <div className="flex-between" style={{marginBottom:12}}>
                    <div style={{display:'flex',gap:10,alignItems:'flex-start',flex:1}}>
                      <div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontFamily:'Anton',flexShrink:0}}>
                        {initials(c.player?.nome)}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:'bold',color:'var(--text)',display:'flex',alignItems:'center',gap:6}}>
                          {c.player?.nome}
                          <VerifiedBadge verified={c.player?.verified} tessera={c.player?.tessera} />
                        </div>
                        <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>{c.player?.ruolo} • {c.player?.cat}</div>
                        <div style={{fontSize:10,color:'var(--muted-2)',marginTop:2}}>
                          Per annuncio: {c.ad?.ruolo} ({c.ad?.cat})
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: badge?.color,
                      color: c.status === 'inviata' ? 'var(--blue)' : c.status === 'vista' ? '#ffd700' : c.status === 'accettata' ? 'var(--acid)' : 'var(--danger)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {badge?.label}
                    </div>
                  </div>

                  <div style={{fontSize:10,color:'var(--muted-2)',marginBottom:12,borderBottom:'1px solid var(--line-soft)',paddingBottom:12}}>
                    Candidatura inviata {daysAgo === 0 ? 'oggi' : `${daysAgo}d fa`}
                  </div>

                  {/* Action Buttons */}
                  <div style={{display:'flex',gap:8}}>
                    {c.status === 'inviata' && (
                      <>
                        <Button
                          onClick={() => updateStatus(c.id, 'vista')}
                          style={{flex:1,fontSize:11,padding:'6px 10px',background:'rgba(255,180,0,0.15)',border:'1px solid rgba(255,180,0,0.2)',color:'#ffd700'}}
                        >
                          Visualizza
                        </Button>
                        <Button
                          onClick={() => updateStatus(c.id, 'accettata')}
                          style={{flex:1,fontSize:11,padding:'6px 10px'}}
                        >
                          Accetta
                        </Button>
                        <Button
                          onClick={() => updateStatus(c.id, 'rifiutata')}
                          style={{flex:1,fontSize:11,padding:'6px 10px',background:'rgba(255,90,60,0.15)',border:'1px solid rgba(255,90,60,0.2)',color:'var(--danger)'}}
                        >
                          Rifiuta
                        </Button>
                      </>
                    )}
                    {c.status !== 'inviata' && (
                      <Button style={{flex:1,fontSize:11,padding:'8px 12px'}}>
                        💬 Contatta
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
