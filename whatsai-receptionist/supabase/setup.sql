-- ============================================================
-- TABLE: businesses (one row per tenant)
-- ============================================================
CREATE TABLE businesses (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  type                  TEXT NOT NULL CHECK (type IN ('clinic','salon','kirana','medical','other')),
  whatsapp_number       TEXT UNIQUE,        -- e.g. "+919876543210"
  phone_number_id       TEXT UNIQUE,        -- Meta Cloud API phone_number_id
  waba_id               TEXT,              -- WhatsApp Business Account ID
  access_token_encrypted TEXT,             -- Meta access token (encrypted at app level)
  address               TEXT,
  city                  TEXT DEFAULT 'Hyderabad',
  state                 TEXT DEFAULT 'Telangana',
  language_preference   TEXT DEFAULT 'hinglish' CHECK (language_preference IN ('hindi','english','hinglish','telugu')),
  greeting_message      TEXT,              -- Custom AI greeting
  away_message          TEXT,              -- Message when business is closed
  upi_id                TEXT,              -- Business UPI ID for payment links
  razorpay_account_id   TEXT,              -- For payment collection
  timezone              TEXT DEFAULT 'Asia/Kolkata',
  is_active             BOOLEAN DEFAULT true,
  onboarding_completed  BOOLEAN DEFAULT false,
  subscription_tier     TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('trial','basic','standard','premium','enterprise')),
  trial_ends_at         TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: business_hours
-- ============================================================
CREATE TABLE business_hours (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun
  is_open       BOOLEAN DEFAULT true,
  open_time     TIME NOT NULL DEFAULT '09:00',
  close_time    TIME NOT NULL DEFAULT '20:00',
  break_start   TIME,
  break_end     TIME,
  UNIQUE(business_id, day_of_week)
);

-- ============================================================
-- TABLE: staff (for premium multi-staff)
-- ============================================================
CREATE TABLE staff (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  role          TEXT,              -- e.g. "Doctor", "Stylist", "Cashier"
  whatsapp      TEXT,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: services (for clinics/salons) 
-- ============================================================
CREATE TABLE services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  name_hindi    TEXT,              -- Hindi name for AI responses
  duration_mins INTEGER DEFAULT 30,
  price_inr     NUMERIC(10,2),
  staff_id      UUID REFERENCES staff(id),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: customers (deduplicated by phone per business)
-- ============================================================
CREATE TABLE customers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       UUID REFERENCES businesses(id) ON DELETE CASCADE,
  phone             TEXT NOT NULL,        -- WhatsApp phone with country code
  name              TEXT,
  preferred_language TEXT DEFAULT 'hinglish',
  total_visits      INTEGER DEFAULT 0,
  last_visit_at     TIMESTAMPTZ,
  notes             TEXT,                -- Owner notes about customer
  is_blocked        BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, phone)
);

-- ============================================================
-- TABLE: appointments
-- ============================================================
CREATE TABLE appointments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id),
  staff_id        UUID REFERENCES staff(id),
  service_id      UUID REFERENCES services(id),
  appointment_at  TIMESTAMPTZ NOT NULL,
  duration_mins   INTEGER DEFAULT 30,
  status          TEXT DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled','completed','no_show')),
  notes           TEXT,
  amount_inr      NUMERIC(10,2),
  payment_status  TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','refunded','na')),
  razorpay_link   TEXT,
  reminder_24h_sent BOOLEAN DEFAULT false,
  reminder_2h_sent  BOOLEAN DEFAULT false,
  source          TEXT DEFAULT 'whatsapp',    -- 'whatsapp','dashboard','manual'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: products / inventory (kirana & medical shops)
-- ============================================================
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  name_hindi      TEXT,
  name_aliases    TEXT[],          -- ["paracetamol","crocin","pcm"] for fuzzy matching
  category        TEXT,
  sku             TEXT,
  stock_qty       INTEGER DEFAULT 0,
  price_inr       NUMERIC(10,2),
  unit            TEXT DEFAULT 'piece',   -- 'piece','kg','litre','strip','box'
  reorder_level   INTEGER DEFAULT 5,
  is_available    BOOLEAN DEFAULT true,
  image_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: orders (for kirana/medical)
-- ============================================================
CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id),
  order_number    TEXT,              -- Auto-generated: ORD-20260101-001
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','preparing','dispatched','delivered','cancelled')),
  delivery_type   TEXT DEFAULT 'pickup' CHECK (delivery_type IN ('pickup','delivery')),
  delivery_address TEXT,
  amount_inr      NUMERIC(10,2),      -- Total amount for the order
  total_inr       NUMERIC(10,2),      -- Redundant but kept for compatibility
  metadata        JSONB,              -- For storing items list {items: [...]}
  payment_status  TEXT DEFAULT 'pending',
  razorpay_link   TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  product_name TEXT NOT NULL,      -- Snapshot at time of order
  qty         INTEGER NOT NULL,
  price_inr   NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- TABLE: conversations (one per customer-business pair)
-- ============================================================
CREATE TABLE conversations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id       UUID REFERENCES customers(id),
  wa_conversation_id TEXT,
  status            TEXT DEFAULT 'active' CHECK (status IN ('active','resolved','human_takeover','blocked')),
  last_message_at   TIMESTAMPTZ,
  unread_count      INTEGER DEFAULT 0,
  is_human_taking_over BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, customer_id)
);

-- ============================================================
-- TABLE: messages
-- ============================================================
CREATE TABLE messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID REFERENCES conversations(id) ON DELETE CASCADE,
  business_id       UUID REFERENCES businesses(id),
  sender_type       TEXT DEFAULT 'user', -- 'user' or 'bot'
  direction         TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  message_type      TEXT NOT NULL CHECK (message_type IN ('text','audio','image','interactive')),
  content           TEXT,          -- Text content
  wa_message_id     TEXT UNIQUE,   -- WhatsApp message ID
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  sent_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RLS POLICIES
-- ============================================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Simple Ownership Policies
CREATE POLICY "owner_all" ON businesses FOR ALL USING (owner_user_id = auth.uid());
CREATE POLICY "business_owner_all_appt" ON appointments FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_hours" ON business_hours FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_staff" ON staff FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_serv" ON services FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_cust" ON customers FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_prod" ON products FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_orders" ON orders FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_conv" ON conversations FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
CREATE POLICY "business_owner_all_msg" ON messages FOR ALL USING (business_id IN (SELECT id FROM businesses WHERE owner_user_id = auth.uid()));
