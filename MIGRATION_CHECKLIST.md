# SVINCOLATI MIGRATION CHECKLIST - COMPLETE SYSTEM SPECIFICATION

**Application**: SVINCOLATI — Il mercato del calcio dilettantistico (Amateur Football Marketplace)  
**Current Stack**: Single-file Vue/HTML + Supabase + EmailJS  
**Target**: Full-stack rebuild (Node.js backend + React/TypeScript frontend)

---

## 1. PAGES/VIEWS

### Authentication & Public Pages
- ❌ **Login Form** — Email/Password with forgot password flow
- ❌ **Registration Form** — Multi-step: Sport selection → Role (Player/Staff/Club) → Sport-specific data → Privacy consent
- ❌ **Password Reset** — Email verification + new password form
- ❌ **Public Player Profile** (`?p=<playerId>`) — Read-only, shows: name, photo, role, stats, career history, bio, videos
- ❌ **Privacy Policy** — Full GDPR-compliant policy with sections for data collection, processing, rights, etc.
- ❌ **Contacts Page** — Contact form, team job listings (5 positions), sponsor opportunities
- ❌ **404 / Error Pages** — Standard error handling

### Player Views
- ❌ **CV/Profile** (`p-cv`) — Edit form with all player data + career history table + photo upload with crop + import archive data
- ❌ **My Applications** (`p-applications`) — Candidatures sent to clubs with status badges (sent, viewed, accepted, rejected)
- ❌ **Teams/Ads** (`p-teams`) — Browse all team search ads, match scoring, proposed teams
- ❌ **Messages** (`p-messages`) — Conversation list + thread view with message bubbles (real-time, from club)
- ❌ **Trials** (`p-trials`) — Received trial proposals from clubs with accept/decline actions
- ❌ **Activity Feed** (`activity`) — Recent players, ads, transfers (multi-sport)

### Staff Views
- ❌ **Staff CV** (special player variant) — Specialization, category, experience years + photo/video
- ❌ **Staff Search** (shared with club) — Search staff by type, category, region
- ❌ **Same messaging/trials as Player**

### Club Views
- ❌ **Club Profile** (`c-profile`) — Club name, location, province, stadium info, FIGC code, website, logo/crest
- ❌ **Players Directory** (`c-players`) — Browse all players with favorites (star toggle) + contact action
- ❌ **Staff Directory** (`c-staff`) — Browse staff, filter by specialization
- ❌ **Search** (`search`) — Unified search: Players/Staff/Teams mode toggle with dynamic filters
- ❌ **Ads Management** (`c-ads`) — Create/edit/view search ads with expiry dates, KPI stats, notes on favorites
- ❌ **Candidatures** (`c-candidatures`) — Incoming candidatures to club's ads with status tracking
- ❌ **Messages** (`c-messages`) — Conversation list + thread view with message bubbles (real-time, from player)
- ❌ **Trials Sent** (`c-trials`) — Trial proposals sent to players with status
- ❌ **Activity Feed** (`activity`) — Recent players, ads, transfers (filtered by sport)

### Shared Views
- ❌ **Transfers** (`transfers`) — Market transfers feed: Confirmed/Negotiations/Free agents, sortable by status
- ❌ **Activity Feed** — Timeline of platform activity (players, ads, transfers)
- ❌ **Admin Panel** (`admin`) — User table, reports, invite codes, DB stats (admin-only)

### Modals
- ❌ **Player Detail Modal** — Full profile in modal with contact + report buttons (clubs only)
- ❌ **Trial Proposal Modal** — Date + time + message fields
- ❌ **Contact Player Modal** — Start messaging with player (from search/ad)
- ❌ **Import Career Modal** — Select archive profiles, verify, import storico data
- ❌ **Report Player Modal** — Reason + submit
- ❌ **Delete Account Modal** — Confirmation
- ❌ **Copy CV Link Modal** — Share public profile URL

---

## 2. DATA ENTITIES & FIELDS

### User Entity
**Fields**:
- `id`: UUID (auto-generated via Supabase Auth)
- `email`: string, unique, required
- `password`: string, hashed (Supabase handles)
- `role`: enum ('player' | 'staff' | 'club'), required
- `sport`: enum ('calcio' | 'calcio5' | 'pallavolo' | 'rugby' | 'basket'), default 'calcio'
- `clubName`: string (club only)
- `crest`: string (club logo emoji/text, club only)
- `paese`: string (club location)
- `loc`: string (club city)
- `provincia`: string (club province)
- `regione`: string (club region)
- `impianto`: string (stadium name, club only)
- `impInd`: string (stadium address, club only)
- `impLat`: number (stadium latitude, club only)
- `impLng`: number (stadium longitude, club only)
- `website`: string (club URL)
- `figcCode`: string (FIGC affiliation code, club)
- `verified`: boolean (verified via FIGC code)
- `tessera`: string (player federation card number, optional)
- `inviteCode`: string (unique, generated on registration)
- `onboarded`: boolean (seen onboarding tutorial)
- `favorites`: string[] (array of player IDs, club only)
- `notes`: {[playerId]: string} (private notes on players, club only)
- `consenso`: object
  - `dob`: date (required at registration)
  - `privacyTs`: timestamp (required)
  - `privacyOk`: boolean
  - `marketingOk`: boolean (optional)
  - `invitedBy`: string (referral code, optional)
- `ts`: timestamp (created at)

### Player Entity
**Fields**:
- `id`: UUID (unique player profile)
- `ownerUserId`: UUID (FK to User)
- `nome`: string, required
- `photo`: string (image URL/base64)
- `eta`: number (age, calculated from DOB or set manually)
- `ruolo`: string (role/position, required)
- `piede`: enum ('Destro', 'Sinistro', 'Ambidestro', null), players only
- `sport`: enum ('calcio' | 'calcio5' | 'pallavolo' | 'rugby' | 'basket'), required
- `cat`: string (current category, required)
- `regione`: string (region, required)
- `provincia`: string (province)
- `altezza`: number (height in cm)
- `disponibile`: boolean (available for new team), default true
- `disponibileDa`: string (available from, e.g., "Subito", "Luglio 2025")
- `squadra`: string (last/current team)
- `bio`: string (presentation/description)
- `video`: string (YouTube/Vimeo URL for highlights)
- `contatto`: string (private contact, not public)
- `storico`: array of objects
  - `stagione`: string (season, e.g., "2024/2025")
  - `squadra`: string (team name)
  - `categoria`: string (category played in)
  - `presenze`: number (appearances)
  - `reti`: number (goals/points)
- `cercaCat`: string (minimum desired category)
- `cercaReg`: string (preferred region)
- `cercaNota`: string (what player is looking for)
- `views`: number (profile view count by clubs)
- `viewLog`: array of {clubId, clubName, ts} (last 20 views)
- `referenze`: array of objects
  - `clubId`: UUID (FK to club)
  - `clubName`: string
  - `text`: string (reference text)
  - `ts`: timestamp
- **Staff-specific fields**:
  - `staffType`: enum (Allenatore, Vice allenatore, Preparatore atletico, etc.)
  - `staffCat`: enum (U9-U18, Juniores, Prima squadra, Tutte le categorie)
  - `esperienzaAnni`: number (years of experience)
- `ts`: timestamp (last updated)
- `verified`: boolean (verified player)

### Ad (Team Search) Entity
**Fields**:
- `id`: UUID
- `clubId`: UUID (FK to User/Club)
- `sport`: enum (calcio, etc.), required
- `ruolo`: string (role sought)
- `cat`: string (category)
- `regione`: string (region)
- `provincia`: string (province)
- `descrizione`: string (job description)
- `ts`: timestamp (created)
- `expiresAt`: timestamp (defaults to 30 days from ts)
- `views`: number (view count)
- `verified`: boolean (club is verified)

### Candidature (Application) Entity
**Fields**:
- `id`: UUID
- `adId`: UUID (FK to Ad)
- `playerId`: UUID (FK to Player)
- `playerUserId`: UUID (FK to User/Player owner)
- `clubId`: UUID (FK to User/Club)
- `status`: enum ('inviata' | 'vista' | 'accettata' | 'rifiutata'), default 'inviata'
- `ts`: timestamp
- `sport`: string (snapshot at time of candidature)

### Trial (Provino) Entity
**Fields**:
- `id`: UUID
- `clubId`: UUID (FK to Club)
- `playerId`: UUID (FK to Player)
- `playerUserId`: UUID (FK to Player owner)
- `date`: string (ISO date, YYYY-MM-DD)
- `time`: string (HH:MM, optional)
- `message`: string (trial details/location)
- `status`: enum ('pending' | 'accepted' | 'declined' | 'completed'), default 'pending'
- `ts`: timestamp
- `sport`: string

### Transfer Entity
**Fields**:
- `id`: UUID
- `nome`: string (player name)
- `ruolo`: string (position)
- `da`: string (from club name)
- `a`: string (to club name)
- `tipo`: enum ('Confermato' | 'Trattativa' | 'Svincolato')
- `cat`: string (category)
- `regione`: string (region)
- `ts`: timestamp

### Thread (Messaging) Entity
**Fields**:
- `id`: UUID
- `playerUserId`: UUID (FK to Player owner)
- `clubUserId`: UUID (FK to Club)
- `messages`: array of objects
  - `id`: UUID
  - `from`: enum ('player' | 'club')
  - `text`: string
  - `ts`: timestamp
- `ts`: timestamp (updated on each message)

### Report Entity
**Fields**:
- `id`: UUID
- `playerId`: UUID (reported player)
- `clubId`: UUID (who reported)
- `reason`: string
- `ts`: timestamp

### AppState (Supabase row)
**Fields**:
- `id`: integer (always 1)
- `data`: JSONB containing entire DB object
  - `users`: User[]
  - `players`: Player[]
  - `ads`: Ad[]
  - `candidatures`: Candidature[]
  - `threads`: Thread[]
  - `trials`: Trial[]
  - `transfers`: Transfer[]
  - `reports`: Report[]

---

## 3. FORMS

### Registration Form (Multi-step)
1. **Sport Selection**
   - 5 buttons: Calcio, Calcio5, Pallavolo, Rugby, Basket
   
2. **Role Selection** (3 options)
   - Player (Giocatore) — "Cerco squadra"
   - Staff (Staff) — "Allenatore / Staff"
   - Club (Società) — "Cerco giocatori"

3. **Role-specific Fields**
   - **Player**:
     - `r-name`: Name (required)
     - `r-tessera`: FIGC card number (optional)
   - **Staff**:
     - `r-name`: Name (required)
     - `r-staff-type`: Specialization select (required)
     - `r-staff-cat`: Category (optional)
     - `r-esperienza`: Years of experience (optional)
     - `r-reg`: Region (optional)
     - `r-tessera`: Coaching certifications (optional)
   - **Club**:
     - `r-name`: Club name (required)
     - `r-loc`: City (optional)
     - `r-reg`: Region (required)
     - `r-prov`: Province (required)
     - `r-paese`: Neighborhood (optional)
     - `r-impianto`: Stadium name (optional)
     - `r-figc`: FIGC code (optional)
     - `r-impind`: Stadium address (optional)
     - `r-url`: Website URL (optional)

4. **Common Fields** (all roles)
   - `r-invite`: Invite code (required)
   - `r-dob`: Date of birth (required, age 18+ validation)
   - `r-email`: Email (required, unique)
   - `r-pass`: Password (required)
   - `r-privacy`: Privacy consent checkbox (required)
   - `r-marketing`: Marketing consent checkbox (optional)

### Player CV Form
- `f-nome`: Name (required)
- `f-eta`: Age (required)
- `f-ruolo`: Role (required)
- `f-piede`: Preferred foot (optional, calc only)
- `f-cat`: Current category (required)
- `f-reg`: Region (required)
- `f-prov`: Province (optional)
- `f-disp`: Availability status (enum)
- `f-dispda`: Available from (optional)
- `f-squadra`: Last team (optional)
- `f-altezza`: Height in cm (optional)
- `f-bio`: Bio/description (required)
- `f-video`: Video URL (optional)
- `f-contatto`: Private contact (optional)
- `f-photo`: Photo upload with crop tool
- **Storico (repeating)**:
  - `st-stagione`: Season
  - `st-squadra`: Team
  - `st-categoria`: Category
  - `st-presenze`: Appearances
  - `st-reti`: Goals/Points
- **What I'm Looking For**:
  - `f-cerca-cat`: Minimum category
  - `f-cerca-reg`: Preferred region
  - `f-cerca-nota`: Free notes

### Staff CV Form (variant)
- `f-nome`: Name (required)
- `f-eta`: Age (required)
- `f-ruolo`: Specialization (required)
- `f-staff-cat`: Category (optional)
- `f-esperienza`: Years (optional)
- `f-reg`: Region (required)
- `f-bio`: Bio (required)
- `f-video`: Video URL (optional)
- `f-contatto`: Private contact (optional)
- `f-photo`: Photo upload
- Plus "Looking For" section

### Club Profile Form
- `f-clubName`: Club name (required)
- `f-loc`: City (required)
- `f-reg`: Region (required)
- `f-prov`: Province (required)
- `f-paese`: Neighborhood (optional)
- `f-impianto`: Stadium name (optional)
- `f-impInd`: Stadium address (optional)
- `f-figc`: FIGC code (optional)
- `f-website`: Website URL (optional)
- `f-crest`: Logo emoji/text (optional)

### Ad (Search) Form
- `ad-ruolo`: Role sought (required)
- `ad-cat`: Category (required)
- `ad-regione`: Region (required)
- `ad-provincia`: Province (optional)
- `ad-descrizione`: Job description/requirements (textarea)

### Trial Proposal Form
- `trial-date`: Date (required, must be future date)
- `trial-time`: Time (optional, default 10:00)
- `trial-msg`: Message/details (textarea, optional)

### Search/Filter Form
**Player Search**:
- `s-name`: Name search
- `s-ruolo`: Role select
- `s-piede`: Foot select (calc only)
- `s-agemin`: Age min select
- `s-agemax`: Age max select
- `s-hmin`: Height min select
- `s-hmax`: Height max select
- `s-cat`: Category select
- `s-reg`: Region select
- `s-prov`: Province select

**Team Search** (additional):
- `s-ref`: Reference point select (geolocation)
- `s-km`: Max distance input

**Staff Search** (variant):
- `s-ruolo`: Staff type (different options)
- `s-cat`: Category select (staff categories)

### Contact Form
- `ct-nome`: Name (required)
- `ct-email`: Email (required)
- `ct-motivo`: Reason select
- `ct-msg`: Message (required)

### Password Reset Form
- `rst-email`: Email input (required)

### New Password Form
- `newpass`: New password (required)
- `newpass-confirm`: Confirm password (required)

---

## 4. FEATURES/FUNCTIONS

### Search & Filtering

#### Search Modes
- ✅ **Players Search**: Name, role, age range, height range, foot (calc), category, region, province
- ✅ **Staff Search**: Name, staff type, category, region
- ✅ **Teams/Ads Search**: Club name, role, category, region, province, distance (with geolocation)

#### Filtering
- ✅ **Dynamic filter panels** (mobile: toggle collapse/expand, desktop: always visible)
- ✅ **Apply filters button** (mobile only)
- ✅ **Clear filters button**
- ✅ **Filter count badge** (shows # of active filters)
- ✅ **Result count** (e.g., "15 giocatori trovati")
- ✅ **Distance calculation** using Haversine formula (great circle distance)
- ✅ **Reference points**: 5 cities (Verona, Verona neighborhoods, Vicenza)
- ✅ **Geolocation**: Browser GPS to set custom reference point

#### Search Flow
1. User selects search mode (toggle buttons)
2. Enters name search
3. Opens filter panel (mobile) or uses visible filters (desktop)
4. Selects filters from dropdowns
5. On mobile: clicks "Filtra" to apply
6. Results update (filter-as-you-type on desktop)
7. Can click "Azzera" to reset all

### Matching Algorithm

#### Match Score Calculation
```javascript
function matchScore(p, ad) {
  let s = 0;
  if (p.ruolo && p.ruolo === ad.ruolo) s += 4;
  const ci = cfg.categorie.indexOf(p.cat), ai = cfg.categorie.indexOf(ad.cat);
  if (ci >= 0 && ai >= 0) {
    const d = Math.abs(ci - ai);
    if (d === 0) s += 3;
    else if (d === 1) s += 1;
  }
  if (p.regione && p.regione === ad.regione) s += 2;
  if (p.provincia && p.provincia === ad.provincia) s += 1;
  return s;
}
```
- Match score >= 3 qualifies
- Top 8 ads shown for player (sorted desc)
- Top 6 players shown for ad (sorted desc)

#### Matching Display
- ✅ **"Squadre che potrebbero interessarti"** card band on player CV (up to 8)
- ✅ Shows: club name, role sought, category, region
- ✅ "Proponiti" button to create candidature

### Candidatures Flow

#### Player → Club (Outbound)
1. Player finds ad or matches band
2. Clicks "Proponiti" or "Contatta"
3. Candidature created with status='inviata'
4. Email notified to club (EmailJS template)
5. Thread auto-created between player & club
6. Club sees in **c-candidatures** list

#### Club Response States
- ✅ `inviata` — Sent, awaiting club action
- ✅ `vista` — Club has viewed player profile
- ✅ `accettata` — Club accepted (moves to interviews/trialing)
- ✅ `rifiutata` — Club rejected
- ✅ Status shown with color badges (blue, green, red)

#### Display
- **Player side** (`p-applications`): Shows candidatures sent, grouped/sorted by status & date
- **Club side** (`c-candidatures`): Shows inbound candidatures to club's ads
- Both show: player/ad name, status badge, date, action buttons

### Favorites Management

#### Star System (Club only)
- ✅ **Player Card**: Star icon (★) toggles favorite
- ✅ **Stored in**: `User.favorites` array (player IDs)
- ✅ **Visual**: Star filled gold when favorited, with glow effect
- ✅ **Persistency**: Saved to DB on toggle
- ✅ **Usage**: Clubs can quickly find previously starred players

### Public Profiles

#### What's Visible (No Login)
Public link: `?p=<playerId>`
Shows:
- Photo, name, region/province
- Role, category, availability badge
- Stats: Presenze, Reti/Subite, Max stagione, Age
- Bio/presentation
- Career history table
- Video embed (if present)
- CTA: "Register to contact this player"

#### What's Hidden
- Email, phone, private contact
- Private notes from clubs
- Full referenze (only count shown)

### Profile Views Tracking

#### Implementation
- ✅ When club opens player detail modal, increment `Player.views` counter
- ✅ Log view in `Player.viewLog` array: {clubId, clubName, ts}
- ✅ Keep last 20 views
- ✅ Save to DB

#### Display
- ✅ **Player CV page**: Shows "👁 120 visite" chip in top-right
- ✅ **CV page panel**: "Chi ha visto il tuo profilo" section shows last 5 views
- ✅ Format: Club initials + club name + relative time (e.g., "1 giorno fa")

### Activity Tracking & Feed

#### Events Logged
- New available player (disponibile=true, ts < 30 days)
- New ad posted (ts recent)
- New transfer

#### Activity Feed View
1. Filters by user's sport
2. Last 30 events, sorted by timestamp descending
3. Types:
   - **Player**: Icon ⚽, title "[Name] disponibile", sub "[role] · [cat] · [region]"
   - **Ad**: Icon 🛡️, title "[Club] cerca [role]", sub "[cat] · [region]"
   - **Transfer**: Icon 📋, title "[Name] — [type]", sub "[role] · [cat] · [region]"
4. Clickable: Player cards link to profile detail modal
5. Timestamp: Relative time (e.g., "oggi", "1 giorno fa")

### Career History

#### Import from Archive
- ✅ Archive JSON file available (`archive.json`)
- ✅ Contains mock historical player data
- ✅ Player clicks "Importa la mia carriera" button
- ✅ Modal shows available profiles matching player name
- ✅ Player selects profile
- ✅ Storico array pre-populated
- ✅ Player must confirm each entry before saving

#### Edit Storico
- ✅ **Storico Editor**: Grid layout (on desktop) or stacked (mobile)
- ✅ Repeating rows: Season, Team, Category, Presenze, Reti
- ✅ Delete button per row (✕)
- ✅ "Aggiungi stagione" button to add blank row
- ✅ Validations: Season format check, numeric fields
- ✅ Totals calculated automatically: `careerStats(p)` → {seasons, pres, reti, max}

#### Display
- ✅ **Public profile & CV**: Career history table (subset if many)
- ✅ Format: Season | Team | Category | Presenze | Reti/Subite
- ✅ Show "Max stagione" stat
- ✅ "Storico carriera" section header

### Trials/Invites Flow

#### Club → Player (Trial Proposal)
1. Club finds player (search/ad/message)
2. Clicks "Proponi provino" or similar
3. Modal opens: Date (required, future) + Time (optional) + Message (optional)
4. Club confirms
5. Trial created: status='pending'
6. Email sent to player (EmailJS template) with date, time, message
7. Player sees in **p-trials** list

#### Player Response
- ✅ Buttons: "✓ Accetta" / "✗ Rifiuta"
- ✅ Updates trial status: accepted/declined
- ✅ Club sees updated status in **c-trials** list
- ✅ Trial card shows: club info, date/time, status badge, message

#### Trial Statuses
- ✅ `pending` — Awaiting player response (show accept/decline buttons)
- ✅ `accepted` — Player accepted (display status, no buttons)
- ✅ `declined` — Player declined (display status, no buttons)
- ✅ `completed` — Trial happened (display status, no buttons)

### Messaging (Real-time)

#### Thread Model
- ✅ One thread per player-club pair
- ✅ Auto-created on first contact (candidature, trial proposal, manual contact)
- ✅ Contains chronological messages array

#### Message Model
- `id`: UUID
- `from`: 'player' | 'club'
- `text`: string (message body)
- `ts`: timestamp

#### UI (Message View)
- ✅ **List Pane** (left, 300px wide on desktop):
  - Conversation list (compact rows)
  - Shows: avatar, name, last message preview, unread indicator
  - Sorted by last message timestamp descending
  - Clickable to open thread
  - Highlighted when selected (accent color, left border)
  - Mobile: Hidden by default, shown when selecting a conversation
  
- ✅ **Thread Pane** (right, flex 1fr):
  - Header: Back button (mobile only), name, last message time
  - Bubbles area: Scrollable, messages with timestamps
  - Message styling:
    - Own messages: Right-aligned, acid green bg, dark text
    - Other's messages: Left-aligned, card-2 bg, light border
    - Timestamp: Small, muted, below message
  - Composer: Input field + send button
  - Placeholder: "Pick a thread to start messaging"
  
- ✅ **Mobile Layout** (< 760px):
  - Grid collapses to single column
  - List pane hidden by default
  - Thread pane full width when selected
  - Back button visible in thread header

#### Send Message
1. User types in composer input
2. Clicks send button or presses Enter
3. Message object created, pushed to thread.messages
4. Thread timestamp updated
5. DB saved
6. Input cleared
7. Scroll to bottom of bubbles
8. If receiver's email available: email notification (EmailJS template)

#### Unread Count
- ✅ Count threads where last message is from other party
- ✅ Badge shown in nav: "Messaggi (3)"
- ✅ Calculation: `myThreads().filter(t => last msg from other party).length`

### Transfers Market

#### Data Model
- `nome`: Player name
- `ruolo`: Position
- `da`: From club
- `a`: To club (or "Svincolato" if free agent)
- `tipo`: 'Confermato' | 'Trattativa' | 'Svincolato'
- `cat`: Category
- `regione`: Region
- `ts`: Timestamp

#### Transfer Feed
- ✅ Sortable by tabs: "Tutti" | "Confermati" | "Trattative" | "Svincolati"
- ✅ Each transfer shows:
  - Player avatar (with photo if available)
  - Player name + role (abbr + full)
  - From club → arrow → To club
  - Status badge (Confermato: green, Trattativa: blue, Svincolato: red)
  - Category · Region · Relative time
- ✅ Visual: Responsive layout, arrow in center on desktop
- ✅ Free agent transfers show "FA" logo + "Svincolato"

#### Multi-sport Support
- ✅ Transfers filtered by user's sport
- ✅ Display works for all sports (calcio, calcio5, pallavolo, rugby, basket)

### Stats & KPIs

#### Player Stats (Profile)
- Presenze (total appearances)
- Reti (goals) or Reti Subite (if GK)
- Max stagione (highest in single season)
- Age (if set)

#### Club Stats (Dashboard)
- Annunci attivi (active ads count)
- Candidature (total applications received)
- Accettate (accepted candidatures)
- Visualiz. annunci (total ad views)
- Annunci in scadenza (ads expiring in 7 days) — highlighted in red

#### Admin Stats
- Users totali
- Giocatori, Società, Staff breakdown
- Annunci attivi
- Messaggi total
- New users (last 7 days)
- Reports (if any)

### Reports

#### Player Reporting (Club)
1. Club opens player detail modal
2. Clicks ⚠ button
3. Modal opens for reason entry
4. Submits report
5. Report logged: playerId, clubId, reason, ts
6. Admin sees in Admin Panel

#### Report Display (Admin)
- Table: Player name | Reported by (club) | Reason | Date | "Vedi" button
- Reports sorted by date descending

### References

#### Club Leaves Reference
1. Club opens player detail modal
2. Finds "Lascia una referenza" section (private notes area)
3. Enters referee text
4. Clicks "Pubblica referenza"
5. Referenza added to Player.referenze array

#### Referenza Structure
- `clubId`: Club leaving it
- `clubName`: Club name
- `text`: Reference text
- `ts`: Timestamp

#### Display (Player Profile)
- ✅ Section: "Referenze (3)" showing up to 5
- ✅ Card format: Club avatar + "[Initials] Club name [verified badge]" + quote + date

---

## 5. ADMIN FEATURES

### Admin Panel (`/admin`)
Access: Email-based check (ADMIN_EMAILS = ['calcio.levelup@gmail.com'])

#### Sections

**1. KPI Grid**
- Users totali
- Giocatori (by role)
- Società
- Staff
- Annunci attivi
- Messaggi total
- New users (last 7 days) — green
- Reports (if any) — red

**2. Users Table**
- Columns: Nome/Società | Ruolo | Sport | Email | Data nascita | Registrato | Annunci | Actions
- Sport: Dropdown to change user's sport
- Verified badge displayed
- Delete button per user
- Sorted by registration date descending

**3. Reports Section** (if reports exist)
- Columns: Giocatore | Segnalato da | Motivo | Data | Vedi button
- Red header: "⚠️ Segnalazioni"
- Sorted by date descending
- "Vedi" links to player detail modal

**4. Invite Codes Section**
- Input to add new code
- Table: Codice | Proprietario | Utilizzi
- Can add codes manually
- Shows usage per code

**5. DB Statistics**
- Candidature count
- Transfers count
- Profili completi (player with ruolo)
- Con foto (players with photo)
- Con video (players with video)
- Annunci in scadenza (expiring in 7 days)

#### Admin Actions
- ✅ Delete user
- ✅ Set sport for user
- ✅ Add invite code
- ✅ View player from report

---

## 6. VALIDATIONS

### Age & Birth Date
- ✅ Minimum age: 18 years old (enforced at registration)
- ✅ DOB input: `max` attribute set to 18 years ago
- ✅ DOB input: `type="date"`
- ✅ No future dates allowed

### Required Fields by Role
- **Player**: nome, eta, ruolo, cat, regione, bio, email, password, privacy consent
- **Staff**: nome, eta, ruolo (specialization), email, password, privacy consent
- **Club**: clubName, reg, prov, email, password, privacy consent

### Email
- ✅ Unique per system (Supabase enforces)
- ✅ Format: Basic validation (HTML5 input type="email")
- ✅ Required at registration

### Password
- ✅ Minimum length: Not explicitly specified in code, assume 6+ chars
- ✅ Both fields stored via Supabase Auth

### Invite Code
- ✅ Required at registration
- ✅ Must match one of: INVITI array or DB.users[].inviteCode
- ✅ Case-insensitive comparison

### Privacy Consent
- ✅ Checkbox: "Privacy Policy accettata" — must be checked
- ✅ Stored in User.consenso.privacyOk
- ✅ Timestamp: User.consenso.privacyTs

### Marketing Consent
- ✅ Optional checkbox
- ✅ Stored in User.consenso.marketingOk

### Photo Upload
- ✅ Accepted formats: image/* (jpg, png)
- ✅ Auto-resized
- ✅ Cropper tool: 3:4 aspect ratio (portrait)
- ✅ Max dimensions: Enforced by cropper

### Career History (Storico)
- ✅ Season format: YYYY/YYYY format (e.g., "2024/2025")
- ✅ Presenze: Number >= 0
- ✅ Reti: Number >= 0
- ✅ All fields optional (repeating section)

### Ad Expiry
- ✅ Default life: 30 days from creation
- ✅ Expiring warnings: Show if <= 7 days left
- ✅ Warning display: "Scade tra 2 giorni" or "Scaduto oggi"

### Search Filters
- ✅ Age range: 15-45 years
- ✅ Height range: 145-215 cm
- ✅ Distance: Positive integer, in kilometers

---

## 7. CALCULATIONS

### Age Calculation
```javascript
function calcAge(dob) {
  if (!dob) return null;
  const a = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000));
  return (a > 0 && a < 100) ? a : null;
}
```
- Based on DOB
- Calculated at registration
- Can be manually overridden
- Auto-synced from consenso.dob if needed

### Career Statistics
```javascript
function careerStats(p) {
  const s = p.storico || [];
  if (!s.length) return { seasons: 0, pres: p.presenze ?? null, reti: p.gol ?? null, max: p.gol ?? null };
  const pres = s.reduce((a, r) => a + (+r.presenze || 0), 0);
  const reti = s.reduce((a, r) => a + (+r.reti || 0), 0);
  const max = s.reduce((a, r) => Math.max(a, +r.reti || 0), 0);
  return { seasons: s.length, pres, reti, max };
}
```
- Seasons: Count of storico entries
- Presenze: Sum of all presenze
- Reti: Sum of all reti
- Max: Highest reti in single season

### Distance (Haversine Formula)
```javascript
function distanceKm(a, b) {
  if (a == null || b == null || a.lat == null || b.lat == null) return null;
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat/2)**2 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}
```
- Great-circle distance between two GPS points
- Returns: Rounded km
- Used for team search with geolocation

### Ad Expiry Days
```javascript
function adDaysLeft(ad) {
  return Math.max(0, Math.ceil(((ad.expiresAt || (ad.ts + AD_LIFE_MS)) - Date.now()) / 86400000));
}
```
- Remaining days for ad
- AD_LIFE_MS = 30 days in milliseconds
- 0 = expired today

### Match Score
- Exact role: +4 points
- Category match: +3 (same), +1 (adjacent)
- Region match: +2
- Province match: +1
- Minimum threshold: >= 3 to qualify

### Relative Time
```javascript
function relTime(ts) {
  const d = Math.floor((Date.now() - ts) / 86400000);
  return d <= 0 ? 'oggi' : d === 1 ? '1 giorno fa' : d + ' giorni fa';
}
```
- Format examples: "oggi", "1 giorno fa", "5 giorni fa"

---

## 8. INTEGRATIONS

### Supabase
- ✅ **URL**: https://sqheuyazspnkesvsnsbf.supabase.co
- ✅ **Key**: sb_publishable_9upbeCm_4tzEejpqOQgt7Q_QUhb5kbo
- ✅ **Auth**: Built-in user management
  - `signUp()`: Create account
  - `signInWithPassword()`: Login
  - `signOut()`: Logout
  - `getSession()`: Get current session
  - `onAuthStateChange()`: Listen to auth changes
  - `updateUser()`: Update profile
  - `resetPasswordForEmail()`: Reset password
- ✅ **Database**: `app_state` table (JSONB)
  - One row: `{id: 1, data: {...}}`
  - RLS enabled
  - Policy: "allow_all" (public read/write for testing)
- ✅ **Functions**:
  - `loadDB()`: Fetch from `app_state`
  - `saveDB()`: Upsert to `app_state`
  - `loadSession()`: Get current user session

### EmailJS
- ✅ **Service ID**: service_hg05z9q
- ✅ **Public Key**: hvZ5-H__RsrCmD_qX
- ✅ **Templates**:
  - `template_f2a57ms`: New message notification
  - `template_yl2ejkt`: New candidature/trial notification
- ✅ **Usage**:
  - Notify player of new candidature
  - Notify player of trial proposal
  - Notify club of new message
- ✅ **Parameters**: to_email, to_name, tipo, dettaglio

### LocalStorage
- ✅ `svincolati:theme` — Dark/light theme preference
- ✅ `svincolati:cookie` — Cookie consent status

### Service Worker (PWA)
- ✅ Manifest: manifest.json
- ✅ Icons: icon.svg
- ✅ App title: SVINCOLATI
- ✅ Theme color: #41c285
- ✅ Mobile app: Can be installed on iOS/Android
- ✅ Offline: Cached assets (if SW implemented)

### Third-party Embeds
- ✅ **YouTube**: Video embeds via iframe
  - Regex: Extract video ID from youtube.com/watch or youtu.be URLs
  - Embed: `<iframe src="https://www.youtube.com/embed/{id}">`
- ✅ **Vimeo**: Video embeds
  - Regex: Extract video ID from vimeo.com/
  - Embed: `<iframe src="https://player.vimeo.com/video/{id}">`

---

## 9. UI/UX PATTERNS

### Theme System
- ✅ **Dark mode** (default): `--bg: #0b0d0a`, `--text: #f3f5ea`, etc.
- ✅ **Light mode**: `--bg: #f3f6f0`, `--text: #161a12`, etc.
- ✅ **Sport themes**: Calcio (green), Calcio5 (light blue), Pallavolo (purple), Rugby (amber), Basket (orange)
- ✅ **Toggle button**: Sun/moon icon in nav
- ✅ **Body attribute**: `data-theme="dark|light"`, `data-sport="sport"`
- ✅ **CSS variables**: Entire design system based on CSS custom properties

### Responsive Design
- ✅ **Breakpoints**:
  - Mobile: < 560px (1-column layouts)
  - Tablet: 560-820px (grid adjustments)
  - Desktop: > 820px (full multi-column)
- ✅ **Nav**:
  - Desktop: Horizontal, full logo + links + user chip
  - Mobile: Hamburger menu → sidebar overlay (78vw max 300px)
- ✅ **Search filters**:
  - Desktop: Visible filter panel
  - Mobile: Hidden, toggle button shows/hides panel
- ✅ **Messaging**:
  - Desktop: 300px + 1fr grid
  - Mobile: Single column, list/thread toggle
- ✅ **Grids**:
  - Player cards: auto-fill minmax 300px
  - KPI boxes: auto-fill minmax 120-130px
  - Forms: 2-column → 1-column on mobile

### Animations & Transitions
- ✅ **Rise animation**: `@keyframes rise` — cards fade in + slide up
- ✅ **Toast animation**: `@keyframes toastIn` — slide up from bottom
- ✅ **Spin**: Loading spinner on icon
- ✅ **Hover effects**: Card lift (translateY -4px), color transitions (.16s)
- ✅ **Sidebar**: Slide in from left (.25s cubic-bezier)
- ✅ **Overlay fade**: Opacity transitions

### Modal System
- ✅ **Overlay**: Fixed, full-screen backdrop with blur
- ✅ **Modal**: Centered, max-width 460px (wide: 660px)
- ✅ **Close button**: X button top-right
- ✅ **Max height**: 88vh with scroll
- ✅ **Animation**: Rise in (.35s)
- ✅ **Backdrop click**: Closes modal

### Toast Notifications
- ✅ **Position**: Fixed bottom-center
- ✅ **Style**: Acid green background, dark text, white text
- ✅ **Animation**: Slide up (.3s)
- ✅ **Duration**: Auto-dismiss after ~3s (imperative)
- ✅ **Stack**: Multiple toasts stack vertically

### Card Components
- ✅ **Player Card** (pcard):
  - Avatar (45×60px, initials or photo)
  - Name + location
  - Age chip
  - Role + category pills
  - Stats (3 cols): Presenze | Reti | Max
  - Availability badge
  - Action buttons (contact, favorite)
  - Hover: Lift + accent border
  
- ✅ **Team/Ad Card** (tcard):
  - Club crest + name
  - Distance (if applicable)
  - Location + address
  - Role sought
  - Category + requirements
  - Stadium info
  - Button: "Proponiti" or "Contatta"
  
- ✅ **Candidature Card** (rowcard):
  - Avatar + name
  - Role + category
  - Status badge (colored)
  - Date
  - Star favorite (optional)

### Form Styling
- ✅ **Field labels**: Spline Sans Mono, uppercase, 11px, letter-spacing
- ✅ **Inputs**: 12.5px Archivo, padding 12px 14px, border 1px, radius 10px
- ✅ **Focus state**: Border color changes to acid, background to field-focus color
- ✅ **Buttons**: 
  - Primary: Acid bg, dark text, hover lift
  - Ghost: Transparent, light border, hover accent
  - Small: 13px, 9px 16px padding
- ✅ **Multi-field layout**: 2-column grid, gap 16px, responsive to 1-col

### Photo Upload & Crop
- ✅ **Preview**: 90×120px box, shows avatar or initials
- ✅ **Cropper**: 288px wide, 3:4 aspect ratio, black background
- ✅ **Zoom icon**: Lightbox view on click
- ✅ **Buttons**: Upload/Change/Remove

### Navigation
- ✅ **Sticky header**: Blur backdrop, 68px height
- ✅ **Logo**: "S" mark + "SVINCOL" + "ATI" (accent)
- ✅ **Links**: Font weight 700, padding 8px 13px, radius 8px
- ✅ **Active link**: Accent color, slightly larger
- ✅ **Badges**: Message count, expiring ads warning
- ✅ **User chip**: Avatar + name + role + sport icon
- ✅ **Logout**: Danger color on hover

### Color System
- ✅ **Acid** (primary): #41c285 (dark), #2fa86d (dim)
- ✅ **Blue** (secondary): #4cc2ff
- ✅ **Danger** (error): #ff5a3c
- ✅ **Backgrounds**: --bg, --bg-2, --card, --card-2
- ✅ **Text**: --text, --muted, --muted-2
- ✅ **Lines**: --line (borders), --line-soft (subtle)

### Typography
- ✅ **Headings**: Anton font, uppercase, letter-spacing -.01em
- ✅ **Body**: Archivo, 14.5px, line-height 1.5
- ✅ **Labels**: Spline Sans Mono, 11px, uppercase, letter-spacing .1em
- ✅ **Monospace**: Spline Sans Mono for technical data

### Badges & Pills
- ✅ **Role pills**: Acid bg + border, small, rounded
- ✅ **Status badges**: Context-colored (blue sent, green accepted, red rejected)
- ✅ **Availability**: Green "Disponibile" or red "Impegnato"
- ✅ **Verified**: Blue badge with ✔

---

## 10. SECURITY

### Row-Level Security (RLS)
- ✅ **Supabase**: RLS enabled on `app_state` table
- ✅ **Policy**: "allow_all" — permissive (public read/write) for demo
- ⚠️ **MIGRATION**: Must implement proper RLS policies:
  - Only authenticated users can update
  - Users can only update their own data
  - Public can read (for search/browse)

### Authentication
- ✅ **Supabase Auth**: Handles password hashing, session tokens
- ✅ **Session check**: `loadSession()` verifies user is logged in
- ✅ **Protected routes**: Redirect to login if no session

### Private Data Visibility
- ✅ **Email**: Hidden from public profiles, shown only to user & admins
- ✅ **Phone/Contact**: Optional private field, not shown publicly
- ✅ **Private Notes**: Club-specific, only visible to that club
- ✅ **Password**: Never transmitted, Supabase Auth handles

### Data Validation
- ✅ **Email**: Unique per system (DB enforces)
- ✅ **Age**: Minimum 18 years enforced at registration
- ✅ **Invite codes**: Must match whitelist
- ✅ **Photo upload**: File type validation (image/*)

### Admin Access Control
- ✅ **Email-based**: ADMIN_EMAILS array hardcoded
- ✅ **Check**: `isAdmin()` function in app
- ✅ **Route protection**: Admin panel returns error if not admin

### Privacy Compliance
- ✅ **GDPR**: Privacy policy included
- ✅ **Consent**: Mandatory privacy checkbox at registration
- ✅ **Marketing consent**: Optional, separate
- ✅ **Data retention**: Policy states 30 days after deletion
- ✅ **User rights**: Policy outlines access, deletion, portability rights

### Profile Verification
- ✅ **FIGC Code**: Optional, indicates verified club
- ✅ **Tessera**: Optional, indicates verified player
- ✅ **Badge**: Blue verified badge displayed if verified
- ✅ **Public**: Verification status visible on public profiles

---

## SUMMARY TABLE

| Category | Status | Notes |
|----------|--------|-------|
| **Views/Pages** | ❌ 25 views to migrate | Login, register, CV, applications, teams, ads, messages, trials, search, transfers, activity, admin, public profile, privacy, contacts |
| **Entities** | ❌ 8 main entities | User, Player, Ad, Candidature, Trial, Thread, Transfer, Report, AppState |
| **Forms** | ❌ 10+ forms | Registration (multi-step), CV, Club profile, Ad creation, Trial, Search filters, Contact, Password reset |
| **Search & Filters** | ❌ 3 modes | Players, Staff, Teams; 10+ filter options |
| **Matching** | ❌ Algorithm | Score-based: role (+4), category (+3/+1), region (+2), province (+1) |
| **Messaging** | ❌ Threads + real-time | Thread-per-pair model, chronological messages, email notifications |
| **Candidatures** | ❌ Full flow | Player proposes → Club reviews → Accept/reject with status tracking |
| **Trials** | ❌ Invite system | Club proposes date/time/message → Player accepts/declines |
| **Transfers** | ❌ Feed display | Confirmed/Negotiations/Free agents, sortable, searchable |
| **Activity Feed** | ❌ Real-time log | Players, ads, transfers with relative timestamps |
| **Favorites** | ❌ Star system | Clubs favorite players, persistent, shows on cards |
| **Profile Views** | ❌ Analytics | Track club views, show last 5, counter badge |
| **Career History** | ❌ Import & edit | Storico array, auto-calculated stats, import from archive |
| **References** | ❌ User testimonials | Clubs leave feedback, displayed on player profiles |
| **Admin Panel** | ❌ Full dashboard | Users, reports, stats, invite codes, DB metrics |
| **Integrations** | ✅ Mapped | Supabase auth/DB, EmailJS notifications, LocalStorage, PWA manifest |
| **Validation** | ❌ Complete | Age, required fields, email uniqueness, invite codes, photo formats |
| **Calculations** | ❌ Implemented | Age from DOB, career stats, distance, match score, expiry days |
| **UI/UX** | ❌ Design system | Dark/light themes, 5 sport color variants, responsive (mobile/desktop), animations, toast notifications, modals |
| **Security** | ⚠️ Needs hardening | RLS enabled but permissive, proper policies needed, email-based admin, password hashing via Supabase, GDPR compliance |

---

## MIGRATION PRIORITY ROADMAP

### Phase 1: Foundation (Backend)
1. Set up Node.js/Express server with TypeScript
2. Implement database schema (PostgreSQL)
3. Implement Supabase Auth integration
4. Create REST API endpoints for all entities

### Phase 2: Core Features (Backend)
1. Player/CV endpoints (CRUD)
2. Ad/Search endpoints
3. Candidature flow
4. Messaging system (persistent)
5. Trial system
6. Search & filtering backend

### Phase 3: Frontend (React)
1. Auth pages (login, register, password reset)
2. Player CV view & form
3. Search & filters
4. Ad browsing & application
5. Messaging UI
6. Trial management

### Phase 4: Advanced Features
1. Activity feed
2. Transfers
3. Favorites & notes
4. Profile analytics (views)
5. Career import
6. References

### Phase 5: Admin & Polish
1. Admin panel
2. Reports system
3. Invite code management
4. Email notifications (EmailJS integration)
5. PWA setup
6. Theme switching
7. Testing & security hardening

---

## FILE PATHS & REFERENCES

**Source Application**: `/Users/bagigi/Desktop/projects/svincolati/index.html` (3187 lines, single-file Vue app)

**Key Constants**:
- Sports: SPORTS = {calcio, calcio5, pallavolo, rugby, basket}
- Regions: REGIONI = [20 Italian regions]
- Provinces: PROVINCE = {region: [[code, name], ...]}
- Roles: RUOLI = [10 football positions]
- Staff Types: STAFF_TYPES = [8 types]
- Admin emails: ADMIN_EMAILS = ['calcio.levelup@gmail.com']
- Invite codes: INVITI = ['LEGA2026']

**Database**:
- Supabase URL: https://sqheuyazspnkesvsnsbf.supabase.co
- Table: app_state (single row, JSONB data column)

**Email Templates**:
- Service: service_hg05z9q
- Template (messages): template_f2a57ms
- Template (candidatures): template_yl2ejkt

---

**STATUS**: ✅ Complete specification captured. Ready for migration.
