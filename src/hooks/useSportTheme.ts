import { useEffect } from 'react'
import { useAuth } from './useAuth'

export function useSportTheme() {
  const { profile } = useAuth()

  useEffect(() => {
    if (profile?.sport) {
      document.documentElement.setAttribute('data-sport', profile.sport)
    }
  }, [profile?.sport])
}
