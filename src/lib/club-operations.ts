import { createClient } from '@/lib/supabase/client'
import type { Ad } from '@/lib/types'

const supabase = createClient()

// Get all ads for a club
export async function getClubAds(clubId: string) {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching club ads:', err)
    return []
  }
}

// Get days left for ad
export function adDaysLeft(expiresAt: string) {
  const now = new Date().getTime()
  const expires = new Date(expiresAt).getTime()
  const daysLeft = Math.max(0, Math.ceil((expires - now) / (86400 * 1000)))
  return daysLeft
}

// Renew ad (extend by 30 days if < 7 days left)
export async function renewAd(adId: string) {
  try {
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
    const { data, error } = await supabase
      .from('ads')
      .update({ expires_at: newExpiresAt })
      .eq('id', adId)
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error renewing ad:', err)
    return null
  }
}

// Create new ad
export async function createAd(clubId: string, adData: any) {
  try {
    const { data, error } = await supabase
      .from('ads')
      .insert({
        club_id: clubId,
        ...adData,
        expires_at: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
      })
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error creating ad:', err)
    return null
  }
}

// Update ad
export async function updateAd(adId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('ads')
      .update(updates)
      .eq('id', adId)
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error updating ad:', err)
    return null
  }
}

// Delete ad
export async function deleteAd(adId: string) {
  try {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', adId)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting ad:', err)
    return false
  }
}

// Get candidatures for ad
export async function getAdCandidatures(adId: string) {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .select(`
        *,
        player:player_id(
          id, nome, ruolo, cat, regione,
          player_profiles(photo, bio, altezza)
        )
      `)
      .eq('ad_id', adId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching ad candidatures:', err)
    return []
  }
}

// Accept candidature
export async function acceptCandidature(candidatureId: string) {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .update({ status: 'accettata' })
      .eq('id', candidatureId)
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error accepting candidature:', err)
    return null
  }
}

// Reject candidature
export async function rejectCandidature(candidatureId: string) {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .update({ status: 'rifiutata' })
      .eq('id', candidatureId)
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error rejecting candidature:', err)
    return null
  }
}

// Get all active ads (not expired) for a sport
export async function getActiveAdsBySport(sport: string) {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        club_profiles:club_id(club_name, crest)
      `)
      .eq('sport', sport)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching active ads:', err)
    return []
  }
}

// Get candidatures for club
export async function getClubCandidatures(clubId: string) {
  try {
    const { data, error } = await supabase
      .from('candidatures')
      .select(`
        *,
        player:player_id(
          id, nome, ruolo, cat, regione,
          player_profiles(photo, bio)
        ),
        ad:ad_id(ruolo, cat, regione)
      `)
      .eq('club_id', clubId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching club candidatures:', err)
    return []
  }
}

// Invite trial
export async function inviteTrial(clubId: string, playerId: string, trialData: any) {
  try {
    const { data, error } = await supabase
      .from('trials')
      .insert({
        club_id: clubId,
        player_id: playerId,
        ...trialData
      })
      .select()

    if (error) throw error
    return data?.[0]
  } catch (err) {
    console.error('Error inviting trial:', err)
    return null
  }
}

// Get trials for club
export async function getClubTrials(clubId: string) {
  try {
    const { data, error } = await supabase
      .from('trials')
      .select(`
        *,
        player:player_id(
          id, nome, ruolo, regione,
          player_profiles(photo, bio)
        )
      `)
      .eq('club_id', clubId)
      .order('trial_date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error fetching club trials:', err)
    return []
  }
}
