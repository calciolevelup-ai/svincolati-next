'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { logActivity } from '@/lib/activity'

export default function PlayerTrialsPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [trials, setTrials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrials()
  }, [])

  const loadTrials = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('trials')
      .select(`
        *,
        club:profiles(*)
      `)
      .eq('player_id', profile?.id)
      .order('trial_date', { ascending: true })

    if (data) setTrials(data)
    setLoading(false)
  }

  const acceptTrial = async (id: string) => {
    const { error } = await supabase.from('trials').update({ status: 'accepted' }).eq('id', id)

    if (!error && profile?.id) {
      const trial = trials.find(t => t.id === id)
      await logActivity(profile.id, 'trial_accepted', id, null, {
        clubId: trial?.club_id,
        trialDate: trial?.trial_date
      })
    }
    loadTrials()
  }

  const declineTrial = async (id: string) => {
    const { error } = await supabase.from('trials').update({ status: 'declined' }).eq('id', id)

    if (!error && profile?.id) {
      const trial = trials.find(t => t.id === id)
      await logActivity(profile.id, 'trial_declined', id, null, {
        clubId: trial?.club_id,
        trialDate: trial?.trial_date
      })
    }
    loadTrials()
  }

  const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: 'rgba(76, 194, 255, 0.2)', text: 'var(--blue)', label: '⏳ In sospeso' },
    accepted: { bg: 'rgba(65, 194, 133, 0.2)', text: 'var(--acid)', label: '✅ Accettata' },
    declined: { bg: 'rgba(255, 90, 60, 0.15)', text: 'var(--danger)', label: '❌ Rifiutata' },
    completed: { bg: 'rgba(100, 150, 200, 0.2)', text: 'var(--blue)', label: '🏆 Completata' }
  }

  if (!profile || profile.role !== 'player') {
    return (
      <DashboardLayout>
        <div style={{textAlign:'center',color:'var(--muted)'}}>Solo i giocatori possono visualizzare gli inviti a prova</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div className="page-head mb-4">
          <h1>Inviti a prova</h1>
          <p>Gestisci gli inviti a prova ricevuti dalle società</p>
        </div>

        {/* Pending vs History */}
        {loading ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
        ) : (
          <>
            {/* Pending Trials */}
            {trials.filter(t => t.status === 'pending').length > 0 && (
              <>
                <h2 style={{fontSize:14,fontWeight:'bold',marginBottom:12,color:'var(--text)',marginTop:24}}>⏳ In sospeso</h2>
                <div className="grid" style={{gap:12,marginBottom:24}}>
                  {trials.filter(t => t.status === 'pending').map(t => (
                    <div key={t.id} className="panel">
                      <div className="flex-between" style={{marginBottom:16}}>
                        <div>
                          <div style={{fontSize:15,fontWeight:'bold',color:'var(--text)'}}>
                            {t.club?.email?.split('@')[0] || 'Società'}
                          </div>
                          <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>
                            📅 {new Date(t.trial_date).toLocaleDateString('it-IT')}
                            {t.trial_time && ` alle ${t.trial_time}`}
                          </div>
                        </div>
                        <div style={{
                          background: statusBadge.pending.bg,
                          color: statusBadge.pending.text,
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {statusBadge.pending.label}
                        </div>
                      </div>

                      {t.message && (
                        <div style={{fontSize:12,color:'var(--muted)',lineHeight:1.5,marginBottom:16,paddingBottom:16,borderBottom:'1px solid var(--line-soft)'}}>
                          💬 {t.message}
                        </div>
                      )}

                      <div style={{display:'flex',gap:8}}>
                        <Button onClick={() => acceptTrial(t.id)} style={{flex:1}}>✅ Accetta</Button>
                        <Button onClick={() => declineTrial(t.id)} style={{flex:1,background:'rgba(255,90,60,0.15)',border:'1px solid rgba(255,90,60,0.2)',color:'var(--danger)'}}>❌ Rifiuta</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Past Trials */}
            {trials.filter(t => t.status !== 'pending').length > 0 && (
              <>
                <h2 style={{fontSize:14,fontWeight:'bold',marginBottom:12,color:'var(--text)',marginTop:24}}>📋 Storico</h2>
                <div className="grid" style={{gap:12}}>
                  {trials.filter(t => t.status !== 'pending').map(t => {
                    const badge = statusBadge[t.status]
                    return (
                      <div key={t.id} className="card">
                        <div className="flex-between" style={{marginBottom:8}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:'bold',color:'var(--text)'}}>
                              {t.club?.email?.split('@')[0] || 'Società'}
                            </div>
                            <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>
                              📅 {new Date(t.trial_date).toLocaleDateString('it-IT')}
                            </div>
                          </div>
                          <div style={{
                            background: badge?.bg,
                            color: badge?.text,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {badge?.label}
                          </div>
                        </div>
                        {t.message && (
                          <div style={{fontSize:11,color:'var(--muted-2)',marginTop:6}}>
                            {t.message}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {trials.length === 0 && (
              <div style={{textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
                <div style={{fontSize:32,marginBottom:12}}>🏆</div>
                Nessun invito a prova ricevuto
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
