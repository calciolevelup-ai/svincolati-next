'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

type StatusFilter = 'all' | 'inviata' | 'vista' | 'accettata' | 'rifiutata'

export default function PlayerApplicationsPage() {
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
        ad:ads(*)
      `)
      .eq('player_id', profile?.id)
      .order('created_at', { ascending: false })

    if (data) setCandidatures(data)
    setLoading(false)
  }

  const filteredCandidatures = statusFilter === 'all'
    ? candidatures
    : candidatures.filter(c => c.status === statusFilter)

  const statusBadges: Record<string, { color: string; label: string; icon: string }> = {
    inviata: { color: 'rgba(76, 194, 255, 0.2)', label: '📤 Inviata', icon: '📤' },
    vista: { color: 'rgba(255, 180, 0, 0.2)', label: '👀 Vista', icon: '👀' },
    accettata: { color: 'rgba(65, 194, 133, 0.2)', label: '✅ Accettata', icon: '✅' },
    rifiutata: { color: 'rgba(255, 90, 60, 0.2)', label: '❌ Rifiutata', icon: '❌' }
  }

  const counts = {
    all: candidatures.length,
    inviata: candidatures.filter(c => c.status === 'inviata').length,
    vista: candidatures.filter(c => c.status === 'vista').length,
    accettata: candidatures.filter(c => c.status === 'accettata').length,
    rifiutata: candidatures.filter(c => c.status === 'rifiutata').length
  }

  if (!profile || profile.role !== 'player') {
    return (
      <DashboardLayout>
        <div style={{textAlign:'center',color:'var(--muted)'}}>Solo i giocatori possono visualizzare le candidature</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div className="page-head mb-4">
          <h1>Le mie candidature</h1>
          <p>Segui lo stato delle tue candidature</p>
        </div>

        {/* Status Filter Buttons */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))',gap:8,marginBottom:20}}>
          <button
            onClick={() => setStatusFilter('all')}
            className={`search-toggle-btn ${statusFilter === 'all' ? 'active' : ''}`}
            style={{fontSize:12}}
          >
            Tutte ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('inviata')}
            className={`search-toggle-btn ${statusFilter === 'inviata' ? 'active' : ''}`}
            style={{fontSize:12}}
          >
            📤 Inviate ({counts.inviata})
          </button>
          <button
            onClick={() => setStatusFilter('vista')}
            className={`search-toggle-btn ${statusFilter === 'vista' ? 'active' : ''}`}
            style={{fontSize:12}}
          >
            👀 Viste ({counts.vista})
          </button>
          <button
            onClick={() => setStatusFilter('accettata')}
            className={`search-toggle-btn ${statusFilter === 'accettata' ? 'active' : ''}`}
            style={{fontSize:12}}
          >
            ✅ Accettate ({counts.accettata})
          </button>
          <button
            onClick={() => setStatusFilter('rifiutata')}
            className={`search-toggle-btn ${statusFilter === 'rifiutata' ? 'active' : ''}`}
            style={{fontSize:12}}
          >
            ❌ Rifiutate ({counts.rifiutata})
          </button>
        </div>

        {/* Candidatures List */}
        {loading ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
        ) : filteredCandidatures.length === 0 ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
            <div style={{fontSize:32,marginBottom:12}}>📋</div>
            {statusFilter === 'all'
              ? 'Ancora nessuna candidatura. Vai alla ricerca per candidarti!'
              : `Nessuna candidatura con stato "${statusBadges[statusFilter]?.label}"`}
          </div>
        ) : (
          <div className="grid" style={{gap:12}}>
            {filteredCandidatures.map(c => {
              const badge = statusBadges[c.status]
              const daysAgo = Math.ceil((Date.now() - new Date(c.created_at).getTime()) / (24 * 3600 * 1000))

              return (
                <div key={c.id} className="card">
                  <div className="flex-between" style={{marginBottom:10}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:'bold',color:'var(--text)'}}>
                        {c.ad?.ruolo || 'Annuncio'}
                      </div>
                      <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>
                        Categoria: {c.ad?.cat} • Regione: {c.ad?.regione}
                      </div>
                    </div>
                    <div style={{
                      background: badge?.color,
                      color: badge?.label.split(' ')[0] === '📤' ? 'var(--blue)' : badge?.label.split(' ')[0] === '👀' ? '#ffd700' : badge?.label.split(' ')[0] === '✅' ? 'var(--acid)' : 'var(--danger)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {badge?.label}
                    </div>
                  </div>

                  {c.ad?.descr && (
                    <div style={{fontSize:12,color:'var(--muted-2)',lineHeight:1.4,marginBottom:10}}>
                      {c.ad.descr}
                    </div>
                  )}

                  <div style={{fontSize:11,color:'var(--muted-2)',marginBottom:10}}>
                    Candidatura inviata {daysAgo === 0 ? 'oggi' : `${daysAgo}d fa`}
                  </div>

                  <Button style={{width:'100%',fontSize:12,padding:'8px 12px'}}>
                    💬 Contatta società
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
