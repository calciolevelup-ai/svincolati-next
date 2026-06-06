import { getSportTheme } from '@/lib/sportThemes'

export interface SportBadgeProps {
  sport: string
  size?: 'sm' | 'md' | 'lg'
}

export default function SportBadge({ sport, size = 'md' }: SportBadgeProps) {
  const theme = getSportTheme(sport)

  const sizes = {
    sm: { fontSize: 10, padding: '3px 8px', borderRadius: 6 },
    md: { fontSize: 12, padding: '6px 12px', borderRadius: 8 },
    lg: { fontSize: 14, padding: '8px 14px', borderRadius: 10 }
  }

  const sizeStyle = sizes[size]

  return (
    <span style={{
      background: theme.color,
      color: theme.hex,
      fontWeight: 600,
      display: 'inline-block',
      ...sizeStyle
    }}>
      {theme.icon} {theme.label}
    </span>
  )
}
