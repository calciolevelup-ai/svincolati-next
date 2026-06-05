import Link from 'next/link'

export default function NotFound() {
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
        textAlign: 'center',
        maxWidth: 500
      }}>
        <h1 style={{
          fontFamily: 'Anton',
          fontSize: 80,
          color: 'var(--acid)',
          margin: '0 0 20px 0',
          lineHeight: 1
        }}>
          404
        </h1>

        <h2 style={{
          fontFamily: 'Anton',
          fontSize: 32,
          textTransform: 'uppercase',
          color: 'var(--text)',
          marginBottom: 12,
          letterSpacing: '-.01em'
        }}>
          Pagina non trovata
        </h2>

        <p style={{
          fontSize: 15,
          color: 'var(--muted)',
          marginBottom: 30,
          lineHeight: 1.6
        }}>
          La pagina che stai cercando non esiste o è stata spostata. Torna alla home per continuare.
        </p>

        <Link href="/dashboard" style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 24px',
          background: 'var(--acid)',
          color: '#0b0d0a',
          borderRadius: 11,
          fontFamily: 'Archivo',
          fontWeight: 800,
          fontSize: 15,
          textDecoration: 'none',
          transition: '.18s',
          cursor: 'pointer'
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          🏠 Torna alla home
        </Link>
      </div>
    </div>
  )
}
