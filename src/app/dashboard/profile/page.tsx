'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { scfg, initials } from '@/lib/utils'
import { useState } from 'react'

export default function ProfilePage() {
  const { profile, playerProfile, clubProfile } = useAuth()
  const cfg = scfg(profile?.sport)
  const [editing, setEditing] = useState(false)

  const isClub = profile?.role === 'club'
  const name = isClub ? clubProfile?.club_name : playerProfile?.nome
  const bio = isClub ? clubProfile?.url : playerProfile?.bio

  return (
    <DashboardLayout>
      <div style={{maxWidth:720,margin:'0 auto'}}>
        <div className="flex-between mb-4">
          <div className="page-head">
            <h1>{isClub ? 'La mia squadra' : 'Il mio CV'}</h1>
          </div>
          <Button onClick={() => setEditing(!editing)}>
            {editing ? 'Salva' : 'Modifica'}
          </Button>
        </div>

        {/* Hero Card */}
        <div className="card mb-4">
          <div className="flex gap-3" style={{alignItems:'flex-start'}}>
            <div style={{width:72,height:72,borderRadius:10,background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontFamily:'Anton',flexShrink:0}}>
              {initials(name || '')}
            </div>
            <div>
              <div className="text-lg font-bold">{name}</div>
              <div className="text-sm text-muted mt-2">{cfg.nome}</div>
              {bio && <div className="text-xs text-muted-2 mt-2" style={{maxHeight:50,overflow:'hidden'}}>{bio}</div>}
            </div>
          </div>
        </div>

        {/* KPI */}
        <div className="grid-4 mb-4">
          {[
            {label:'Visualizzazioni',value:342},
            {label:'Candidature',value:12},
            {label:'Messaggi',value:5},
            {label:'Salvati',value:8},
          ].map(kpi => (
            <div key={kpi.label} className="kpi-box">
              <div className="value">{kpi.value}</div>
              <div className="label">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Form (show if editing) */}
        {editing && (
          <div className="panel">
            <h2 className="text-lg font-bold mb-3">Modifica profilo</h2>
            <div className="grid">
              <div>
                <label>Nome</label>
                <input type="text" defaultValue={name || ''} />
              </div>
              <div>
                <label>Bio</label>
                <textarea defaultValue={bio || ''} style={{minHeight:90,resize:'none'}} />
              </div>
              <Button>Salva profilo</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
