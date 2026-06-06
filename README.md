# SVINCOLATI — Marketplace Sportivo

Piattaforma web moderna per connettere giocatori svincolati e società sportive dilettantistiche.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Real-time**: Supabase Subscriptions
- **Email**: EmailJS
- **Storage**: Supabase Storage (foto profili)

## ✨ Features

### 🎯 Core Features
- ✅ Autenticazione con email/password
- ✅ Profili giocatori e società
- ✅ Sistema di candidature (player → club)
- ✅ Provini (trials) - club → player
- ✅ Messaging in tempo reale
- ✅ Sistema di favoriti (⭐)
- ✅ Attività feed

### 🎨 Personalizzazione
- ✅ Sport-specific color themes (5 sport)
- ✅ Dark/Light theme toggle
- ✅ Verified badge per giocatori certificati
- ✅ Video embed (YouTube/Vimeo)

### 🔍 Ricerca & Filtri
- ✅ Ricerca avanzata con filtri dinamici
- ✅ Filtri: ruolo, piede, categoria, età, altezza, regione, provincia
- ✅ Matching algorithm per candidature

### 📱 UX/UI
- ✅ Responsive design (mobile-first)
- ✅ Onboarding modals
- ✅ Cookie consent banner
- ✅ Loading states & animations
- ✅ Toast notifications

### 🛠️ Admin
- ✅ Admin panel con statistiche
- ✅ Gestione codici invito
- ✅ User management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

```bash
git clone https://github.com/calciolevelup-ai/svincolati-next.git
cd svincolati-next
npm install

# Setup environment
cp .env.example .env.local

# Run dev server
npm run dev
```

Visita `http://localhost:3000`

## 📊 Fasi Implementate (9/10)

1. ✅ Sport color themes + verified badge
2. ✅ Advanced search filters
3. ✅ Career history + video embed
4. ✅ Ad expiry + renewal
5. ✅ Referenze/reviews system
6. ✅ Photo upload
7. ✅ Theme toggle + cookie consent
8. ✅ Onboarding modals
9. ✅ Admin panel improvements

## 📈 Pages (38/38)

- 4 Auth pages (login, register, password reset)
- 17 Dashboard pages (player/club/staff)
- 4 Public pages (profile, marketplace, privacy, onboarding)
- Admin panel

## 🎨 Design System

**Sport Color Themes:**
- calcio (green) ⚽
- calcio5 (blue) ⚽
- pallavolo (purple) 🏐
- rugby (yellow) 🏈
- basket (orange) 🏀

## 🔐 Security

- Supabase RLS policies
- JWT authentication
- Protected routes
- Input validation

## 📄 License

MIT

## 👨‍💻 Author

Developed by Claude Code + User

---

GitHub: [calciolevelup-ai/svincolati-next](https://github.com/calciolevelup-ai/svincolati-next)
