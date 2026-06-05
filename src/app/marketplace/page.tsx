'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

const SPORTS = [
  { id: 'calcio', nome: '⚽ Calcio', icon: '⚽' },
  { id: 'calcio5', nome: '⚽ Calcio 5', icon: '⚽' },
  { id: 'pallavolo', nome: '🏐 Pallavolo', icon: '🏐' },
  { id: 'rugby', nome: '🏈 Rugby', icon: '🏈' },
  { id: 'basket', nome: '🏀 Basketball', icon: '🏀' }
]

export default function MarketplacePage() {
  const supabase = createClient()
  const [selectedSport, setSelectedSport] = useState('calcio')
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAds()
  }, [selectedSport])

  const loadAds = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('ads')
      .select('*')
      .eq('sport', selectedSport)
      .order('created_at', { ascending: false })
      .limit(50)

    setAds(data || [])
    setLoading(false)
  }

  const sport = SPORTS.find(s => s.id === selectedSport)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      paddingTop: 44
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--card)',
        borderBottom: '1px solid var(--line)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontFamily: 'Anton',
          fontSize: 48,
          textTransform: 'uppercase',
          color: 'var(--text)',
          marginBottom: 8,
          letterSpacing: '-.01em'
        }}>
          Marketplace
        </h1>
        <p style={{
          fontSize: 15,
          color: 'var(--muted)',
          maxWidth: 500,
          margin: '0 auto'
        }}>
          Scopri gli annunci di ricerca dai club e candidati per il tuo prossimo team
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        {/* Sport Selector */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 40
        }}>
          {SPORTS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSport(s.id)}
              style={{
                background: selectedSport === s.id ? 'var(--acid)' : 'var(--card)',
                border: `1px solid ${selectedSport === s.id ? 'var(--acid)' : 'var(--line)'}`,
                color: selectedSport === s.id ? '#0b0d0a' : 'var(--text)',
                padding: '16px',
                borderRadius: 11,
                fontFamily: 'Archivo',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: '.18s'
              }}
            >
              {s.icon} {s.nome.split(' ')[1]}
            </button>
          ))}
        </div>

        {/* Ads List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>⏳ Caricamento...</div>
        ) : ads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
            Nessun annuncio al momento
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gap: 18 }}>
              {ads.map(ad => (
                <div key={ad.id} style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 14,
                  padding: 24,
                  transition: '.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: 'var(--text)' }}>
                        {ad.ruolo}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                        Categoria {ad.cat} • {ad.regione} {ad.provincia && `• ${ad.provincia}`}
                      </div>
                    </div>
                    <Link href={`/auth/login?redirect=dashboard`}>
                      <Button style={{ fontSize: 12, padding: '8px 16px' }}>
                        🔐 Accedi per candidarsi
                      </Button>
                    </Link>
                  </div>

                  {ad.descr && (
                    <p style={{
                      fontSize: 13,
                      color: 'var(--muted-2)',
                      lineHeight: 1.5,
                      marginBottom: 12,
                      paddingBottom: 12,
                      borderBottom: '1px solid var(--line-soft)'
                    }}>
                      {ad.descr}
                    </p>
                  )}

                  <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>
                    📅 Pubblicato {new Date(ad.created_at).toLocaleDateString('it-IT')}
                    {ad.expires_at && ` • Scade tra ${Math.ceil((new Date(ad.expires_at).getTime() - Date.now()) / (24 * 3600 * 1000))} giorni`}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 32, padding: 20, fontSize: 12, color: 'var(--muted)' }}>
              {ads.length} annuncio{ads.length !== 1 ? 'i' : ''} trovato{ads.length !== 1 ? 'i' : ''}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
