'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'

export default function FavoritesPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'player' | 'club'>('all')

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    setLoading(true)
    let query = supabase
      .from('favorites')
      .select(`
        *,
        player:player_profiles(*),
        club:profiles(*)
      `)
      .eq('user_id', profile?.id)

    if (filterType !== 'all') {
      query = query.eq('target_type', filterType)
    }

    const { data } = await query.order('created_at', { ascending: false })
    setFavorites(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadFavorites()
  }, [filterType])

  const removeFavorite = async (id: string) => {
    await supabase.from('favorites').delete().eq('id', id)
    loadFavorites()
  }

  const filtered = filterType === 'all'
    ? favorites
    : favorites.filter(f => f.target_type === filterType)

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page-head mb-4">
          <h1>I miei preferiti</h1>
          <p>Giocatori, società e professionisti che hai aggiunto</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 8, marginBottom: 24 }}>
          {(['all', 'player', 'club'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`search-toggle-btn ${filterType === type ? 'active' : ''}`}
              style={{ fontSize: 12 }}
            >
              {type === 'all' ? 'Tutti' : type === 'player' ? '⚽ Giocatori' : '🏢 Società'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>⏳ Caricamento...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
            Nessun preferito ancora
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {filtered.map(fav => {
              const isPlayer = fav.target_type === 'player'
              const target = isPlayer ? fav.player : fav.club

              return (
                <div key={fav.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontFamily: 'Anton',
                        flexShrink: 0
                      }}>
                        {initials(target?.nome || target?.email || '')}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--text)' }}>
                          {target?.nome || target?.email?.split('@')[0]}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                          {isPlayer ? `${target?.ruolo} • ${target?.cat}` : '🏢 Società'}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 4 }}>
                          📍 {target?.regione} {target?.provincia && `• ${target.provincia}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      style={{
                        background: 'rgba(255, 90, 60, 0.15)',
                        border: '1px solid rgba(255, 90, 60, 0.2)',
                        color: 'var(--danger)',
                        padding: '6px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: '.16s'
                      }}
                    >
                      🗑️ Rimuovi
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 24 }}>
          {filtered.length} preferiti salvati
        </div>
      </div>
    </DashboardLayout>
  )
}
