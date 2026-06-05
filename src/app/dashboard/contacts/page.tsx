'use client'
import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export default function ContactsPage() {
  const { profile } = useAuth()
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="page-head mb-4">
          <h1>Contattaci</h1>
          <p>Hai una domanda o un feedback? Scrivici!</p>
        </div>

        {submitted && (
          <div style={{
            background: 'rgba(65, 194, 133, 0.2)',
            border: '1px solid var(--acid)',
            borderRadius: 10,
            padding: 16,
            marginBottom: 24,
            color: 'var(--acid)',
            fontSize: 13
          }}>
            ✅ Messaggio inviato con successo! Ti risponderemo al più presto.
          </div>
        )}

        <form onSubmit={handleSubmit} className="panel">
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Spline Sans Mono',
              fontSize: 11,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 8
            }}>
              Nome
            </label>
            <input
              type="text"
              defaultValue={profile?.email?.split('@')[0] || ''}
              disabled
              style={{ opacity: 0.6 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Spline Sans Mono',
              fontSize: 11,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 8
            }}>
              Email
            </label>
            <input
              type="email"
              defaultValue={profile?.email || ''}
              disabled
              style={{ opacity: 0.6 }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Spline Sans Mono',
              fontSize: 11,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 8
            }}>
              Argomento
            </label>
            <input
              type="text"
              placeholder="Scrivi l'argomento..."
              value={formData.subject}
              onChange={e => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Spline Sans Mono',
              fontSize: 11,
              letterSpacing: '.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: 8
            }}>
              Messaggio
            </label>
            <textarea
              placeholder="Raccontaci come possiamo aiutarti..."
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              required
              style={{
                width: '100%',
                minHeight: 140,
                padding: '12px 14px',
                background: 'var(--bg-2)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                color: 'var(--text)',
                fontFamily: 'Archivo',
                fontSize: 14,
                outline: 'none',
                transition: '.16s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--acid)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'}
            />
          </div>

          <Button type="submit" style={{ width: '100%' }}>
            📧 Invia messaggio
          </Button>
        </form>

        <div style={{
          marginTop: 30,
          padding: 20,
          background: 'var(--bg-2)',
          borderRadius: 10,
          fontSize: 12,
          color: 'var(--muted)',
          lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>Altre vie di contatto:</div>
          <div>📧 support@svincolati.it</div>
          <div>📱 +39 XXX XXXX XXX</div>
          <div>🕐 Disponibili 9:00 - 18:00 (dal lunedì al venerdì)</div>
        </div>
      </div>
    </DashboardLayout>
  )
}
