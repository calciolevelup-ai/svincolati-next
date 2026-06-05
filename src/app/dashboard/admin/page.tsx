'use client'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'

export default function AdminPage() {
  const users = [
    {id:1,email:'mario@test.com',role:'player',sport:'calcio',registered:'2024-01-15'},
    {id:2,email:'asd@roma.it',role:'club',sport:'calcio',registered:'2024-01-20'},
    {id:3,email:'staff@test.it',role:'staff',sport:'calcio',registered:'2024-02-01'},
  ]

  return (
    <DashboardLayout>
      <div>
        <div className="page-head mb-4">
          <h1>Admin Panel</h1>
        </div>

        <div className="panel mb-4" style={{padding:0,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'1px solid var(--line)',background:'var(--bg)'}}>
                <th className="text-xs text-muted" style={{padding:12,textAlign:'left',fontWeight:600}}>Email</th>
                <th className="text-xs text-muted" style={{padding:12,textAlign:'left',fontWeight:600}}>Ruolo</th>
                <th className="text-xs text-muted" style={{padding:12,textAlign:'left',fontWeight:600}}>Sport</th>
                <th className="text-xs text-muted" style={{padding:12,textAlign:'left',fontWeight:600}}>Registrato</th>
                <th className="text-xs text-muted" style={{padding:12,textAlign:'left',fontWeight:600}}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{borderBottom:'1px solid var(--line-soft)'}}>
                  <td className="text-sm" style={{padding:12,color:'var(--text)'}}>{u.email}</td>
                  <td className="text-sm text-muted" style={{padding:12}}>{u.role}</td>
                  <td className="text-sm text-muted" style={{padding:12}}>{u.sport}</td>
                  <td className="text-sm text-muted" style={{padding:12}}>{u.registered}</td>
                  <td style={{padding:12}}>
                    <button className="btn-danger">Elimina</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid-3">
          {[
            {label:'Utenti totali',value:342},
            {label:'Messaggi',value:1240},
            {label:'Candidature',value:456},
          ].map(k => (
            <div key={k.label} className="kpi-box">
              <div className="value">{k.value}</div>
              <div className="label">{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
