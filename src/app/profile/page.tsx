'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { scfg, initials } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { logActivity } from '@/lib/activity'
import { useAuth } from '@/hooks/useAuth'

function PublicProfileContent() {
  const searchParams = useSearchParams()
  const playerId = searchParams.get('p')
  const supabase = createClient()
  const { profile } = useAuth()

  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!playerId) {
      setError('Profilo non trovato')
      setLoading(false)
      return
    }

    const loadProfile = async () => {
      try {
        const { data } = await supabase
          .from('player_profiles')
          .select('*, career_history(*)')
          .eq('id', playerId)
          .single()

        if (data) {
          setPlayer(data)

          // Log view if user is logged in
          if (profile?.id) {
            await logActivity(profile.id, 'profile_view', playerId, 'player', {
              playerName: data.nome,
              playerRole: data.ruolo
            })
          }
        } else {
          setError('Giocatore non trovato')
        }
      } catch (err) {
        console.error(err)
        setError('Errore nel caricamento del profilo')
      }
      setLoading(false)
    }

    loadProfile()
  }, [playerId, profile?.id])

  if (loading) {
    return (
      <div style={{minHeight:'100vh',background:'var(--bg)',display:'grid',placeItems:'center',color:'var(--text)'}}>
        ⏳ Caricamento...
      </div>
    )
  }

  if (error || !player) {
    return (
      <div style={{minHeight:'100vh',background:'var(--bg)',display:'grid',placeItems:'center',color:'var(--danger)'}}>
        {error}
      </div>
    )
  }

  const cfg = scfg(player.sport)

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',padding:'40px 20px'}}>
      <div style={{maxWidth:640,margin:'0 auto'}}>
        {/* Hero */}
        <div className="card" style={{display:'flex',gap:16,marginBottom:20,alignItems:'flex-start'}}>
          <div style={{width:80,height:80,borderRadius:10,background:'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontFamily:'Anton',flexShrink:0}}>
            {initials(player.nome)}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:20,fontWeight:'bold',color:'var(--text)'}}>{player.nome}</div>
            <div style={{fontSize:14,color:'var(--muted)',marginTop:4}}>
              {player.ruolo} • {cfg.icon} {cfg.nome}
            </div>
            <div style={{fontSize:13,color:'var(--muted-2)',marginTop:8}}>
              {player.eta && `${player.eta} anni`} {player.altezza && `• ${player.altezza}cm`}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="grid-2" style={{marginBottom:20,gap:10}}>
          <div className="card">
            <div style={{fontSize:11,color:'var(--muted)'}}>CATEGORIA</div>
            <div style={{fontSize:14,fontWeight:'bold',color:'var(--text)',marginTop:6}}>{player.cat}</div>
          </div>
          <div className="card">
            <div style={{fontSize:11,color:'var(--muted)'}}>REGIONE</div>
            <div style={{fontSize:14,fontWeight:'bold',color:'var(--text)',marginTop:6}}>{player.regione}</div>
          </div>
          {player.squadra && (
            <div className="card">
              <div style={{fontSize:11,color:'var(--muted)'}}>ULTIMA SQUADRA</div>
              <div style={{fontSize:14,fontWeight:'bold',color:'var(--text)',marginTop:6}}>{player.squadra}</div>
            </div>
          )}
          {cfg.foot && player.piede && (
            <div className="card">
              <div style={{fontSize:11,color:'var(--muted)'}}>PIEDE</div>
              <div style={{fontSize:14,fontWeight:'bold',color:'var(--text)',marginTop:6}}>{player.piede}</div>
            </div>
          )}
        </div>

        {/* Bio */}
        {player.bio && (
          <div className="panel" style={{marginBottom:20}}>
            <div style={{fontSize:13,lineHeight:1.6,color:'var(--text)'}}>{player.bio}</div>
          </div>
        )}

        {/* Career */}
        {player.career_history && player.career_history.length > 0 && (
          <div className="panel" style={{marginBottom:20}}>
            <h2 style={{fontSize:14,fontWeight:'bold',color:'var(--text)',marginBottom:12}}>Storico carriera</h2>
            {player.career_history.map((c: any) => (
              <div key={c.id} style={{fontSize:12,borderBottom:'1px solid var(--line-soft)',paddingBottom:8,marginBottom:8,color:'var(--text)'}}>
                <div style={{fontWeight:'bold'}}>{c.stagione} • {c.squadra}</div>
                <div style={{color:'var(--muted)',fontSize:11,marginTop:2}}>{c.categoria} {c.presenze && `• ${c.presenze} presenze`} {c.reti && `• ${c.reti} reti`}</div>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        <div style={{display:'flex',gap:10,justifyContent:'center'}}>
          <Button>💬 Contatta</Button>
          <Button onClick={() => window.location.href = `https://wa.me/${player.contatto}`} style={{background:'rgba(76,194,255,0.15)',border:'1px solid rgba(76,194,255,0.2)',color:'var(--blue)'}}>
            📱 WhatsApp
          </Button>
        </div>

        <div style={{textAlign:'center',fontSize:11,color:'var(--muted-2)',marginTop:20}}>
          Profilo pubblico • Condividi il link per farti scoprire
        </div>
      </div>
    </div>
  )
}

export default function PublicProfilePage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',background:'var(--bg)',display:'grid',placeItems:'center',color:'var(--text)'}}>
        ⏳ Caricamento...
      </div>
    }>
      <PublicProfileContent />
    </Suspense>
  )
}
