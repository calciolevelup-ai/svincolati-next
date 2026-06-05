'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { scfg } from '@/lib/utils'

export default function DashboardHome() {
  const { profile, playerProfile, clubProfile } = useAuth()
  const cfg = scfg(profile?.sport)

  const name = playerProfile?.nome || clubProfile?.club_name || 'Utente'

  return (
    <DashboardLayout>
      <div>
        <div className="mb-4">
          <h1 className="text-2xl font-bold font-anton text-[var(--text)]">Benvenuto {name}! 👋</h1>
          <p className="text-[var(--muted)] text-sm mt-2">Sei registrato come {profile?.role === 'player' ? 'giocatore' : profile?.role === 'club' ? 'società' : 'staff'} di {cfg.nome}</p>
        </div>

        <div className="grid-3">
          <div className="kpi-box">
            <div className="value">12</div>
            <div className="label">Ricerche attive</div>
          </div>
          <div className="kpi-box">
            <div className="value">5</div>
            <div className="label">Candidature nuove</div>
          </div>
          <div className="kpi-box">
            <div className="value">3</div>
            <div className="label">Messaggi non letti</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
