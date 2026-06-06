'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [stats, setStats] = useState({ users: 0, messages: 0, candidatures: 0, ads: 0 })
  const [inviteCodes, setInviteCodes] = useState<any[]>([])
  const [newCode, setNewCode] = useState('')
  const [generatingCode, setGeneratingCode] = useState(false)

  useEffect(() => {
    loadStats()
    loadInviteCodes()
  }, [])

  const loadStats = async () => {
    try {
      const [users, messages, cands, ads] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('messages').select('id', { count: 'exact', head: true }),
        supabase.from('candidatures').select('id', { count: 'exact', head: true }),
        supabase.from('ads').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        users: users.count || 0,
        messages: messages.count || 0,
        candidatures: cands.count || 0,
        ads: ads.count || 0
      })
    } catch (err) {
      console.error(err)
    }
  }

  const loadInviteCodes = async () => {
    try {
      const { data } = await supabase
        .from('invite_codes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      setInviteCodes(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const generateInviteCode = async () => {
    if (!newCode.trim()) {
      alert('Inserisci un codice')
      return
    }
    setGeneratingCode(true)
    try {
      const { error } = await supabase.from('invite_codes').insert({ code: newCode.toUpperCase() })
      if (error) throw error
      setNewCode('')
      loadInviteCodes()
      alert('Codice creato!')
    } catch (err: any) {
      alert(err.message || 'Errore')
    } finally {
      setGeneratingCode(false)
    }
  }

  const deleteInviteCode = async (id: string) => {
    if (!confirm('Eliminare questo codice?')) return
    try {
      await supabase.from('invite_codes').delete().eq('id', id)
      loadInviteCodes()
    } catch (err) {
      console.error(err)
    }
  }

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

        <div className="grid-3 mb-4">
          {[
            {label:'Utenti totali',value:stats.users},
            {label:'Messaggi',value:stats.messages},
            {label:'Candidature',value:stats.candidatures},
            {label:'Annunci',value:stats.ads},
          ].map(k => (
            <div key={k.label} className="kpi-box">
              <div className="value">{k.value}</div>
              <div className="label">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="panel mb-4">
          <h2 style={{fontSize:18,fontWeight:'bold',marginBottom:16,color:'var(--text)'}}>Codici invito</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:10,marginBottom:16}}>
            <input
              type="text"
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              placeholder="Es: LEGA2026"
              className="search-input"
              style={{textTransform:'uppercase'}}
            />
            <Button onClick={generateInviteCode} disabled={generatingCode}>
              {generatingCode ? '⏳' : '+ Crea'}
            </Button>
          </div>
          {inviteCodes.length > 0 && (
            <div style={{display:'grid',gap:8}}>
              {inviteCodes.map(code => (
                <div key={code.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px',background:'var(--bg-2)',borderRadius:8}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:'bold',color:'var(--text)',fontFamily:'monospace'}}>{code.code}</div>
                    <div style={{fontSize:11,color:'var(--muted)',marginTop:2}}>Usato {code.uses} volte</div>
                  </div>
                  <button onClick={() => deleteInviteCode(code.id)} style={{color:'var(--danger)',background:'none',border:'none',cursor:'pointer',fontSize:12}}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
