'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import VerifiedBadge from '@/components/ui/VerifiedBadge'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { getMatchingAds } from '@/lib/matching'
import { logActivity } from '@/lib/activity'
import { sendCandidatureNotification } from '@/lib/email'

export default function PlayerTeamsPage() {
  const { profile, playerProfile } = useAuth()
  const supabase = createClient()

  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; text: string; type: 'success' | 'error' }>({ show: false, text: '', type: 'success' })

  useEffect(() => {
    loadAds()
  }, [])

  const loadAds = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('ads')
        .select(`*, club:profiles(id,nome,verified,tessera)`)
        .eq('sport', profile?.sport)
        .order('created_at', { ascending: false })
        .limit(100)

      if (data && playerProfile) {
        const matched = getMatchingAds(playerProfile, data, 0)
        setAds(matched)
      } else {
        setAds(data || [])
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const openModal = (ad: any) => {
    setSelectedAd(ad)
    setMessage('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedAd(null)
    setMessage('')
  }

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, text, type })
    setTimeout(() => setToast({ show: false, text: '', type: 'success' }), 3000)
  }

  const applyCandidature = async () => {
    if (!selectedAd || !profile?.id) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('candidatures').insert({
        ad_id: selectedAd.id,
        player_id: playerProfile?.id,
        club_id: selectedAd.club_id,
        status: 'inviata',
        tipo: 'outbound',
        sport: profile?.sport,
        message: message || null
      })

      if (error) {
        showToast('❌ Errore durante l\'invio', 'error')
      } else {
        // Log activity
        await logActivity(profile.id, 'candidature_sent', selectedAd.id, 'ad', {
          adTitle: selectedAd.ruolo,
          clubId: selectedAd.club_id,
          message: message || null
        })

        // Send email notification to club
        const { data: clubProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', selectedAd.club_id)
          .single()

        if (clubProfile?.email) {
          await sendCandidatureNotification(
            clubProfile.email,
            playerProfile?.nome || 'Un giocatore',
            selectedAd.ruolo,
            message
          )
        }

        showToast('✅ Candidatura inviata con successo!')
        closeModal()
        loadAds()
      }
    } catch (err) {
      console.error(err)
      showToast('❌ Errore sconosciuto', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (profile?.role !== 'player') {
    return <DashboardLayout><div style={{textAlign:'center',color:'var(--muted)'}}>Solo i giocatori possono visualizzare gli annunci</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div style={{maxWidth:1000,margin:'0 auto'}}>
        <div style={{marginBottom:24}}>
          <h1 style={{fontSize:28,fontWeight:'bold',fontFamily:'Anton',color:'var(--text)',marginBottom:8}}>Squadre che cercano</h1>
          <p style={{fontSize:13,color:'var(--muted)'}}>Sfoglia gli annunci delle società e candidati</p>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)'}}>⏳ Caricamento...</div>
        ) : ads.length === 0 ? (
          <div style={{textAlign:'center',padding:48,color:'var(--muted)',fontSize:14}}>
            <div style={{fontSize:32,marginBottom:12}}>🛡️</div>
            Nessun annuncio disponibile al momento
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))',gap:18}}>
            {ads.map(ad => (
              <div key={ad.id} style={{background:'var(--card)',border:'1px solid var(--line)',borderRadius:14,padding:22,transition:'.2s',position:'relative',overflow:'hidden'}}>
                <div style={{fontSize:12,color:'var(--muted)',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
                  🏢 {ad.club?.nome || 'Società'}
                  <VerifiedBadge verified={ad.club?.verified} tessera={ad.club?.tessera} />
                </div>
                <div style={{fontSize:16,fontWeight:'bold',color:'var(--text)',marginBottom:8}}>
                  {ad.ruolo}
                </div>
                <div style={{fontSize:13,color:'var(--muted)',marginBottom:12}}>
                  Categoria: {ad.cat}
                  <br />
                  Regione: {ad.regione}
                  {ad.provincia && ` • ${ad.provincia}`}
                </div>
                <div style={{fontSize:12,color:'var(--muted-2)',lineHeight:1.4,marginBottom:16,maxHeight:60,overflow:'hidden'}}>
                  {ad.descr}
                </div>
                <div style={{fontSize:11,color:'var(--muted-2)',marginBottom:12}}>
                  📅 Scade in {Math.ceil((new Date(ad.expires_at).getTime() - Date.now()) / (24 * 3600 * 1000))} giorni
                </div>
                <Button
                  onClick={() => openModal(ad)}
                  style={{width:'100%',fontSize:13,padding:'10px 16px'}}
                >
                  📤 Candidati
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'success' ? 'rgba(65, 194, 133, 0.95)' : 'rgba(255, 90, 60, 0.95)',
            color: '#fff',
            padding: '14px 20px',
            borderRadius: 11,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 1001,
            animation: 'slideIn 0.3s ease'
          }}>
            {toast.text}
          </div>
        )}

        {/* Candidature Modal */}
        {modalOpen && selectedAd && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 18,
              padding: 30,
              maxWidth: 450,
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'rise 0.3s cubic-bezier(0.2, 0.7, 0.2, 1)'
            }}>
              <h2 style={{
                fontFamily: 'Anton',
                fontSize: 22,
                textTransform: 'uppercase',
                letterSpacing: '-.01em',
                color: 'var(--text)',
                marginBottom: 8
              }}>Candida ti</h2>

              <p style={{
                fontSize: 13,
                color: 'var(--muted)',
                marginBottom: 20
              }}>
                Stai per candidarti a: <strong>{selectedAd.ruolo}</strong> ({selectedAd.cat})
              </p>

              <div style={{marginBottom: 16}}>
                <label style={{
                  display: 'block',
                  fontFamily: 'Spline Sans Mono',
                  fontSize: 11,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  marginBottom: 8
                }}>
                  Messaggio (opzionale)
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Scrivi un messaggio personalizzato..."
                  style={{
                    width: '100%',
                    background: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    color: 'var(--text)',
                    fontFamily: 'Archivo',
                    fontSize: 13,
                    padding: '12px 14px',
                    borderRadius: 10,
                    minHeight: 80,
                    resize: 'vertical',
                    transition: '.16s',
                    outline: 'none'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--acid)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--line)'}
                />
              </div>

              <div style={{display: 'flex', gap: 10}}>
                <Button
                  onClick={closeModal}
                  style={{
                    flex: 1,
                    background: 'var(--bg-2)',
                    border: '1px solid var(--line)',
                    color: 'var(--text)',
                    fontSize: 13,
                    padding: '12px 16px'
                  }}
                >
                  Annulla
                </Button>
                <Button
                  onClick={applyCandidature}
                  disabled={submitting}
                  style={{
                    flex: 1,
                    opacity: submitting ? 0.6 : 1,
                    fontSize: 13,
                    padding: '12px 16px'
                  }}
                >
                  {submitting ? '⏳ Invio...' : '📤 Candidati'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
