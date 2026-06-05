import { createClient } from '@/lib/supabase/client'

export async function logActivity(
  userId: string,
  eventType: 'profile_view' | 'candidature_sent' | 'message_sent' | 'trial_invite' | 'trial_accepted' | 'trial_declined' | 'favorite_added',
  targetId: string | null,
  targetType: 'player' | 'club' | 'ad' | 'trial' | null,
  metadata?: Record<string, any>
) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from('activity_log').insert({
      user_id: userId,
      event_type: eventType,
      target_id: targetId,
      target_type: targetType,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    })

    if (error) {
      console.error('Activity log error:', error)
    }
  } catch (err) {
    console.error('Activity log failed:', err)
  }
}

export async function getActivityFeed(userId: string, limit = 50) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Activity feed error:', error)
    return []
  }

  return data || []
}
