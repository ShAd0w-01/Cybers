CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

ALTER TABLE public.advisor_threads
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN topics TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN outcome TEXT NOT NULL DEFAULT 'open'
    CHECK (outcome IN ('open', 'answered', 'scoped', 'handoff')),
  ADD COLUMN handoff_at TIMESTAMPTZ;

CREATE INDEX advisor_threads_user_idx ON public.advisor_threads (user_id, updated_at DESC);
CREATE INDEX advisor_threads_outcome_idx ON public.advisor_threads (outcome, created_at DESC);

CREATE TABLE public.advisor_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES public.advisor_threads(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX advisor_events_type_idx ON public.advisor_events (type, created_at DESC);
CREATE INDEX advisor_events_visitor_idx ON public.advisor_events (visitor_id, created_at DESC);

GRANT ALL ON public.advisor_events TO service_role;

ALTER TABLE public.advisor_events ENABLE ROW LEVEL SECURITY;
-- No browser-facing policies on purpose: advisor data is only reachable
-- through server code that scopes reads to the owning visitor or an admin.