
CREATE POLICY "Authenticated users can read all reports (demo)"
ON public.saved_reports FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read all schedules (demo)"
ON public.scheduled_reports FOR SELECT TO authenticated USING (true);
