'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (err) {
      setError('Errore nell\'invio dell\'email. Riprova.')
    } else {
      setMessage('Email di reset inviata! Controlla la tua casella postale.')
      setEmail('')
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
          Reset Password
        </h1>

        <p style={{
          fontSize: 13,
          color: 'var(--muted)',
          marginBottom: 24
        }}>
          Inserisci la tua email per ricevere un link di reset.
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
              Email <span style={{ color: 'var(--acid)' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
            {loading ? '⏳ Invio...' : '📧 Invia link'}
          </button>
        </form>

        <div style={{
          marginTop: 20,
          textAlign: 'center',
          fontSize: 13,
          color: 'var(--muted)'
        }}>
          Torna al <Link href="/auth/login" style={{ color: 'var(--acid)', textDecoration: 'none' }}>login</Link>
        </div>
      </div>
    </div>
  )
}
