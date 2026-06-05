import emailjs from '@emailjs/browser'

// Initialize EmailJS - Replace with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_svincolati'
const EMAILJS_TEMPLATE_CANDIDATURA = 'template_candidatura'
const EMAILJS_TEMPLATE_TRIAL = 'template_trial'
const EMAILJS_TEMPLATE_MESSAGE = 'template_message'
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY'

// Initialize (call once on app startup)
export const initEmailJS = () => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY)
  } catch (err) {
    console.log('EmailJS initialization skipped (not configured)')
  }
}

export async function sendCandidatureNotification(
  clubEmail: string,
  playerName: string,
  adTitle: string,
  message?: string
) {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CANDIDATURA, {
      to_email: clubEmail,
      player_name: playerName,
      ad_title: adTitle,
      message: message || 'Nessun messaggio aggiuntivo',
      player_link: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/p-applications`
    })
  } catch (err) {
    console.error('Failed to send candidature email:', err)
  }
}

export async function sendTrialInviteNotification(
  playerEmail: string,
  clubName: string,
  trialDate: string,
  trialTime: string,
  message?: string
) {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_TRIAL, {
      to_email: playerEmail,
      club_name: clubName,
      trial_date: trialDate,
      trial_time: trialTime,
      message: message || 'Nessun messaggio aggiuntivo',
      trials_link: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/p-trials`
    })
  } catch (err) {
    console.error('Failed to send trial invite email:', err)
  }
}

export async function sendMessageNotification(
  recipientEmail: string,
  senderName: string,
  messagePreview: string
) {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_MESSAGE, {
      to_email: recipientEmail,
      sender_name: senderName,
      message_preview: messagePreview.substring(0, 100),
      messages_link: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/messaggi`
    })
  } catch (err) {
    console.error('Failed to send message email:', err)
  }
}
