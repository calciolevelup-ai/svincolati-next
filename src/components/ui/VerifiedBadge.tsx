export interface VerifiedBadgeProps {
  verified?: boolean
  tessera?: string
}

export default function VerifiedBadge({ verified, tessera }: VerifiedBadgeProps) {
  const isVerified = verified || (tessera && tessera.length > 2)
  if (!isVerified) return null

  return (
    <span className="v-badge">
      ✔ Verificato
    </span>
  )
}
