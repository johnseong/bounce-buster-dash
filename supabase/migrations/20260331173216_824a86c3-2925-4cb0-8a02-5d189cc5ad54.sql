
-- ============================================================
-- 1. analytics_events — core event ingestion table
-- ============================================================
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id uuid NOT NULL,
  event_type text NOT NULL,
  page_path text NOT NULL,
  page_title text,
  referrer text,
  source text,
  device_type text NOT NULL DEFAULT 'desktop',
  country text,
  duration_ms int,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read analytics"
  ON public.analytics_events FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can insert analytics"
  ON public.analytics_events FOR INSERT TO service_role
  WITH CHECK (true);

CREATE INDEX idx_analytics_events_created ON public.analytics_events (created_at);
CREATE INDEX idx_analytics_events_session ON public.analytics_events (session_id);
CREATE INDEX idx_analytics_events_page ON public.analytics_events (page_path);

-- ============================================================
-- 2. funnel_events — funnel step tracking
-- ============================================================
CREATE TABLE public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id uuid REFERENCES public.saved_funnels(id) ON DELETE CASCADE NOT NULL,
  user_id uuid,
  session_id uuid NOT NULL,
  step_name text NOT NULL,
  step_index int NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

-- Security definer to check funnel ownership without recursion
CREATE OR REPLACE FUNCTION public.owns_funnel(_user_id uuid, _funnel_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.saved_funnels
    WHERE id = _funnel_id AND user_id = _user_id
  )
$$;

CREATE POLICY "Users can read their funnel events"
  ON public.funnel_events FOR SELECT TO authenticated
  USING (public.owns_funnel(auth.uid(), funnel_id));

CREATE POLICY "Service role can insert funnel events"
  ON public.funnel_events FOR INSERT TO service_role
  WITH CHECK (true);

CREATE INDEX idx_funnel_events_funnel ON public.funnel_events (funnel_id);
CREATE INDEX idx_funnel_events_created ON public.funnel_events (created_at);

-- ============================================================
-- 3. page_analytics — pre-aggregated page metrics
-- ============================================================
CREATE TABLE public.page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  page_title text,
  date date NOT NULL,
  views int NOT NULL DEFAULT 0,
  unique_visitors int NOT NULL DEFAULT 0,
  bounce_count int NOT NULL DEFAULT 0,
  total_duration_ms bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_path, date)
);

ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read page analytics"
  ON public.page_analytics FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role can manage page analytics"
  ON public.page_analytics FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX idx_page_analytics_date ON public.page_analytics (date);

-- ============================================================
-- 4. insights — AI-generated alerts and recommendations
-- ============================================================
CREATE TABLE public.insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  impact text,
  related_funnel_id uuid REFERENCES public.saved_funnels(id) ON DELETE SET NULL,
  related_page_path text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own insights"
  ON public.insights FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own insights"
  ON public.insights FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert insights"
  ON public.insights FOR INSERT TO service_role
  WITH CHECK (true);

CREATE INDEX idx_insights_user ON public.insights (user_id);
CREATE INDEX idx_insights_created ON public.insights (created_at);

-- ============================================================
-- 5. insight_actions — actionable fixes tied to insights
-- ============================================================
CREATE TABLE public.insight_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id uuid REFERENCES public.insights(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  projected_impact jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  applied_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.insight_actions ENABLE ROW LEVEL SECURITY;

-- Security definer to check insight ownership
CREATE OR REPLACE FUNCTION public.owns_insight(_user_id uuid, _insight_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.insights
    WHERE id = _insight_id AND user_id = _user_id
  )
$$;

CREATE POLICY "Users can read own insight actions"
  ON public.insight_actions FOR SELECT TO authenticated
  USING (public.owns_insight(auth.uid(), insight_id));

CREATE POLICY "Users can update own insight actions"
  ON public.insight_actions FOR UPDATE TO authenticated
  USING (public.owns_insight(auth.uid(), insight_id));

CREATE POLICY "Service role can insert insight actions"
  ON public.insight_actions FOR INSERT TO service_role
  WITH CHECK (true);

CREATE INDEX idx_insight_actions_insight ON public.insight_actions (insight_id);

-- ============================================================
-- 6. user_segments — segment definitions
-- ============================================================
CREATE TABLE public.user_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  icon_key text NOT NULL DEFAULT 'users',
  filter_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  color_class text NOT NULL DEFAULT 'bg-accent text-accent-foreground',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own segments"
  ON public.user_segments FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own segments"
  ON public.user_segments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own segments"
  ON public.user_segments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own segments"
  ON public.user_segments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_segments_user ON public.user_segments (user_id);

-- Add updated_at trigger
CREATE TRIGGER update_user_segments_updated_at
  BEFORE UPDATE ON public.user_segments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. scheduled_reports — report automation
-- ============================================================
CREATE TABLE public.scheduled_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_id uuid REFERENCES public.saved_reports(id) ON DELETE CASCADE NOT NULL,
  frequency text NOT NULL,
  next_run_at timestamptz NOT NULL,
  last_run_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own schedules"
  ON public.scheduled_reports FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON public.scheduled_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON public.scheduled_reports FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON public.scheduled_reports FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_scheduled_reports_user ON public.scheduled_reports (user_id);
