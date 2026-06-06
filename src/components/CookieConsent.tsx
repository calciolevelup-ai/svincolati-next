'use client'
import { useState, useEffect } from 'react'
import Button from './ui/Button'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--card)',
      border: '1px solid var(--line)',
      borderBottom: 'none',
      padding: '20px',
      zIndex: 999,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          🍪 Cookie e Privacy
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
          Utilizziamo cookie per migliorare l'esperienza. Accettando acconsenti al loro utilizzo secondo la nostra{' '}
          <a href="/privacy" style={{ color: 'var(--acid)', textDecoration: 'none', fontWeight: 600 }}>
            politica privacy
          </a>
          .
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, minWidth: '200px' }}>
        <Button
          onClick={handleAccept}
          style={{ flex: 1, fontSize: 12, padding: '10px 16px' }}
        >
          ✓ Accetta
        </Button>
        <Button
          onClick={handleReject}
          style={{
            flex: 1,
            fontSize: 12,
            padding: '10px 16px',
            background: 'rgba(76,194,255,0.15)',
            border: '1px solid rgba(76,194,255,0.2)',
            color: 'var(--blue)'
          }}
        >
          ✕ Rifiuta
        </Button>
      </div>
    </div>
  )
}
