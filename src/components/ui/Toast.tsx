'use client'

export interface ToastProps {
  show: boolean
  text: string
  type?: 'success' | 'error' | 'info'
}

export default function Toast({ show, text, type = 'success' }: ToastProps) {
  if (!show) return null

  const bgColor = type === 'success' ? 'rgba(65, 194, 133, 0.95)' : type === 'error' ? 'rgba(255, 90, 60, 0.95)' : 'rgba(76, 194, 255, 0.95)'

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      background: bgColor,
      color: '#fff',
      padding: '14px 20px',
      borderRadius: 11,
      fontSize: 13,
      fontWeight: 600,
      zIndex: 1001,
      animation: 'slideIn 0.3s ease'
    }}>
      {text}
    </div>
  )
}
