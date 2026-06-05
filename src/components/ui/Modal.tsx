'use client'

export interface ModalProps {
  isOpen: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  maxWidth?: number
}

export default function Modal({ isOpen, title, children, onClose, maxWidth = 450 }: ModalProps) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        padding: 30,
        maxWidth: maxWidth,
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'rise 0.3s cubic-bezier(0.2, 0.7, 0.2, 1)'
      }}>
        {title && (
          <h2 style={{
            fontFamily: 'Anton',
            fontSize: 22,
            textTransform: 'uppercase',
            letterSpacing: '-.01em',
            color: 'var(--text)',
            marginBottom: 12
          }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}
