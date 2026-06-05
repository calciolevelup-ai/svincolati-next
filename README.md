# SVINCOLATI — Next.js Rebuild

Ricostruzione della piattaforma con **Next.js 16 + TypeScript + Tailwind** e database normalizato su **Supabase**.

## ✅ Completato

### Core Setup
- ✅ Progetto Next.js con TypeScript, Tailwind, ESLint
- ✅ Supabase configurato (client/server)
- ✅ Middleware autenticazione
- ✅ Layout globale con CSS custom properties

### Autenticazione
- ✅ Pagina Login
- ✅ Pagina Register con validazione
- ✅ Hook `useAuth()` per gestire profilo
- ✅ Logout

### Database
- ✅ Schema SQL con 14 tabelle normalizzate
- ✅ RLS policies (Row Level Security)
- ✅ Tabelle: profiles, player_profiles, club_profiles, ads, candidatures, threads, messages, transfers, favorites, player_views, reports, referenze, career_history, invite_codes

### API Routes
- ✅ GET `/api/auth/me` — profilo corrente
- ✅ GET `/api/players` — cerca giocatori con filtri

### Componenti UI
- ✅ Componente Button (variants: primary, ghost, danger, done)
- ✅ Utility functions (cn, scfg, initials, relTime, calcAge, etc)

### Dashboard Base
- ✅ `/dashboard` — home page

## 📋 Da Implementare

### Pagine Dashboard
- [ ] `/dashboard/cerca` — Search con filtri (tab Giocatori/Staff/Squadre)
- [ ] `/dashboard/profilo` — Edit profilo giocatore/club
- [ ] `/dashboard/candidature` — Lista candidature (inbound/outbound)
- [ ] `/dashboard/messaggi` — Chat realtime
- [ ] `/dashboard/trasferimenti` — Gestire trasferimenti
- [ ] `/dashboard/admin` — Panel admin (gestione utenti, inviti, etc)

### API Routes Complete
- [ ] POST `/api/players` — crea/aggiorna profilo
- [ ] GET/POST `/api/ads` — annunci
- [ ] GET/POST `/api/candidatures` — candidature
- [ ] GET/POST `/api/threads` — conversazioni
- [ ] POST `/api/messages` — messaggi (realtime)
- [ ] GET/POST `/api/transfers` — trasferimenti
- [ ] GET/POST `/api/favorites` — preferiti
- [ ] GET/POST `/api/referenze` — referenze
- [ ] DELETE `/api/auth/logout` — logout

### Componenti
- [ ] Navbar/Sidebar con nav dinamica per sport
- [ ] Player Card (con stella preferiti)
- [ ] Club Card
- [ ] Ad Card
- [ ] Candidature row (con badge inbound/outbound)
- [ ] Message bubble
- [ ] Modal dettagli giocatore
- [ ] Search filters panel mobile
- [ ] Onboarding modal

## 🚀 Quick Start

### 1. Database
```bash
# Apri Supabase → SQL Editor → New Query
# Incolla supabase/schema.sql
# Clicca Run
```

### 2. Dev Server
```bash
npm run dev
# http://localhost:3000
```

### 3. Login
- Email: `calcio.levelup@gmail.com`
- Password: `Lega2026`

Oppure registrati con codice invito: `LEGA2026`

## 📁 File Structure

```
src/
├── app/
│   ├── auth/login/page.tsx           # Login form
│   ├── auth/register/page.tsx        # Register form
│   ├── dashboard/page.tsx            # Home dashboard
│   ├── api/                          # API routes
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Design tokens
├── components/
│   ├── ui/Button.tsx                 # Button base
│   └── ...                           # (da fare)
├── hooks/
│   └── useAuth.ts                    # Hook auth
├── lib/
│   ├── supabase/                     # Client/Server
│   ├── types.ts                      # TypeScript types
│   ├── constants.ts                  # SPORTS, REGIONI, etc
│   └── utils.ts                      # Helpers
└── middleware.ts                     # Auth middleware
```

## 🎨 Design System

CSS custom properties in `globals.css`:
- `--acid: #41c285` (accent verde)
- `--bg: #0b0d0a` (background scuro)
- `--card: #1c2118` (card)
- `--danger: #ff5a3c` (rosso)
- `--blue: #4cc2ff` (blu)

## 📞 Info

- Schema SQL da eseguire: `supabase/schema.sql`
- Credenziali Supabase in `.env.local` (già configurate)
- Design token uguali al progetto vecchio per continuità visiva
