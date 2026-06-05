'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function ActivityPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', profile?.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (data) {
      setActivities(data)
    }
    setLoading(false)
  }

  const getEventIcon = (type: string) => {
    const icons: Record<string, string> = {
      'profile_view': '👀',
      'candidature_sent': '📤',
      'message_sent': '💬',
      'trial_invite': '🏆',
      'trial_accepted': '✅',
      'trial_declined': '❌',
      'favorite_added': '⭐'
    }
    return icons[type] || '📋'
  }

  const getEventDescription = (activity: any) => {
    const descriptions: Record<string, string> = {
      'profile_view': `Hai visualizzato il profilo di ${activity.metadata?.playerName || 'un giocatore'}`,
      'candidature_sent': `Hai inviato una candidatura per ${activity.metadata?.adTitle || 'un annuncio'}`,
      'message_sent': `Hai inviato un messaggio`,
      'trial_invite': `Hai invitato a un trial il ${activity.metadata?.date || 'player'}`,
      'favorite_added': `Hai aggiunto ai preferiti`,
    }
    return descriptions[activity.event_type] || 'Evento registrato'
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:640,margin:'0 auto'}}>
        <div className="page-head mb-4">
          <h1>Attività recente</h1>
          <p>Segui tutto quello che succede nel tuo profilo</p>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
        ) : activities.length === 0 ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>
            <div style={{fontSize:32,marginBottom:12}}>🦗</div>
            Nessuna attività ancora
          </div>
        ) : (
          <div style={{display:'grid',gap:10}}>
            {activities.map((act) => (
              <div key={act.id} className="card">
                <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                  <div style={{fontSize:20}}>{getEventIcon(act.event_type)}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:'600',color:'var(--text)'}}>
                      {getEventDescription(act)}
                    </div>
                    <div style={{fontSize:11,color:'var(--muted-2)',marginTop:4}}>
                      {new Date(act.created_at).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
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
