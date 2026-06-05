'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile, PlayerProfile, ClubProfile } from '@/lib/types'

export function useAuth() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null)
  const [clubProfile, setClubProfile] = useState<ClubProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(prof)

        if (prof?.role === 'player') {
          const { data: pp } = await supabase.from('player_profiles').select('*').eq('user_id', user.id).single()
          setPlayerProfile(pp)
        } else if (prof?.role === 'club') {
          const { data: cp } = await supabase.from('club_profiles').select('*').eq('user_id', user.id).single()
          setClubProfile(cp)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      loadProfile()
    })

    return () => authListener?.subscription.unsubscribe()
  }, [supabase])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return { profile, playerProfile, clubProfile, loading, error, logout }
}
