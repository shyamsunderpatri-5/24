-- Seed Data for Testing App Setup
-- Ensures an initial active business context exists.

INSERT INTO auth.users (id, email) 
VALUES ('11111111-1111-1111-1111-111111111111', 'test@whatsai.in')
ON CONFLICT DO NOTHING;

INSERT INTO businesses (id, owner_user_id, name, type, whatsapp_number, phone_number_id, onboarding_completed, subscription_tier)
VALUES (
 '22222222-2222-2222-2222-222222222222',
 '11111111-1111-1111-1111-111111111111',
 'Demo Dental Clinic',
 'clinic',
 '+919000000000',
 '123456789012345',
 true,
 'premium'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO customers (id, business_id, phone, name)
VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '+919876543210',
  'Rajesh Kumar'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO services (business_id, name, duration_mins, price_inr)
VALUES 
('22222222-2222-2222-2222-222222222222', 'General Checkup', 30, 500),
('22222222-2222-2222-2222-222222222222', 'Teeth Cleaning', 45, 1200);
