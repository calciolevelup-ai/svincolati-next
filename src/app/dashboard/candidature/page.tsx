'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'

export default function CandidaturePage() {
  const { profile } = useAuth()

  const candidatures = [
    {id:1,nome:'Mario Rossi',ruolo:'Centravanti',status:'inbound',ts:Date.now()-86400000},
    {id:2,nome:'Luca Bianchi',ruolo:'Difensore',status:'outbound',ts:Date.now()-172800000},
  ]

  return (
    <DashboardLayout>
      <div>
        <div className="page-head mb-4">
          <h1>Candidature</h1>
        </div>

        {profile?.role === 'club' && (
          <div className="grid-2 mb-4">
            <div className="kpi-box">
              <div className="value">8</div>
              <div className="label">🟢 Si sono proposti</div>
            </div>
            <div className="kpi-box">
              <div className="value" style={{color:'var(--blue)'}}>3</div>
              <div className="label">🔵 Contattati da noi</div>
            </div>
          </div>
        )}

        <div className="grid">
          {candidatures.map(c => (
            <div key={c.id} style={{background:'var(--card)',border:c.status==='inbound'?'2px solid var(--acid)':'2px solid var(--blue)',borderRadius:12,padding:14,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div>
                <div className="text-base font-bold">
                  {c.nome} <span className="badge" style={{background:c.status==='inbound'?'rgba(65, 194, 133, 0.2)':'rgba(76, 194, 255, 0.1)',color:c.status==='inbound'?'var(--acid)':'var(--blue)',marginLeft:6}}>{c.status==='inbound'?'Si è proposto':'Contattato da noi'}</span>
                </div>
                <div className="text-sm text-muted mt-2">{c.ruolo}</div>
              </div>
              <button className="btn">Contatta</button>
            </div>
          ))}
        </div>

        {candidatures.length === 0 && (
          <div style={{textAlign:'center',padding:36,color:'var(--muted)',fontSize:13}}>
            Nessuna candidatura
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
