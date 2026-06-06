import { createClient } from './supabase/client'

export async function addReferenza(playerId: string, clubId: string, text: string, clubName?: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('referenze')
    .upsert({
      player_id: playerId,
      club_id: clubId,
      club_name: clubName || '',
      text: text,
    })
    .select()

  if (error) throw error
  return data?.[0]
}

export async function getReferenzeForPlayer(playerId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('referenze')
    .select('*, club:profiles(nome,verified,tessera)')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function deleteReferenza(id: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('referenze')
    .delete()
    .eq('id', id)

  if (error) throw error
}
