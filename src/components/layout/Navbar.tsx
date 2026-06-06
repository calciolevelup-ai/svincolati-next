'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ThemeToggle'
import { scfg } from '@/lib/utils'

const NAV_PLAYER = [
  ['cv-edit', 'Il mio CV'],
  ['search-advanced', 'Ricerca'],
  ['p-applications', 'Candidature'],
  ['trasferimenti', 'Trasferimenti'],
  ['messaggi', 'Messaggi'],
  ['activity', 'Attività'],
]

const NAV_CLUB = [
  ['profile', 'La mia squadra'],
  ['search-advanced', 'Ricerca'],
  ['c-players', 'Giocatori'],
  ['c-ads', 'Annunci'],
  ['c-candidatures', 'Candidature'],
  ['messaggi', 'Messaggi'],
  ['activity', 'Attività'],
]

const NAV_STAFF = [
  ['profile', 'Il mio profilo'],
  ['search-advanced', 'Ricerca'],
  ['messaggi', 'Messaggi'],
  ['activity', 'Attività'],
]

export default function Navbar() {
  const { profile, logout } = useAuth()

  const navItems = profile?.role === 'player' ? NAV_PLAYER : profile?.role === 'club' ? NAV_CLUB : NAV_STAFF
  const cfg = scfg(profile?.sport)

  return (
    <nav style={{
      position:'fixed',
      top:0,
      left:0,
      right:0,
      background:'var(--card)',
      borderBottom:'1px solid var(--line)',
      zIndex:50
    }}>
      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'12px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Link href="/dashboard" style={{fontFamily:'Anton',fontSize:'20px',color:'var(--acid)',display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',transition:'all 0.3s ease'}}>
          {cfg.icon} SVINCOLATI
        </Link>

        <div style={{display:'flex',alignItems:'center',gap:'20px'}}>
          {navItems.map(([path, label]) => (
            <Link key={path} href={`/dashboard/${path}`} style={{color:'var(--muted)',fontSize:'13px',fontWeight:500,textDecoration:'none',transition:'all 0.3s ease',padding:'6px 10px',borderRadius:'8px'}}>
              {label}
            </Link>
          ))}
        </div>

        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <ThemeToggle />
          <Button onClick={logout}>
            Esci
          </Button>
        </div>
      </div>
    </nav>
  )
}
