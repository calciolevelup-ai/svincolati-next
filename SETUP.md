# SVINCOLATI Next.js Setup

## 1. Database Supabase

### Esegui lo schema SQL

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il progetto `sqheuyazspnkesvsnsbf`
3. **SQL Editor** → **New Query**
4. Copia il contenuto di `supabase/schema.sql`
5. Clicca **Run**
6. Attendi che completi (dovrebbe completare senza errori)

## 2. Variabili d'ambiente

Le credenziali Supabase sono già in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://sqheuyazspnkesvsnsbf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_9upbeCm_4tzEejpqOQgt7Q_QUhb5kbo
```

## 3. Esegui il dev server

```bash
npm run dev
```

La app è su `http://localhost:3000`

## 4. First Login

**Codice invito:** `LEGA2026`

Oppure registrati con: `calcio.levelup@gmail.com` (bypassa il codice)

## Struttura del Progetto

```
src/
├── app/
│   ├── auth/                  # Login, Register
│   ├── dashboard/             # Dashboard principale
│   │   ├── cerca/             # Pagina Cerca
│   │   ├── profilo/           # Profilo giocatore/club
│   │   ├── candidature/       # Candidature
│   │   ├── messaggi/          # Chat
│   │   ├── trasferimenti/     # Trasferimenti
│   │   └── admin/             # Pannello admin
│   ├── api/                   # API routes
│   │   ├── auth/me
│   │   ├── players/
│   │   ├── clubs/
│   │   ├── ads/
│   │   ├── candidatures/
│   │   ├── threads/
│   │   ├── messages/
│   │   ├── transfers/
│   │   ├── favorites/
│   │   └── ...
│   └── layout.tsx
├── components/
│   ├── ui/                    # Componenti base
│   ├── layout/                # Nav, Sidebar
│   ├── player/                # Componenti giocatori
│   ├── club/                  # Componenti club
│   └── auth/                  # Form auth
├── hooks/                     # React hooks (useAuth, useProfile, etc)
├── lib/
│   ├── supabase/              # Client/Server Supabase
│   ├── types.ts               # TypeScript types
│   ├── constants.ts           # SPORTS, REGIONI, etc
│   └── utils.ts               # Helper functions
└── middleware.ts              # Auth middleware
```

## Prossimi Step

- [ ] Completare tutte le pagine dashboard
- [ ] Implementare Search con filtri
- [ ] Candidature e messaggi (realtime con Supabase)
- [ ] Profilo giocatore editable
- [ ] Profilo club editable
- [ ] Favoriti (toggle stella)
- [ ] Statistiche e KPI
- [ ] Notifiche email
- [ ] Admin panel

## Development Notes

- **Autenticazione:** Supabase Auth (email/password)
- **Database:** PostgreSQL con RLS policies
- **Real-time:** Subscribe a tabelle Supabase
- **Styling:** Tailwind CSS + CSS custom properties (--acid, --bg, etc)
- **Type Safety:** Full TypeScript
