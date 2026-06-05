import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  let playerProfile = null
  if (profile?.role === 'player') {
    const { data: pp } = await supabase.from('player_profiles').select('*').eq('user_id', user.id).single()
    playerProfile = pp
  }

  let clubProfile = null
  if (profile?.role === 'club') {
    const { data: cp } = await supabase.from('club_profiles').select('*').eq('user_id', user.id).single()
    clubProfile = cp
  }

  return NextResponse.json({ user, profile, playerProfile, clubProfile })
}
