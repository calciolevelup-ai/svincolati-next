export interface UnreadBadgeProps {
  count: number
  max?: number
}

export default function UnreadBadge({ count, max = 99 }: UnreadBadgeProps) {
  if (count <= 0) return null

  const displayCount = count > max ? `${max}+` : count

  return (
    <div style={{
      position: 'absolute',
      top: -8,
      right: -8,
      background: 'var(--danger)',
      color: '#fff',
      width: 24,
      height: 24,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11,
      fontWeight: 700,
      border: '2px solid var(--card)',
      boxShadow: '0 2px 8px rgba(255, 90, 60, 0.3)'
    }}>
      {displayCount}
    </div>
  )
}
