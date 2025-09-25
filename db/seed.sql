-- Smartflytt Database Seed Data
-- Test data for development and demonstration

-- Insert admin user role (replace with actual admin user ID)
-- Note: This should be run after creating the admin user in Supabase Auth
INSERT INTO public.user_roles (user_id, role)
VALUES 
    -- Replace this UUID with your actual admin user ID from Supabase Auth
    ('00000000-0000-0000-0000-000000000000', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert sample leads for testing
INSERT INTO public.leads (
    id,
    submission_type,
    lead_quality,
    lead_score,
    status,
    name,
    email,
    phone,
    move_date,
    from_address,
    to_address,
    volume,
    distance_data,
    price_calculation,
    additional_info,
    chat_transcript
) VALUES 
-- High quality lead
(
    gen_random_uuid(),
    'offert',
    'high',
    85,
    'new',
    'Anna Andersson',
    'anna.andersson@email.se',
    '0701234567',
    CURRENT_DATE + INTERVAL '2 weeks',
    '{
        "street": "Storgatan 15",
        "postal": "11122",
        "city": "Stockholm"
    }'::jsonb,
    '{
        "street": "Kungsgatan 42",
        "postal": "41119",
        "city": "Göteborg"
    }'::jsonb,
    45.5,
    '{
        "movingDistance": 470,
        "baseToStartDistance": 12,
        "baseToEndDistance": 8
    }'::jsonb,
    '{
        "startFee": 2500,
        "elevatorFee": 0,
        "volumeCost": 13650,
        "distanceCost": 14100,
        "remoteStartSurcharge": 0,
        "longDistanceSurcharge": 4700,
        "totalPrice": 34950
    }'::jsonb,
    'Har mycket böcker och möbler. Behöver hjälp med packning.',
    '[
        {"id": "msg1", "type": "bot", "content": "Hej! Jag hjälper dig att få en offert för din flytt.", "timestamp": "2024-01-15T10:00:00Z"},
        {"id": "msg2", "type": "user", "content": "Jag vill flytta från Stockholm till Göteborg", "timestamp": "2024-01-15T10:01:00Z"}
    ]'::jsonb
),

-- Medium quality lead
(
    gen_random_uuid(),
    'kontorsflytt',
    'medium',
    65,
    'contacted',
    'Erik Eriksson',
    'erik@foretag.se',
    '0768765432',
    CURRENT_DATE + INTERVAL '1 month',
    '{
        "street": "Hamngatan 8",
        "postal": "21122",
        "city": "Malmö"
    }'::jsonb,
    '{
        "street": "Västra Hamngatan 20",
        "postal": "41117",
        "city": "Göteborg"
    }'::jsonb,
    25.0,
    '{
        "movingDistance": 285,
        "baseToStartDistance": 45,
        "baseToEndDistance": 8
    }'::jsonb,
    '{
        "startFee": 2500,
        "elevatorFee": 1000,
        "volumeCost": 7500,
        "distanceCost": 8550,
        "remoteStartSurcharge": 1125,
        "longDistanceSurcharge": 2850,
        "totalPrice": 23525
    }'::jsonb,
    'Kontorsflytt för litet IT-företag. Behöver flytta servrar försiktigt.',
    '[
        {"id": "msg1", "type": "bot", "content": "Välkommen! Vad kan jag hjälpa dig med?", "timestamp": "2024-01-14T14:30:00Z"},
        {"id": "msg2", "type": "user", "content": "Vi behöver flytta vårt kontor", "timestamp": "2024-01-14T14:31:00Z"}
    ]'::jsonb
),

-- Low quality lead (incomplete)
(
    gen_random_uuid(),
    'volymuppskattning',
    'low',
    35,
    'new',
    'Maria Svensson',
    'maria.svensson@gmail.com',
    '0734567890',
    CURRENT_DATE + INTERVAL '3 months',
    '{
        "street": "Smålandsgatan 5",
        "postal": "72212",
        "city": "Västerås"
    }'::jsonb,
    '{
        "street": "Drottninggatan 12",
        "postal": "11151",
        "city": "Stockholm"
    }'::jsonb,
    15.0,
    null,
    null,
    'Osäker på exakt datum ännu.',
    '[
        {"id": "msg1", "type": "bot", "content": "Hej! Jag kan hjälpa dig uppskatta volymen för din flytt.", "timestamp": "2024-01-13T16:15:00Z"}
    ]'::jsonb
),

-- Quoted lead
(
    gen_random_uuid(),
    'offert',
    'high',
    92,
    'quoted',
    'Johan Johansson',
    'johan.johansson@hotmail.com',
    '0709876543',
    CURRENT_DATE + INTERVAL '10 days',
    '{
        "street": "Östermalmsplan 1",
        "postal": "11442",
        "city": "Stockholm"
    }'::jsonb,
    '{
        "street": "Avenyn 15",
        "postal": "41136",
        "city": "Göteborg"
    }'::jsonb,
    65.0,
    '{
        "movingDistance": 470,
        "baseToStartDistance": 5,
        "baseToEndDistance": 12
    }'::jsonb,
    '{
        "startFee": 2500,
        "elevatorFee": 500,
        "volumeCost": 19500,
        "distanceCost": 14100,
        "remoteStartSurcharge": 0,
        "longDistanceSurcharge": 4700,
        "totalPrice": 41300
    }'::jsonb,
    'Stor lägenhet med många antika möbler. Behöver extra försiktighet.',
    '[
        {"id": "msg1", "type": "bot", "content": "Hej Johan! Välkommen till Smartflytt.", "timestamp": "2024-01-12T09:20:00Z"},
        {"id": "msg2", "type": "user", "content": "Jag behöver hjälp med en flytt från Stockholm", "timestamp": "2024-01-12T09:21:00Z"}
    ]'::jsonb
);

-- Insert sample audit records
INSERT INTO public.lead_sales_audit (
    lead_uuid,
    partner_price,
    platform_commission,
    sold_by
)
SELECT 
    l.id,
    (pc->>'totalPrice')::INTEGER,
    ((pc->>'totalPrice')::INTEGER * 0.15)::INTEGER, -- 15% commission
    'System Generated'
FROM public.leads l
WHERE l.status = 'quoted' 
  AND l.price_calculation IS NOT NULL
  AND l.price_calculation->>'totalPrice' IS NOT NULL;

-- Insert test data for different scenarios
INSERT INTO public.leads (
    submission_type,
    lead_quality,
    lead_score,
    status,
    name,
    email,
    phone,
    move_date,
    from_address,
    to_address,
    volume,
    additional_info
) VALUES 
-- Local move (same city)
(
    'offert',
    'medium',
    70,
    'new',
    'Lisa Karlsson',
    'lisa.karlsson@gmail.com',
    '0731122334',
    CURRENT_DATE + INTERVAL '1 week',
    '{
        "street": "Upplandsgatan 10",
        "postal": "11323",
        "city": "Stockholm"
    }'::jsonb,
    '{
        "street": "Södermalmsplan 5",
        "postal": "11646",
        "city": "Stockholm"
    }'::jsonb,
    30.0,
    'Lokala flytt inom Stockholm. Ingen hiss i någon av adresserna.'
),

-- Long distance move
(
    'offert',
    'high',
    88,
    'new',
    'Mikael Lindberg',
    'mikael.lindberg@company.se',
    '0765544332',
    CURRENT_DATE + INTERVAL '1 month',
    '{
        "street": "Tornvägen 25",
        "postal": "97834",
        "city": "Kiruna"
    }'::jsonb,
    '{
        "street": "Strandvägen 8",
        "postal": "11456",
        "city": "Stockholm"
    }'::jsonb,
    55.0,
    'Flytt från Kiruna till Stockholm. Mycket vinterkläder och sportutrustning.'
),

-- Small apartment move
(
    'volymuppskattning',
    'medium',
    55,
    'new',
    'Sara Nilsson',
    'sara.nilsson@student.se',
    '0723445566',
    CURRENT_DATE + INTERVAL '2 weeks',
    '{
        "street": "Studentvägen 12A",
        "postal": "22363",
        "city": "Lund"
    }'::jsonb,
    '{
        "street": "Chalmersplatsen 4",
        "postal": "41258",
        "city": "Göteborg"
    }'::jsonb,
    12.0,
    'Studentflytt. Mest kläder och böcker.'
);

-- Add comments for documentation
COMMENT ON TABLE public.leads IS 'Sample data includes various lead types and qualities for testing';
COMMENT ON TABLE public.lead_sales_audit IS 'Sample audit records showing commission calculations';

-- Note: Remember to update the admin user_id in the user_roles table
-- with the actual UUID from your Supabase Auth dashboard