'use client'
import { useState, useEffect } from 'react'
import Button from './ui/Button'

interface OnboardingStep {
  title: string
  description: string
  icon: string
}

const STEPS: OnboardingStep[] = [
  {
    icon: '👤',
    title: 'Completa il tuo profilo',
    description: 'Aggiungi una foto, descrivi le tue caratteristiche e il tuo background sportivo per fare una buona impressione.'
  },
  {
    icon: '🔍',
    title: 'Cerca i tuoi match',
    description: 'Usa i filtri avanzati per trovare squadre e giocatori che corrispondono al tuo profilo e le tue ambizioni.'
  },
  {
    icon: '💬',
    title: 'Comunica direttamente',
    description: 'Invia candidature e messaggi per negoziare condizioni. La comunicazione è tutto!'
  },
  {
    icon: '⭐',
    title: 'Ottieni referenze',
    description: 'Costruisci la tua reputazione ricevendo referenze da società e giocatori con cui hai lavorato.'
  }
]

export default function OnboardingModal() {
  const [show, setShow] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const completed = localStorage.getItem('onboarding-completed')
    if (!completed) {
      const timer = setTimeout(() => setShow(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem('onboarding-completed', 'true')
    setShow(false)
  }

  if (!show) return null

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        padding: '40px 30px',
        maxWidth: 450,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'rise 0.3s cubic-bezier(0.2, 0.7, 0.2, 1)'
      }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            height: 4,
            background: 'var(--bg-2)',
            borderRadius: 2,
            overflow: 'hidden',
            marginBottom: 8
          }}>
            <div style={{
              height: '100%',
              background: 'var(--acid)',
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            Passo {currentStep + 1} di {STEPS.length}
          </div>
        </div>

        {/* Content */}
        <div style={{ marginBottom: 30 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{step.icon}</div>
          <h2 style={{
            fontFamily: 'Anton',
            fontSize: 24,
            color: 'var(--text)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '-0.5px'
          }}>
            {step.title}
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--muted)',
            lineHeight: 1.6,
            margin: 0
          }}>
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          {currentStep > 0 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                flex: 1,
                background: 'transparent',
                border: '1px solid var(--line)',
                color: 'var(--muted)',
                padding: '10px 16px',
                fontSize: 12
              }}
            >
              ← Indietro
            </Button>
          )}
          <Button
            onClick={handleNext}
            style={{ flex: 1, padding: '10px 16px', fontSize: 12 }}
          >
            {currentStep === STEPS.length - 1 ? '✓ Inizia' : 'Avanti →'}
          </Button>
          <Button
            onClick={handleComplete}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid var(--line)',
              color: 'var(--muted)',
              padding: '10px 16px',
              fontSize: 12
            }}
          >
            ✕ Salta
          </Button>
        </div>
      </div>
    </div>
  )
}
