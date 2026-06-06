'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { scfg, initials } from '@/lib/utils'
import { getVideoEmbedUrl } from '@/lib/video'
import { getReferenzeForPlayer } from '@/lib/referenze'
import Button from '@/components/ui/Button'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { logActivity } from '@/lib/activity'
import { useAuth } from '@/hooks/useAuth'

function PublicProfileContent() {
  const searchParams = useSearchParams()
  const playerId = searchParams.get('p')
  const supabase = createClient()
  const { profile } = useAuth()

  const [player, setPlayer] = useState<any>(null)
  const [referenze, setReferenze] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [referenzaModalOpen, setReferenzaModalOpen] = useState(false)
  const [referenzaText, setReferenzaText] = useState('')
  const [submittingReferenza, setSubmittingReferenza] = useState(false)

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

          // Load referenze
          try {
            const ref = await getReferenzeForPlayer(playerId)
            setReferenze(ref)
          } catch (err) {
            console.error('Errore nel caricamento referenze:', err)
          }

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

  const submitReferenza = async () => {
    if (!referenzaText.trim() || !profile?.id) return

    setSubmittingReferenza(true)
    try {
      const { addReferenza } = await import('@/lib/referenze')
      await addReferenza(playerId || '', profile.id, referenzaText.trim(), profile.email?.split('@')[0] || '')

      // Reload referenze
      const { getReferenzeForPlayer } = await import('@/lib/referenze')
      const ref = await getReferenzeForPlayer(playerId || '')
      setReferenze(ref)

      setReferenzaText('')
      setReferenzaModalOpen(false)
    } catch (err) {
      console.error(err)
      alert('Errore nel salvataggio della referenza')
    } finally {
      setSubmittingReferenza(false)
    }
  }

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
          <div style={{width:80,height:80,borderRadius:10,background:player.photo ? undefined : 'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32,fontFamily:'Anton',flexShrink:0,overflow:'hidden',backgroundImage:player.photo ? `url(${player.photo})` : undefined,backgroundSize:'cover',backgroundPosition:'center'}}>
            {!player.photo && initials(player.nome)}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:20,fontWeight:'bold',color:'var(--text)',display:'flex',alignItems:'center',gap:8}}>
              {player.nome}
              <VerifiedBadge verified={player.verified} tessera={player.tessera} />
            </div>
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

        {/* Video */}
        {player.video && getVideoEmbedUrl(player.video) && (
          <div className="panel" style={{marginBottom:20}}>
            <h2 style={{fontSize:14,fontWeight:'bold',color:'var(--text)',marginBottom:12}}>Video</h2>
            <div style={{position:'relative',paddingBottom:'56.25%',height:0,overflow:'hidden',borderRadius:10}}>
              <iframe
                src={getVideoEmbedUrl(player.video) || ''}
                style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none',borderRadius:10}}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
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

        {/* Referenze */}
        {referenze.length > 0 && (
          <div className="panel" style={{marginBottom:20}}>
            <h2 style={{fontSize:14,fontWeight:'bold',color:'var(--text)',marginBottom:12}}>Referenze ({referenze.length})</h2>
            {referenze.map((ref: any) => (
              <div key={ref.id} style={{borderBottom:'1px solid var(--line-soft)',paddingBottom:12,marginBottom:12}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <div style={{fontSize:12,fontWeight:'bold',color:'var(--text)',display:'flex',alignItems:'center',gap:4}}>
                    {ref.club?.nome || ref.club_name}
                    <VerifiedBadge verified={ref.club?.verified} tessera={ref.club?.tessera} />
                  </div>
                  <div style={{fontSize:10,color:'var(--muted-2)'}}>
                    {new Date(ref.created_at).toLocaleDateString('it-IT', {day:'2-digit',month:'short',year:'numeric'})}
                  </div>
                </div>
                <div style={{fontSize:13,color:'var(--text)',lineHeight:1.5}}>{ref.text}</div>
              </div>
            ))}
          </div>
        )}

        {/* Contact */}
        <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
          <Button>💬 Contatta</Button>
          {player.contatto && (
            <Button onClick={() => window.location.href = `https://wa.me/${player.contatto}`} style={{background:'rgba(76,194,255,0.15)',border:'1px solid rgba(76,194,255,0.2)',color:'var(--blue)'}}>
              📱 WhatsApp
            </Button>
          )}
          {profile?.role === 'club' && (
            <Button onClick={() => setReferenzaModalOpen(true)} style={{background:'rgba(65,194,133,0.15)',border:'1px solid rgba(65,194,133,0.2)',color:'var(--acid)'}}>
              ⭐ Lascia referenza
            </Button>
          )}
        </div>

        <div style={{textAlign:'center',fontSize:11,color:'var(--muted-2)',marginTop:20}}>
          Profilo pubblico • Condividi il link per farti scoprire
        </div>

        {/* Referenza Modal */}
        {referenzaModalOpen && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
            <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:18,padding:30,maxWidth:450,width:'90%',maxHeight:'90vh',overflow:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
              <h2 style={{fontFamily:'Anton',fontSize:22,textTransform:'uppercase',color:'var(--text)',marginBottom:16}}>Lascia una referenza</h2>
              <textarea
                value={referenzaText}
                onChange={e => setReferenzaText(e.target.value)}
                placeholder="Scrivi una referenza per questo giocatore..."
                style={{width:'100%',padding:12,background:'var(--bg-2)',border:'1px solid var(--line)',borderRadius:10,color:'var(--text)',fontFamily:'Archivo',fontSize:14,minHeight:120,resize:'none',marginBottom:16}}
              />
              <div style={{display:'flex',gap:10}}>
                <Button onClick={submitReferenza} disabled={submittingReferenza || !referenzaText.trim()} style={{flex:1}}>
                  {submittingReferenza ? '⏳ Salvataggio...' : '✓ Salva'}
                </Button>
                <Button onClick={() => setReferenzaModalOpen(false)} style={{flex:1,background:'rgba(76,194,255,0.15)',border:'1px solid rgba(76,194,255,0.2)',color:'var(--blue)'}}>
                  ✕ Annulla
                </Button>
              </div>
            </div>
          </div>
        )}
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
