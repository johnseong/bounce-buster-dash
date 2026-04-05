
CREATE POLICY "Authenticated users can read all segments (demo)"
ON public.user_segments FOR SELECT TO authenticated USING (true);
