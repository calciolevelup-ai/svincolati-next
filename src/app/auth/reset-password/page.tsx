'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Le password non corrispondono')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri')
      setLoading(false)
      return
    }

    const { error: err } = await supabase.auth.updateUser({ password })

    if (err) {
      setError('Errore nel reset della password. Riprova o richiedi un nuovo link.')
    } else {
      setMessage('✅ Password cambiata con successo! Reindirizzamento...')
      setTimeout(() => router.push('/auth/login'), 2000)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        padding: 40,
        maxWidth: 400,
        width: '100%'
      }}>
        <h1 style={{
          fontFamily: 'Anton',
          fontSize: 28,
          textTransform: 'uppercase',
          color: 'var(--text)',
          marginBottom: 8,
          letterSpacing: '-.01em'
        }}>
          Nuova Password
        </h1>

        <p style={{
          fontSize: 13,
          color: 'var(--muted)',
          marginBottom: 24
        }}>
          Inserisci la tua nuova password per completare il reset.
        </p>

        {message && (
          <div style={{
            background: 'rgba(65, 194, 133, 0.2)',
            border: '1px solid var(--acid)',
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            fontSize: 12,
            color: 'var(--acid)'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(255, 90, 60, 0.2)',
            border: '1px solid var(--danger)',
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            fontSize: 12,
            color: 'var(--danger)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
              Nuova Password <span style={{ color: 'var(--acid)' }}>*</span>
            </label>
            <input
              type="password"
              placeholder="Almeno 6 caratteri"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
              Conferma Password <span style={{ color: 'var(--acid)' }}>*</span>
            </label>
            <input
              type="password"
              placeholder="Ripeti la password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'var(--acid)',
              color: '#0b0d0a',
              border: 'none',
              borderRadius: 11,
              fontFamily: 'Archivo',
              fontWeight: 800,
              fontSize: 15,
              cursor: 'pointer',
              transition: '.18s',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? '⏳ Aggiornamento...' : '🔒 Cambia Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
