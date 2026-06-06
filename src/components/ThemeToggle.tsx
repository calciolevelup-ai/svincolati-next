'use client'
import { useTheme } from '@/hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) return null

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        color: 'var(--text)',
        transition: '.18s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
      title={`Passa a tema ${theme === 'dark' ? 'chiaro' : 'scuro'}`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
