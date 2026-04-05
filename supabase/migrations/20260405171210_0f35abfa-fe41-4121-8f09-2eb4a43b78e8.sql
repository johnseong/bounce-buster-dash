
-- Demo read policy for funnel_events
CREATE POLICY "Authenticated users can read all funnel events (demo)"
ON public.funnel_events FOR SELECT TO authenticated USING (true);

-- Demo read policy for saved_funnels
CREATE POLICY "Authenticated users can read all funnels (demo)"
ON public.saved_funnels FOR SELECT TO authenticated USING (true);

-- Seed a demo funnel definition using a real user
INSERT INTO public.saved_funnels (id, user_id, name, steps)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  '349c193a-4ee2-42e0-a513-fac849e1ae56',
  'E-Commerce Purchase Flow',
  '[{"name":"Landing Page","index":0},{"name":"Product View","index":1},{"name":"Add to Cart","index":2},{"name":"Checkout","index":3},{"name":"Purchase","index":4}]'::jsonb
);

-- Step 0: Landing Page — 1248 sessions
INSERT INTO public.funnel_events (funnel_id, session_id, step_name, step_index, completed, created_at)
SELECT 'a0000000-0000-0000-0000-000000000001', gen_random_uuid(), 'Landing Page', 0, true,
       now() - (random() * interval '7 days')
FROM generate_series(1, 1248);

-- Step 1: Product View — 789 sessions
INSERT INTO public.funnel_events (funnel_id, session_id, step_name, step_index, completed, created_at)
SELECT 'a0000000-0000-0000-0000-000000000001', gen_random_uuid(), 'Product View', 1, true,
       now() - (random() * interval '7 days')
FROM generate_series(1, 789);

-- Step 2: Add to Cart — 324 sessions
INSERT INTO public.funnel_events (funnel_id, session_id, step_name, step_index, completed, created_at)
SELECT 'a0000000-0000-0000-0000-000000000001', gen_random_uuid(), 'Add to Cart', 2, true,
       now() - (random() * interval '7 days')
FROM generate_series(1, 324);

-- Step 3: Checkout — 186 sessions
INSERT INTO public.funnel_events (funnel_id, session_id, step_name, step_index, completed, created_at)
SELECT 'a0000000-0000-0000-0000-000000000001', gen_random_uuid(), 'Checkout', 3, true,
       now() - (random() * interval '7 days')
FROM generate_series(1, 186);

-- Step 4: Purchase — 112 sessions
INSERT INTO public.funnel_events (funnel_id, session_id, step_name, step_index, completed, created_at)
SELECT 'a0000000-0000-0000-0000-000000000001', gen_random_uuid(), 'Purchase', 4, true,
       now() - (random() * interval '7 days')
FROM generate_series(1, 112);
