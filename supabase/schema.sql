-- ============================================================
-- SVINCOLATI — Schema Supabase
-- Esegui questo file nel SQL Editor di Supabase
-- ============================================================

-- Abilita estensioni
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('player','club','staff')),
  sport      TEXT NOT NULL DEFAULT 'calcio',
  email      TEXT,
  verified   BOOLEAN DEFAULT false,
  invite_code TEXT,
  invited_by  TEXT,
  dob        DATE,
  onboarded  BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PLAYER PROFILES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL DEFAULT '',
  ruolo       TEXT DEFAULT '',
  staff_type  TEXT,
  staff_cat   TEXT,
  esperienza_anni INTEGER,
  eta         INTEGER,
  piede       TEXT DEFAULT 'Destro',
  cat         TEXT DEFAULT '',
  regione     TEXT DEFAULT '',
  provincia   TEXT DEFAULT '',
  squadra     TEXT DEFAULT '',
  altezza     INTEGER,
  bio         TEXT DEFAULT 'Profilo da completare.',
  video       TEXT DEFAULT '',
  contatto    TEXT DEFAULT '',
  photo       TEXT,
  tessera     TEXT DEFAULT '',
  disponibile BOOLEAN DEFAULT true,
  disponibile_da DATE,
  views       INTEGER DEFAULT 0,
  sport       TEXT DEFAULT 'calcio',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CAREER HISTORY ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS career_history (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  stagione  TEXT DEFAULT '',
  squadra   TEXT DEFAULT '',
  categoria TEXT DEFAULT '',
  presenze  INTEGER,
  reti      INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLUB PROFILES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS club_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  club_name           TEXT NOT NULL DEFAULT '',
  loc                 TEXT DEFAULT '',
  regione             TEXT DEFAULT '',
  provincia           TEXT DEFAULT '',
  paese               TEXT DEFAULT '',
  impianto            TEXT DEFAULT '',
  impianto_indirizzo  TEXT DEFAULT '',
  url                 TEXT DEFAULT '',
  figc                TEXT DEFAULT '',
  crest               TEXT DEFAULT '',
  sport               TEXT DEFAULT 'calcio',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ADS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ads (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sport      TEXT NOT NULL DEFAULT 'calcio',
  ruolo      TEXT NOT NULL,
  cat        TEXT NOT NULL,
  regione    TEXT NOT NULL,
  provincia  TEXT DEFAULT '',
  descr      TEXT NOT NULL,
  tags       TEXT[] DEFAULT '{}',
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  views      INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CANDIDATURES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS candidatures (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id     UUID REFERENCES ads(id) ON DELETE SET NULL,
  club_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status    TEXT DEFAULT 'inviata' CHECK (status IN ('inviata','accettata','rifiutata')),
  tipo      TEXT DEFAULT 'inbound' CHECK (tipo IN ('inbound','outbound')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(ad_id, player_id)
);

-- ─── THREADS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS threads (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  club_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, club_id)
);

-- ─── MESSAGES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  from_role TEXT CHECK (from_role IN ('player','club','staff')),
  text      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRANSFERS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transfers (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id   UUID REFERENCES profiles(id),
  nome      TEXT NOT NULL,
  ruolo     TEXT DEFAULT '',
  da        TEXT DEFAULT '',
  a         TEXT DEFAULT '',
  cat       TEXT DEFAULT '',
  tipo      TEXT DEFAULT 'Confermato' CHECK (tipo IN ('Confermato','Trattativa','Svincolato')),
  regione   TEXT DEFAULT '',
  sport     TEXT DEFAULT 'calcio',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FAVORITES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_id   UUID NOT NULL,
  target_type TEXT CHECK (target_type IN ('player','club','staff')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_id)
);

-- ─── PLAYER VIEWS LOG ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS player_views (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  club_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REPORTS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reported_player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  reason            TEXT DEFAULT '',
  note              TEXT DEFAULT '',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REFERENZE ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS referenze (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES player_profiles(id) ON DELETE CASCADE,
  club_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  club_name TEXT DEFAULT '',
  text      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, club_id)
);

-- ─── INVITE CODES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invite_codes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code       TEXT UNIQUE NOT NULL,
  owner_id   UUID REFERENCES profiles(id),
  uses       INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO invite_codes (code) VALUES ('LEGA2026') ON CONFLICT DO NOTHING;

-- ─── TRIALS (Inviti a prova) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS trials (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  player_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trial_date    DATE NOT NULL,
  trial_time    TIME DEFAULT '15:00',
  message       TEXT DEFAULT '',
  status        TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined','completed')),
  sport         TEXT DEFAULT 'calcio',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, player_id)
);

-- ─── ACTIVITY LOG (Feed attività) ────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type    TEXT NOT NULL CHECK (event_type IN ('profile_view','candidature_sent','candidature_received','message','trial_invite','trial_accepted','trial_declined')),
  actor_id      UUID REFERENCES profiles(id),
  actor_name    TEXT,
  description   TEXT NOT NULL,
  reference_id  UUID,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SEARCH PREFERENCES (Preferenze giocatore) ───────────────
CREATE TABLE IF NOT EXISTS search_preferences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id     UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  cat_min       TEXT DEFAULT '',
  regione_pref  TEXT DEFAULT '',
  note          TEXT DEFAULT '',
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS POLICIES ────────────────────────────────────────────
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_history  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures    ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads         ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers       ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites       ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports         ENABLE ROW LEVEL SECURITY;
ALTER TABLE referenze       ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE trials          ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_preferences ENABLE ROW LEVEL SECURITY;

-- Tutti autenticati leggono tutto
CREATE POLICY "read_all" ON profiles        FOR SELECT USING (true);
CREATE POLICY "read_all" ON player_profiles FOR SELECT USING (true);
CREATE POLICY "read_all" ON club_profiles   FOR SELECT USING (true);
CREATE POLICY "read_all" ON career_history  FOR SELECT USING (true);
CREATE POLICY "read_all" ON ads             FOR SELECT USING (true);
CREATE POLICY "read_all" ON candidatures    FOR SELECT USING (true);
CREATE POLICY "read_all" ON threads         FOR SELECT TO authenticated USING (auth.uid() = player_id OR auth.uid() = club_id);
CREATE POLICY "read_all" ON messages        FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM threads WHERE id = thread_id AND (player_id = auth.uid() OR club_id = auth.uid())));
CREATE POLICY "read_all" ON transfers       FOR SELECT USING (true);
CREATE POLICY "read_all" ON favorites       FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "read_all" ON player_views    FOR SELECT TO authenticated USING (true);
CREATE POLICY "read_all" ON reports         FOR SELECT TO authenticated USING (reporter_id = auth.uid());
CREATE POLICY "read_all" ON referenze       FOR SELECT USING (true);
CREATE POLICY "read_all" ON invite_codes    FOR SELECT USING (true);
CREATE POLICY "read_all" ON trials          FOR SELECT TO authenticated USING (club_id = auth.uid() OR player_id = auth.uid());
CREATE POLICY "read_own" ON activity_log    FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "read_own" ON search_preferences FOR SELECT TO authenticated USING (player_id = auth.uid());

-- Scrittura solo per il proprietario
CREATE POLICY "write_own" ON profiles        FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "write_own" ON player_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "write_own" ON club_profiles   FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "write_own" ON career_history  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM player_profiles WHERE id = player_id AND user_id = auth.uid()));
CREATE POLICY "write_own" ON ads             FOR ALL TO authenticated USING (club_id = auth.uid()) WITH CHECK (club_id = auth.uid());
CREATE POLICY "write_own" ON candidatures    FOR INSERT TO authenticated WITH CHECK (player_id = auth.uid() OR club_id = auth.uid());
CREATE POLICY "update_cand" ON candidatures  FOR UPDATE TO authenticated USING (club_id = auth.uid());
CREATE POLICY "write_own" ON threads         FOR INSERT TO authenticated WITH CHECK (player_id = auth.uid() OR club_id = auth.uid());
CREATE POLICY "write_own" ON messages        FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "write_own" ON transfers       FOR INSERT TO authenticated WITH CHECK (club_id = auth.uid());
CREATE POLICY "write_own" ON favorites       FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "write_own" ON player_views    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "write_own" ON reports         FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "write_own" ON referenze       FOR ALL TO authenticated USING (club_id = auth.uid()) WITH CHECK (club_id = auth.uid());
CREATE POLICY "write_own" ON invite_codes    FOR UPDATE TO authenticated USING (owner_id = auth.uid());
CREATE POLICY "write_own" ON trials          FOR INSERT TO authenticated WITH CHECK (club_id = auth.uid());
CREATE POLICY "update_trial" ON trials       FOR UPDATE TO authenticated USING (player_id = auth.uid());
CREATE POLICY "write_own" ON activity_log    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "write_own" ON search_preferences FOR ALL TO authenticated USING (player_id = auth.uid()) WITH CHECK (player_id = auth.uid());

-- Trigger per updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles        BEFORE UPDATE ON profiles        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_player_profiles BEFORE UPDATE ON player_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_club_profiles   BEFORE UPDATE ON club_profiles   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
