'use client'
import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'
import { logActivity } from '@/lib/activity'
import { sendMessageNotification } from '@/lib/email'

export default function MessaggiPage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [threads, setThreads] = useState<any[]>([])
  const [selectedThread, setSelectedThread] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadThreads()
  }, [])

  useEffect(() => {
    if (selectedThread) {
      loadMessages(selectedThread.id)
      subscribeToMessages(selectedThread.id)
    }
  }, [selectedThread])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadThreads = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('threads')
      .select(`*`)
      .or(`user_a.eq.${profile?.id},user_b.eq.${profile?.id}`)
      .order('updated_at', { ascending: false })

    if (data) {
      const enriched = await Promise.all(data.map(async (t) => {
        const otherUserId = t.user_a === profile?.id ? t.user_b : t.user_a
        const { data: otherProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', otherUserId)
          .single()
        return { ...t, otherProfile: otherProfile }
      }))
      setThreads(enriched)
    }
    setLoading(false)
  }

  const loadMessages = async (threadId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (data) setMessages(data)
  }

  const subscribeToMessages = (threadId: string) => {
    const subscription = supabase
      .channel(`messages:${threadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` },
        (payload) => {
          setMessages(msgs => [...msgs, payload.new])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !profile?.id) return

    setSendingMessage(true)
    try {
      const { error } = await supabase.from('messages').insert({
        thread_id: selectedThread.id,
        sender_id: profile.id,
        content: newMessage
      })

      if (!error) {
        // Log activity
        await logActivity(profile.id, 'message_sent', selectedThread.id, null, {
          recipientId: selectedThread.otherProfile?.id,
          content: newMessage
        })

        // Send email notification to recipient
        if (selectedThread.otherProfile?.email) {
          await sendMessageNotification(
            selectedThread.otherProfile.email,
            profile?.email?.split('@')[0] || 'Un utente',
            newMessage
          )
        }

        setNewMessage('')
        await supabase.from('threads').update({ updated_at: new Date().toISOString() }).eq('id', selectedThread.id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSendingMessage(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', gap: 16 }}>
        {/* Threads List */}
        <div style={{
          flex: '0 0 300px',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'Anton', fontSize: 16, textTransform: 'uppercase', color: 'var(--text)' }}>Messaggi</h3>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            {loading ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>⏳ Caricamento...</div>
            ) : threads.length === 0 ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>💬</div>
                Nessun messaggio ancora
              </div>
            ) : (
              threads.map(thread => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  style={{
                    width: '100%',
                    padding: 12,
                    borderBottom: '1px solid var(--line-soft)',
                    background: selectedThread?.id === thread.id ? 'rgba(65, 194, 133, 0.08)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: '.16s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = selectedThread?.id === thread.id ? 'rgba(65, 194, 133, 0.08)' : 'transparent'}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: 'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontFamily: 'Anton',
                      flexShrink: 0
                    }}>
                      {initials(thread.otherProfile?.email)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {thread.otherProfile?.email?.split('@')[0]}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 2 }}>
                        {thread.last_message && thread.last_message.substring(0, 30) + (thread.last_message.length > 30 ? '...' : '')}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat View */}
        {selectedThread ? (
          <div style={{
            flex: 1,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 14,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: 16,
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(65, 194, 133, 0.2), rgba(76, 194, 255, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontFamily: 'Anton'
              }}>
                {initials(selectedThread.otherProfile?.email)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {selectedThread.otherProfile?.email?.split('@')[0]}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Online</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12, margin: 'auto' }}>
                  Inizia la conversazione
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender_id === profile?.id ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{
                      background: msg.sender_id === profile?.id ? 'var(--acid)' : 'var(--bg-2)',
                      color: msg.sender_id === profile?.id ? '#0b0d0a' : 'var(--text)',
                      padding: '10px 14px',
                      borderRadius: 10,
                      maxWidth: '70%',
                      wordWrap: 'break-word',
                      fontSize: 13,
                      lineHeight: 1.4
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: 16,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              gap: 10
            }}>
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Scrivi un messaggio..."
                style={{
                  flex: 1,
                  background: 'var(--bg-2)',
                  border: '1px solid var(--line)',
                  color: 'var(--text)',
                  fontFamily: 'Archivo',
                  fontSize: 13,
                  padding: '12px 14px',
                  borderRadius: 10,
                  outline: 'none',
                  transition: '.16s'
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={sendingMessage || !newMessage.trim()}
                style={{
                  padding: '12px 20px',
                  fontSize: 12,
                  opacity: sendingMessage || !newMessage.trim() ? 0.5 : 1
                }}
              >
                {sendingMessage ? '⏳' : '📤'}
              </Button>
            </div>
          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--muted)',
            fontSize: 14
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
              Seleziona una conversazione
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
