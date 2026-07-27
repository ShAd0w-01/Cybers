-- 1. Restrict SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Callers may only probe their own roles; privileged server contexts may check anyone.
  IF auth.uid() IS NOT NULL AND _user_id IS DISTINCT FROM auth.uid() THEN
    RETURN false;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 2. Replace always-true INSERT policy on crm_leads with a validated one
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.crm_leads;

CREATE POLICY "Public can submit a validated lead"
ON public.crm_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 200
  AND length(btrim(email)) BETWEEN 3 AND 320
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 40)
  AND (company IS NULL OR length(company) <= 200)
  AND length(message) <= 5000
  AND (service_interest IS NULL OR length(service_interest) <= 200)
  AND status = 'new'
  AND priority = 'medium'
  AND assigned_to IS NULL
  AND estimated_value IS NULL
  AND next_follow_up IS NULL
);
