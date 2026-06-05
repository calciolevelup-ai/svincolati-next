'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { logActivity } from '@/lib/activity'
import { sendTrialInviteNotification } from '@/lib/email'

export default function ClubTrialsPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [trials, setTrials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    player_id: '',
    trial_date: '',
    trial_time: '15:00',
    message: ''
  })

  useEffect(() => {
    loadTrials()
  }, [])

  const loadTrials = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('trials')
      .select(`
        *,
        player:player_profiles(*)
      `)
      .eq('club_id', profile?.id)
      .order('trial_date', { ascending: true })

    if (data) setTrials(data)
    setLoading(false)
  }

  const handleCreate = async () => {
    if (!formData.player_id || !formData.trial_date || !profile?.id) return

    const { data, error } = await supabase.from('trials').insert({
      club_id: profile.id,
      player_id: formData.player_id,
      trial_date: formData.trial_date,
      trial_time: formData.trial_time,
      message: formData.message,
      status: 'pending',
      sport: profile.sport
    }).select().single()

    if (!error && data) {
      // Log activity
      await logActivity(profile.id, 'trial_invite', formData.player_id, 'player', {
        trialDate: formData.trial_date,
        trialTime: formData.trial_time,
        message: formData.message
      })

      // Send email notification to player
      const { data: playerProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', formData.player_id)
        .single()

      if (playerProfile?.email) {
        await sendTrialInviteNotification(
          playerProfile.email,
          profile?.email?.split('@')[0] || 'Una società',
          formData.trial_date,
          formData.trial_time,
          formData.message
        )
      }
    }

    setFormData({player_id: '', trial_date: '', trial_time: '15:00', message: ''})
    setShowForm(false)
    loadTrials()
  }

  const statusBadge: Record<string, {bg:string,text:string,label:string}> = {
    pending: {bg:'rgba(76, 194, 255, 0.2)',text:'var(--blue)',label:'⏳ In sospeso'},
    accepted: {bg:'rgba(65, 194, 133, 0.2)',text:'var(--acid)',label:'✅ Accettata'},
    declined: {bg:'rgba(255, 90, 60, 0.15)',text:'var(--danger)',label:'❌ Rifiutata'},
    completed: {bg:'rgba(100, 150, 200, 0.2)',text:'var(--blue)',label:'🏆 Completata'}
  }

  if (profile?.role !== 'club') {
    return <DashboardLayout><div style={{textAlign:'center',color:'var(--muted)'}}>Solo le società possono inviare inviti a prova</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <h1 style={{fontSize:28,fontWeight:'bold',fontFamily:'Anton',color:'var(--text)',marginBottom:8}}>Inviti a prova</h1>
            <p style={{fontSize:13,color:'var(--muted)'}}>Gestisci gli inviti che hai inviato ai giocatori</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} style={{background:showForm?'var(--danger)':'var(--acid)',color:'#0b0d0a'}}>
            {showForm ? '✕' : '+ Nuovo invito'}
          </Button>
        </div>

        {showForm && (
          <div style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:14,padding:20,marginBottom:24}}>
            <div style={{display:'grid',gap:16}}>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Giocatore</label>
                <input type="text" placeholder="ID giocatore" value={formData.player_id} onChange={e => setFormData({...formData, player_id: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10}} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div>
                  <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Data *</label>
                  <input type="date" value={formData.trial_date} onChange={e => setFormData({...formData, trial_date: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10}} />
                </div>
                <div>
                  <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Ora</label>
                  <input type="time" value={formData.trial_time} onChange={e => setFormData({...formData, trial_time: e.target.value})} style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10}} />
                </div>
              </div>
              <div>
                <label style={{display:'block',fontFamily:'Spline Sans Mono',fontSize:11,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--muted)',marginBottom:8}}>Messaggio</label>
                <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Luogo, dettagli..." style={{width:'100%',background:'var(--bg-2)',border:'1px solid var(--line)',color:'var(--text)',padding:'12px 14px',borderRadius:10,minHeight:80,resize:'none'}} />
              </div>
              <Button onClick={handleCreate} style={{width:'100%'}}>✓ Invia invito</Button>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
        ) : trials.length === 0 ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
            <div style={{fontSize:32,marginBottom:12}}>🏆</div>
            Nessun invito inviato
          </div>
        ) : (
          <div style={{display:'grid',gap:12}}>
            {trials.map(t => {
              const badge = statusBadge[t.status]
              return (
                <div key={t.id} style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:14,padding:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'start',marginBottom:12}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:'bold',color:'var(--text)'}}>{t.player?.nome}</div>
                      <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>{t.player?.ruolo} • {t.player?.cat}</div>
                    </div>
                    <div style={{background:badge?.bg,color:badge?.text,padding:'6px 10px',borderRadius:8,fontSize:11,fontWeight:600}}>
                      {badge?.label}
                    </div>
                  </div>
                  <div style={{fontSize:12,color:'var(--muted-2)',marginBottom:8}}>
                    📅 {new Date(t.trial_date).toLocaleDateString('it-IT')}
                    {t.trial_time && ` alle ${t.trial_time}`}
                  </div>
                  {t.message && <div style={{fontSize:12,color:'var(--muted)',marginBottom:8}}>{t.message}</div>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
