export type Sport = 'calcio' | 'calcio5' | 'pallavolo' | 'rugby' | 'basket'
export type Role = 'player' | 'club' | 'staff'
export type CandidatureStatus = 'inviata' | 'accettata' | 'rifiutata'
export type TransferTipo = 'Confermato' | 'Trattativa' | 'Svincolato'
export type TrialStatus = 'pending' | 'accepted' | 'declined' | 'completed'
export type ActivityEventType = 'profile_view' | 'candidature_sent' | 'candidature_received' | 'message' | 'trial_invite' | 'trial_accepted' | 'trial_declined'

export interface Profile {
  id: string
  role: Role
  sport: Sport
  email?: string
  verified: boolean
  invite_code?: string
  invited_by?: string
  dob?: string
  onboarded: boolean
  created_at: string
}

export interface PlayerProfile {
  id: string
  user_id: string
  nome: string
  ruolo?: string
  staff_type?: string
  staff_cat?: string
  esperienza_anni?: number
  eta?: number
  piede?: string
  cat?: string
  regione?: string
  provincia?: string
  squadra?: string
  altezza?: number
  bio?: string
  video?: string
  contatto?: string
  photo?: string
  tessera?: string
  disponibile: boolean
  disponibile_da?: string
  views: number
  sport: Sport
  profile?: Profile
  career_history?: CareerEntry[]
}

export interface CareerEntry {
  id: string
  player_id: string
  stagione?: string
  squadra?: string
  categoria?: string
  presenze?: number
  reti?: number
  sort_order?: number
}

export interface ClubProfile {
  id: string
  user_id: string
  club_name: string
  loc?: string
  regione?: string
  provincia?: string
  paese?: string
  impianto?: string
  impianto_indirizzo?: string
  url?: string
  figc?: string
  crest?: string
  sport: Sport
  profile?: Profile
}

export interface Ad {
  id: string
  club_id: string
  sport: Sport
  ruolo: string
  cat: string
  regione: string
  provincia?: string
  descr: string
  tags: string[]
  expires_at: string
  views: number
  created_at: string
  club?: ClubProfile
}

export interface Candidature {
  id: string
  ad_id?: string
  club_id: string
  player_id: string
  status: CandidatureStatus
  tipo: 'inbound' | 'outbound'
  created_at: string
  ad?: Ad
  player?: PlayerProfile
  club?: ClubProfile
}

export interface Thread {
  id: string
  player_id: string
  club_id: string
  created_at: string
  messages?: Message[]
  player?: PlayerProfile
  club?: ClubProfile
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  from_role: Role
  text: string
  created_at: string
}

export interface Transfer {
  id: string
  club_id?: string
  nome: string
  ruolo?: string
  da?: string
  a?: string
  cat?: string
  tipo: TransferTipo
  regione?: string
  sport: Sport
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  target_id: string
  target_type: 'player' | 'club' | 'staff'
  created_at: string
}

export interface SportConfig {
  nome: string
  icon: string
  foot: boolean
  score: string
  scoreOne: string
  gk: string | null
  fed: string
  ruoli: string[]
  categorie: string[]
  abbr: Record<string, string>
}

export interface Trial {
  id: string
  club_id: string
  player_id: string
  trial_date: string
  trial_time?: string
  message?: string
  status: TrialStatus
  sport: Sport
  created_at: string
  club?: ClubProfile
  player?: PlayerProfile
}

export interface ActivityLog {
  id: string
  user_id: string
  event_type: ActivityEventType
  actor_id?: string
  actor_name?: string
  description: string
  reference_id?: string
  created_at: string
}

export interface SearchPreferences {
  id: string
  player_id: string
  cat_min?: string
  regione_pref?: string
  note?: string
  updated_at: string
}

export interface PlayerView {
  id: string
  player_id: string
  club_id: string
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  reported_player_id: string
  reason?: string
  note?: string
  created_at: string
}
