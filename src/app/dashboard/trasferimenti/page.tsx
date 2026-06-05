'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function TransfersPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [transfers, setTransfers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterTipo, setFilterTipo] = useState<'all' | 'Confermato' | 'Trattativa' | 'Svincolato'>('all')

  useEffect(() => {
    loadTransfers()
  }, [])

  const loadTransfers = async () => {
    setLoading(true)
    const query = supabase
      .from('transfers')
      .select('*')
      .eq('sport', profile?.sport)
      .order('created_at', { ascending: false })
      .limit(100)

    const { data } = await query
    setTransfers(data || [])
    setLoading(false)
  }

  const filtered = filterTipo === 'all'
    ? transfers
    : transfers.filter(t => t.tipo === filterTipo)

  const typoBadge: Record<string, { bg: string; text: string }> = {
    'Confermato': { bg: 'rgba(65, 194, 133, 0.2)', text: 'var(--acid)' },
    'Trattativa': { bg: 'rgba(76, 194, 255, 0.2)', text: 'var(--blue)' },
    'Svincolato': { bg: 'rgba(255, 180, 0, 0.2)', text: '#ffd700' }
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page-head mb-4">
          <h1>Trasferimenti</h1>
          <p>Segui i movimenti del mercato</p>
        </div>

        {/* Filter */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginBottom: 24 }}>
          {(['all', 'Confermato', 'Trattativa', 'Svincolato'] as const).map(tipo => (
            <button
              key={tipo}
              onClick={() => setFilterTipo(tipo)}
              className={`search-toggle-btn ${filterTipo === tipo ? 'active' : ''}`}
              style={{ fontSize: 12 }}
            >
              {tipo === 'all' ? 'Tutti' : tipo}
            </button>
          ))}
        </div>

        {/* Transfers List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>⏳ Caricamento...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
            Nessun trasferimento trovato
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {filtered.map(t => {
              const badge = typoBadge[t.tipo]
              return (
                <div key={t.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 'bold', color: 'var(--text)' }}>{t.nome}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                        {t.ruolo} • {t.cat}
                      </div>
                    </div>
                    <div style={{ background: badge?.bg, color: badge?.text, padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>
                      {t.tipo}
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 12, marginBottom: 10, borderBottom: '1px solid var(--line-soft)', paddingBottom: 10 }}>
                    <div>
                      <span style={{ color: 'var(--muted-2)' }}>DA:</span> {t.da || 'N/A'}
                    </div>
                    <div>
                      <span style={{ color: 'var(--muted-2)' }}>A:</span> {t.a || 'N/A'}
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--muted-2)' }}>
                    📍 {t.regione} {t.provincia && `• ${t.provincia}`}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 24 }}>
          {filtered.length} trasferimenti trovati
        </div>
      </div>
    </DashboardLayout>
  )
}
