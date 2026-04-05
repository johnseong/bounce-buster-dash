
-- Add a demo-friendly read policy so all authenticated users can see seeded insights
CREATE POLICY "Authenticated users can read all insights (demo)"
ON public.insights
FOR SELECT
TO authenticated
USING (true);

-- Seed sample insight records
INSERT INTO public.insights (user_id, severity, type, title, description, impact, related_page_path, metadata)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'critical', 'performance', 
   'Performance dropped 15% — mobile bounce rate surged to 72%',
   'Mobile visitors leave after 48s on average. The checkout funnel lost 740 users at the "Add to Cart → Checkout" step.',
   'high', '/checkout',
   '{"timeAgo": "2 hours ago", "cta": "Fix Checkout Drop-off", "cta2": "Analyze Root Cause"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000000', 'warning', 'speed',
   'Mobile landing page loads in 4.2s — 72% bounce',
   'Slow load time on mobile is the #1 driver. Desktop loads in 1.8s with only 45% bounce.',
   'medium', '/landing',
   '{"cta": "Optimize Mobile Speed"}'::jsonb),
  
  ('00000000-0000-0000-0000-000000000000', 'success', 'engagement',
   'Docs engagement up 25% — avg session 5m 44s',
   'Users who visit Docs convert 3× more. Consider promoting it in onboarding.',
   'medium', '/docs',
   '{"cta": "Leverage This Trend"}'::jsonb);
