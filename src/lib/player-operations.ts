import { createClient } from '@/lib/supabase/client'
import type { PlayerProfile } from '@/lib/types'

const supabase = createClient()

// Get player view log (who viewed this player's profile)
export async function getPlayerViewLog(playerId: string, limit = 5) {
  try {
    const { data, error } = await supabase
      .from('player_views')
      .select(`
        id, created_at,
        club_id,
        profiles:club_id(id, email),
        club_profiles:club_id(club_name, crest)
      `)
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching view log:', err)
    return []
  }
}

// Get total view count for player
export async function getTotalViewCount(playerId: string) {
  try {
    const { count, error } = await supabase
      .from('player_views')
      .select('*', { count: 'exact', head: true })
      .eq('player_id', playerId)

    if (error) throw error
    return count || 0
  } catch (err) {
    console.error('Error fetching view count:', err)
    return 0
  }
}

// Log a player view
export async function logPlayerView(playerId: string, clubId: string) {
  try {
    const { error } = await supabase
      .from('player_views')
      .insert({
        player_id: playerId,
        club_id: clubId
      })

    if (error) throw error
  } catch (err) {
    console.error('Error logging player view:', err)
  }
}

// Get search preferences for player
export async function getSearchPreferences(playerId: string) {
  try {
    const { data, error } = await supabase
      .from('search_preferences')
      .select('*')
      .eq('player_id', playerId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || { player_id: playerId, cat_min: '', regione_pref: '', note: '' }
  } catch (err) {
    console.error('Error fetching search preferences:', err)
    return null
  }
}

// Save search preferences
export async function saveSearchPreferences(playerId: string, prefs: any) {
  try {
    const { data, error } = await supabase
      .from('search_preferences')
      .upsert({
        player_id: playerId,
        cat_min: prefs.cat_min || '',
        regione_pref: prefs.regione_pref || '',
        note: prefs.note || ''
      })
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error saving search preferences:', err)
    return null
  }
}

// Find matching ads for a player
export async function getMatchingAds(player: PlayerProfile) {
  try {
    // Score ads based on player profile
    const { data: ads, error } = await supabase
      .from('ads')
      .select(`*, club_profiles:club_id(club_name)`)
      .eq('sport', player.sport)
      .gte('expires_at', new Date().toISOString())
      .limit(6)

    if (error) throw error

    // Simple matching: same sport + relevant role/category
    return ads?.filter(ad => {
      const roleMatch = !ad.ruolo || ad.ruolo === player.ruolo
      const catMatch = !ad.cat || ad.cat === player.cat
      return roleMatch || catMatch
    }) || []
  } catch (err) {
    console.error('Error getting matching ads:', err)
    return []
  }
}

// Delete player account
export async function deletePlayerAccount(userId: string) {
  try {
    // Delete player profile (cascade will handle career history)
    const { error: playerError } = await supabase
      .from('player_profiles')
      .delete()
      .eq('user_id', userId)

    if (playerError) throw playerError

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) throw authError

    return true
  } catch (err) {
    console.error('Error deleting account:', err)
    return false
  }
}

// Get candidatures for player (sent by player)
export async function getPlayerCandidatures(playerId: string) {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .select(`
        *,
        ad:ad_id(*),
        club:club_id(id, email, club_profiles(club_name))
      `)
      .eq('player_id', playerId)
      .eq('tipo', 'outbound')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching candidatures:', err)
    return []
  }
}

// Send candidature
export async function sendCandidature(playerId: string, adId: string) {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .insert({
        player_id: playerId,
        ad_id: adId,
        club_id: (await supabase.from('ads').select('club_id').eq('id', adId).single()).data?.club_id,
        tipo: 'outbound',
        status: 'inviata'
      })
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error sending candidature:', err)
    return null
  }
}

// Toggle player availability
export async function togglePlayerAvailability(playerId: string, disponibile: boolean) {
  try {
    const { data, error } = await supabase
      .from('player_profiles')
      .update({ disponibile })
      .eq('id', playerId)
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error toggling availability:', err)
    return null
  }
}
