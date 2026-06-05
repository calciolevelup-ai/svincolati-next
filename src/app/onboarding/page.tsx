'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const handleSkip = () => {
    localStorage.setItem('onboarding-completed', 'true')
    router.push('/dashboard')
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      handleSkip()
    }
  }

  const steps = [
    {
      title: 'Benvenuto su SVINCOLATI!',
      description: 'La piattaforma che connette giocatori svincolati e società sportive.',
      icon: '⚽',
      highlights: ['Trova il tuo prossimo team', 'Scopri nuovi giocatori', 'Comunica in tempo reale']
    },
    {
      title: 'Il tuo profilo',
      description: 'Completa il tuo CV con foto, statistiche e video per essere più visibile.',
      icon: '📝',
      highlights: ['Carica video highlights', 'Aggiungi storico carriera', 'Abilita candidature']
    },
    {
      title: 'Ricerca e candidature',
      description: 'Sfoglia gli annunci delle società e candidati per i ruoli che ti interessano.',
      icon: '🔍',
      highlights: ['Filtra per categoria', 'Candidati con messaggio', 'Salva ai preferiti']
    },
    {
      title: 'Comunica con i club',
      description: 'Ricevi inviti ai trial, messaggi e notifiche dalle società interessate.',
      icon: '💬',
      highlights: ['Chat in tempo reale', 'Gestisci inviti trial', 'Traccia attività']
    }
  ]

  const current = steps[step - 1]

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
        maxWidth: 500,
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>{current.icon}</div>
          <h1 style={{
            fontFamily: 'Anton',
            fontSize: 28,
            textTransform: 'uppercase',
            color: 'var(--text)',
            marginBottom: 8,
            letterSpacing: '-.01em'
          }}>
            {current.title}
          </h1>
          <p style={{
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.6
          }}>
            {current.description}
          </p>
        </div>

        <div style={{
          background: 'var(--bg-2)',
          borderRadius: 10,
          padding: 20,
          marginBottom: 30
        }}>
          {current.highlights.map((h, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              fontSize: 13,
              color: 'var(--text)',
              marginBottom: i < current.highlights.length - 1 ? 12 : 0
            }}>
              <span style={{ color: 'var(--acid)', fontWeight: 'bold' }}>✓</span>
              {h}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: 6,
          marginBottom: 24,
          justifyContent: 'center'
        }}>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: i <= step ? 'var(--acid)' : 'var(--line)',
                transition: '.2s'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            onClick={handleSkip}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
              fontSize: 13,
              padding: '12px 16px'
            }}
          >
            Salta
          </Button>
          <Button
            onClick={handleNext}
            style={{
              flex: 1,
              fontSize: 13,
              padding: '12px 16px'
            }}
          >
            {step < 4 ? 'Avanti' : 'Inizia'}
          </Button>
        </div>
      </div>
    </div>
  )
}
