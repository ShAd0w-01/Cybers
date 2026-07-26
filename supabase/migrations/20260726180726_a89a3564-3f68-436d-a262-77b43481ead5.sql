CREATE TABLE public.advisor_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New conversation',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.advisor_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.advisor_threads(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  parts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX advisor_threads_visitor_idx ON public.advisor_threads (visitor_id, updated_at DESC);
CREATE INDEX advisor_messages_thread_idx ON public.advisor_messages (thread_id, created_at);

GRANT ALL ON public.advisor_threads TO service_role;
GRANT ALL ON public.advisor_messages TO service_role;

ALTER TABLE public.advisor_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_messages ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated on purpose: browsers never touch these
-- tables directly. Every read and write goes through server code that scopes
-- the query to the caller's own visitor id.