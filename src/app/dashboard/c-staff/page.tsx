'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'

export default function ClubStaffPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [staffType, setStaffType] = useState<'all' | 'allenatore' | 'preparatore' | 'medico' | 'massoterapista'>('all')

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = async () => {
    setLoading(true)
    let query = supabase
      .from('player_profiles')
      .select('*')
      .eq('sport', profile?.sport)
      .in('staff_type', ['allenatore', 'preparatore', 'medico', 'massoterapista'])

    if (staffType !== 'all') {
      query = query.eq('staff_type', staffType)
    }

    const { data } = await query.order('nome').limit(100)
    setStaff(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadStaff()
  }, [staffType])

  const staffTypeLabels: Record<string, string> = {
    all: 'Tutti',
    allenatore: '⚽ Allenatori',
    preparatore: '💪 Preparatori',
    medico: '🏥 Medici',
    massoterapista: '💆 Massoterapisti'
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="page-head mb-4">
          <h1>Ricerca Staff</h1>
          <p>Trova professionisti per la tua società</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginBottom: 24 }}>
          {(['all', 'allenatore', 'preparatore', 'medico', 'massoterapista'] as const).map(type => (
            <button
              key={type}
              onClick={() => setStaffType(type)}
              className={`search-toggle-btn ${staffType === type ? 'active' : ''}`}
              style={{ fontSize: 12 }}
            >
              {staffTypeLabels[type]}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)' }}>⏳ Caricamento...</div>
        ) : staff.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--muted)', fontSize: 14 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👨‍🏫</div>
            Nessuno staff trovato
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {staff.map(s => (
              <div key={s.id} className="card">
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
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
                    {initials(s.nome)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 'bold', color: 'var(--text)' }}>{s.nome}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                      {s.staff_type === 'allenatore' && '⚽ Allenatore'}
                      {s.staff_type === 'preparatore' && '💪 Preparatore'}
                      {s.staff_type === 'medico' && '🏥 Medico'}
                      {s.staff_type === 'massoterapista' && '💆 Massoterapista'}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'var(--muted-2)', marginBottom: 10, lineHeight: 1.3 }}>
                  📍 {s.regione} {s.provincia && `• ${s.provincia}`}
                </div>

                {s.bio && (
                  <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4, marginBottom: 10, maxHeight: 50, overflow: 'hidden' }}>
                    {s.bio.substring(0, 80)}...
                  </div>
                )}

                <Button style={{ width: '100%', fontSize: 12, padding: '8px 12px' }}>
                  💬 Contatta
                </Button>
              </div>
            ))}
          </div>
        )}

        <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 24 }}>
          {staff.length} professionisti trovati
        </div>
      </div>
    </DashboardLayout>
  )
}
