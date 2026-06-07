'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { getPlayerCandidatures } from '@/lib/player-operations'

export default function PlayerCandidaturesPage() {
  const { profile, playerProfile } = useAuth()
  const supabase = createClient()

  const [candidatures, setCandidatures] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCandidatures()
  }, [playerProfile?.id])

  const loadCandidatures = async () => {
    if (!playerProfile?.id) return
    setLoading(true)
    const data = await getPlayerCandidatures(playerProfile.id)
    setCandidatures(data)
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inviata': return 'var(--blue)'
      case 'accettata': return 'var(--acid)'
      case 'rifiutata': return 'var(--danger)'
      default: return 'var(--muted)'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'inviata': return 'Inviata'
      case 'accettata': return 'Accettata'
      case 'rifiutata': return 'Rifiutata'
      default: return status
    }
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:'1180px',margin:'0 auto'}}>
        <div style={{marginBottom:30}}>
          <div style={{fontFamily:'Spline Sans Mono',fontSize:12,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--acid)',marginBottom:11}}>/ Domanda</div>
          <h1 style={{fontFamily:'Anton',fontWeight:400,fontSize:'clamp(30px,4.5vw,46px)',textTransform:'uppercase',lineHeight:1,letterSpacing:'-.01em',color:'var(--text)'}}>Candidature inviate</h1>
          <p style={{color:'var(--muted)',maxWidth:'52ch',fontSize:15,marginTop:10}}>Tutte le proposte che hai inviato alle società.</p>
        </div>

        {loading ? (
          <div style={{textAlign:'center',color:'var(--muted)'}}>Caricamento...</div>
        ) : candidatures.length === 0 ? (
          <div style={{textAlign:'center',color:'var(--muted-2)',fontFamily:'Spline Sans Mono',fontSize:13,padding:'48px 0',letterSpacing:'.03em',border:'1px dashed var(--line-soft)',borderRadius:'var(--radius)'}}>
            Nessuna candidatura inviata
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {candidatures.map((cand: any) => (
              <div key={cand.id} style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:'var(--radius)',padding:'18px 20px',display:'flex',alignItems:'center',gap:16}}>
                {/* Avatar */}
                <div style={{width:31,height:42,borderRadius:11,background:'var(--card-2)',border:'1px solid var(--line)',display:'grid',placeItems:'center',fontFamily:'Anton',fontSize:14,color:'var(--acid)',flexShrink:0}}>
                  {cand.club?.club_profiles?.club_name?.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:15,color:'var(--text)'}}>{cand.club?.club_profiles?.club_name}</div>
                  <div style={{fontFamily:'Spline Sans Mono',fontSize:'11.5px',color:'var(--muted)',marginTop:3}}>
                    {cand.ad?.ruolo} · {cand.ad?.cat} · {cand.ad?.regione}
                  </div>
                </div>

                {/* Status */}
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{
                    fontFamily:'Spline Sans Mono',fontSize:'10.5px',letterSpacing:'.08em',textTransform:'uppercase',
                    padding:'4px 9px',borderRadius:6,fontWeight:600,
                    background: cand.status === 'inviata' ? 'rgba(76,194,255,.12)' : cand.status === 'accettata' ? 'rgba(65,194,133,.1)' : 'rgba(255,90,60,.1)',
                    color: getStatusColor(cand.status),
                    border: cand.status === 'inviata' ? '1px solid rgba(76,194,255,.25)' : cand.status === 'accettata' ? '1px solid rgba(65,194,133,.25)' : '1px solid rgba(255,90,60,.25)'
                  }}>
                    {getStatusLabel(cand.status)}
                  </div>
                  <div style={{fontFamily:'Spline Sans Mono',fontSize:11,color:'var(--muted-2)'}}>
                    {new Date(cand.created_at).toLocaleDateString('it-IT', { day:'numeric', month:'short', year:'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
