import { createClient } from '@/lib/supabase/client'

export async function getUnreadCount(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('threads')
    .select('id')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .eq('unread', true)

  if (error) {
    console.error('Failed to get unread count:', error)
    return 0
  }

  return data?.length || 0
}

export async function markThreadAsRead(threadId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('threads')
    .update({ unread: false })
    .eq('id', threadId)

  if (error) {
    console.error('Failed to mark thread as read:', error)
  }
}

export async function markThreadAsUnread(threadId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('threads')
    .update({ unread: true })
    .eq('id', threadId)

  if (error) {
    console.error('Failed to mark thread as unread:', error)
  }
}
