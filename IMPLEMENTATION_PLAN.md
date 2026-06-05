# SVINCOLATI — PIANO DI IMPLEMENTAZIONE

## STATUS ATTUALE
✅ Database schema (con trials, activity_log, search_preferences)
✅ TypeScript types
✅ Liquid glass CSS styling
✅ Navbar aggiornata
✅ 4 pagine create (cv-edit, c-ads, activity, public profile)
❌ **112 funzionalità mancanti**

---

## FASE 1: DATABASE & BACKEND (CRITICO)
**Priorità: ALTISSIMA — Senza questo, niente funziona**

### Da aggiungere a Supabase schema:
- [ ] Aggiungere `phone` e `lat`/`lng` a player_profiles (geolocalizzazione)
- [ ] Aggiungere `lat`/`lng` a club_profiles (per distance calculation)
- [ ] Aggiungere `notes` JSONB a favorites (note private club su giocatore)
- [ ] Aggiungere `verified` boolean a profiles e club_profiles
- [ ] Aggiungere `website` e `crest` a club_profiles se mancano
- [ ] Aggiungere `cercaCat`, `cercaReg`, `cercaNota` a player_profiles
- [ ] Aggiungere `referenze` table con FK a player_profiles
- [ ] Aggiungere trigger per auto-update `updated_at` su tutte le tabelle

### Da aggiungere a TypeScript types:
- [ ] Club location fields completi
- [ ] Player "looking for" preferences
- [ ] Referenze (testimonials)
- [ ] Profile view log

---

## FASE 2: PAGINE CRITICHE (30 pagine)
**Priorità: ALTA — Queste sono le pagine core dell'app**

### Player Pages:
- [ ] **p-cv** → Modifica CV con career history (FATTO ma incompleto)
  - [ ] Photo upload con crop
  - [ ] Import from archive button
  - [ ] Matching band (squadre suggerite)
  - [ ] Profile views section (ultimi 5)
  - [ ] Referenze section (testimoniali da club)

- [ ] **p-applications** → Candidature inviate
  - [ ] List candidatures with status filters
  - [ ] Status badges (inviata/vista/accettata/rifiutata)
  - [ ] Timeline view

- [ ] **p-teams** → Sfoglia annunci squadre
  - [ ] Browse ads con matching score
  - [ ] "Proponiti" button per create candidature
  - [ ] Favorite toggle (⭐)

- [ ] **p-trials** → Inviti a prova ricevuti
  - [ ] Pending trials with accept/decline buttons
  - [ ] Trial history

### Club Pages:
- [ ] **c-profile** → Modifica profilo società
  - [ ] All club fields (location, stadium, FIGC, website, logo)
  - [ ] Save functionality

- [ ] **c-players** → Directory giocatori
  - [ ] Browse all players
  - [ ] Star toggle per favorites
  - [ ] Contact button
  - [ ] View detail modal

- [ ] **c-staff** → Directory staff
  - [ ] Search by specialization
  - [ ] Contact functionality

- [ ] **c-ads** → Gestione annunci (FATTO ma incompleto)
  - [ ] Stats KPI (active ads, candidatures, views)
  - [ ] Expiry warnings (7 days)
  - [ ] Edit existing ads

- [ ] **c-candidatures** → Candidature ricevute
  - [ ] List inbound candidatures
  - [ ] Status management (vista/accettata/rifiutata)
  - [ ] Player detail modal on click

- [ ] **c-trials** → Manage trial proposals sent
  - [ ] Send new trial proposal modal
  - [ ] Track trial status

### Shared Pages:
- [ ] **transfers** — Transfer market feed (FATTO ma incompleto)
  - [ ] Tabs: Tutti / Confermati / Trattative / Svincolati
  - [ ] Multi-sport support
  - [ ] Timeline sorting

- [ ] **admin** — Admin panel (FATTO ma skeleton)
  - [ ] User management table (delete accounts)
  - [ ] Reports moderation
  - [ ] Invite codes management
  - [ ] Full KPI stats

- [ ] **search** → Advanced search with dynamic filters
  - [ ] Mode toggle: Players / Staff / Teams
  - [ ] Dynamic filter panel per mode
  - [ ] Distance calculation with geolocation
  - [ ] Result count badge

### Auth Pages:
- [ ] **login** — Email/password login (parziale, basic)
  - [ ] Password reset flow
  - [ ] Remember me option

- [ ] **register** — Multi-step registration (parziale)
  - [ ] Sport selection (5 icons)
  - [ ] Role selection with descriptions
  - [ ] Role-specific fields
  - [ ] Age validation (18+)
  - [ ] Invite code validation

- [ ] **privacy** — Privacy Policy page
- [ ] **contacts** — Contact form
- [ ] **404** — Error page

---

## FASE 3: FEATURES COMPLESSE (15 feature groups)
**Priorità: MEDIA — Le funzionalità che rendono l'app utile**

### Matching Algorithm
- [ ] `matchScore(player, ad)` function
- [ ] Top 8 ads for player on CV page
- [ ] Top 6 players for ad on club side
- [ ] Display in card band "Squadre che potrebbero interessarti"

### Candidatures Flow
- [ ] Create candidature on player side
- [ ] Email notification to club (EmailJS)
- [ ] Auto-create thread on candidature
- [ ] Status management by club (vista/accettata/rifiutata)
- [ ] Display on p-applications (player) & c-candidatures (club)

### Favorites System
- [ ] Star toggle on player cards
- [ ] Persist to DB (`favorites` table or Supabase `favorites` table)
- [ ] Show favorited state (filled/hollow star)
- [ ] Add to favorites list (separate view?)

### Public Profiles & Views
- [ ] Public profile view (`?p=<playerId>`)
- [ ] Log view in `player_views` table
- [ ] Increment `Player.views` counter
- [ ] Display last 5 views on player CV page (chi ha visto il tuo profilo)

### Activity Tracking
- [ ] Log candidatures sent/received
- [ ] Log messages
- [ ] Log trial invites
- [ ] Display activity feed with icons + relative time
- [ ] Filter by sport

### Career History
- [ ] Import from archive JSON
- [ ] Edit storico (add/delete/update seasons)
- [ ] Auto-calculate stats (total presenze, total reti, max season)
- [ ] Display in CV and public profile

### Trials/Invites
- [ ] Club propose trial modal (date, time, message)
- [ ] Email notification to player
- [ ] Player accept/decline buttons
- [ ] Status management (pending/accepted/declined/completed)
- [ ] Display on p-trials and c-trials

### Messaging (Real-time Supabase subscriptions)
- [ ] Thread list pane (left sidebar)
- [ ] Thread detail pane (right, message bubbles)
- [ ] Send message functionality
- [ ] Auto-scroll to latest
- [ ] Unread count badge in nav
- [ ] Email notification on new message
- [ ] Mobile responsive (collapse list pane)

### Transfers Market
- [ ] Display transfer feed with cards
- [ ] Tab filter: Tutti / Confermati / Trattative / Svincolati
- [ ] Player avatar + role abbreviation
- [ ] From → To club arrows
- [ ] Status badge styling (green/blue/red)
- [ ] Add transfer button (club role only)

### Search & Filtering
- [ ] Dynamic filter panel (mobile: collapsible, desktop: always visible)
- [ ] Mode toggle buttons (Players/Staff/Teams)
- [ ] Filter options per mode:
  - Players: name, ruolo, piede, agemin/max, heightmin/max, cat, reg, prov
  - Staff: name, staffType, cat, reg
  - Teams: name, ruolo, cat, reg, prov, distance
- [ ] Distance calculation using Haversine formula
- [ ] Geolocation browser API for custom reference point
- [ ] 5 preset cities (Verona, etc.)
- [ ] Clear filters button
- [ ] Result count display
- [ ] Filter-as-you-type (desktop)

### Player Stats & Display
- [ ] Calculate age from DOB (auto-sync)
- [ ] Career stats calculation: presenze, reti, max season, seasons count
- [ ] Display on public profile
- [ ] Display on CV

### Referenze (Testimonials)
- [ ] Club can write reference for player
- [ ] Display on player public profile
- [ ] Stored per player-club pair

### Reports & Flagging
- [ ] Report modal (reason + submit)
- [ ] Admin view reports
- [ ] Flag/unflag player

---

## FASE 4: UI/UX & POLISH (10 items)
**Priorità: MEDIA-BASSA — Miglioramento esperienza**

- [ ] Photo upload with crop tool
- [ ] Modal dialogs for: player detail, trial proposal, import career, report, delete account, copy link
- [ ] Toast notifications (error, success)
- [ ] Loading spinners on async operations
- [ ] Dark/light theme toggle
- [ ] Responsive design (mobile first)
- [ ] Sport-specific color themes (viola/arancione/cyan per sport)
- [ ] Animations (fade-in, slide, hover effects)
- [ ] Keyboard shortcuts (Enter to send message, etc.)
- [ ] Accessibility (ARIA labels, focus management)

---

## FASE 5: INTEGRATIONS (3 items)
**Priorità: MEDIA — Per funzionare completamente**

- [ ] EmailJS notifications (candidatures, trials, messages)
- [ ] Supabase real-time subscriptions (for messaging)
- [ ] Browser geolocation API (for distance search)
- [ ] PWA service worker (offline support, caching)

---

## FASE 6: ADMIN & MONITORING (5 items)
**Priorità: BASSA — Per gestione della piattaforma**

- [ ] User management (delete accounts, verify users)
- [ ] Reports moderation
- [ ] Invite codes management
- [ ] Admin KPI dashboard
- [ ] Audit logs

---

## ESTIMATED EFFORT

| Fase | Items | Effort | 
|------|-------|--------|
| 1 | Database | 2-3 ore |
| 2 | 30 pagine | 40-50 ore |
| 3 | 15 features | 30-40 ore |
| 4 | UI/Polish | 15-20 ore |
| 5 | Integrations | 10 ore |
| 6 | Admin | 5-10 ore |
| **TOTALE** | **112 items** | **~112-143 ore** |

---

## NEXT IMMEDIATE STEPS (Priority 1)

1. **Database**: Aggiungi campi mancanti + lat/lng
2. **Search**: Crea pagina `/dashboard/search` con filtri dinamici
3. **Matching**: Implement matchScore function, display on player CV
4. **Trials**: Crea flow completo (propose, accept/decline)
5. **Club Pages**: c-profile, c-players, c-staff, c-candidatures

---

## NOTE IMPORTANTI

- **Real-time messaging**: Richiede Supabase subscriptions (da setup)
- **Photo upload**: Serve implementare crop tool (es: react-image-crop)
- **Archive import**: Serve il file `archive.json` del vecchio sito
- **Distance calculation**: Già calcolabile con Haversine formula
- **Email notifications**: EmailJS è ready, serve solo aggiungere template IDs
