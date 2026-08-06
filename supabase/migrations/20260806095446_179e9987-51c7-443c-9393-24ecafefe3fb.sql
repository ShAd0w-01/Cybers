CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  sector text NOT NULL DEFAULT '',
  title text NOT NULL,
  challenge text NOT NULL DEFAULT '',
  approach text[] NOT NULL DEFAULT '{}',
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  outcome text NOT NULL DEFAULT '',
  services jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'published',
  sort_order integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published case studies are public"
  ON public.case_studies FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can read all case studies"
  ON public.case_studies FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert case studies"
  ON public.case_studies FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update case studies"
  ON public.case_studies FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete case studies"
  ON public.case_studies FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.case_studies (slug, sector, title, challenge, approach, metrics, outcome, services, status, sort_order) VALUES
('saas-soc2-readiness', 'SaaS platform, 180 employees', 'Cleared enterprise security review and reached SOC 2 readiness in one quarter',
 'Two enterprise deals were blocked pending an assurance report and answers to a 240-question security review.',
 ARRAY['Application, API and cloud assessment of the production platform','Control design against the Trust Services Criteria','Evidence automation for access, change and monitoring','Questionnaire response library owned by the sales engineering team'],
 '[{"value":"94%","label":"Critical and high findings closed"},{"value":"11 wks","label":"To audit-ready evidence"},{"value":"2","label":"Blocked enterprise deals unblocked"}]'::jsonb,
 'The platform entered its SOC 2 observation window with a documented control set and a repeatable release-aligned testing cadence.',
 '[{"title":"SOC 2 Compliance Assistance","url":"/services/soc-2-compliance-assistance"},{"title":"Cloud Security Assessment","url":"/services/cloud-security-assessment"}]'::jsonb,
 'published', 10),
('bfsi-regulatory-resilience', 'Regulated financial intermediary', 'Closed regulatory gaps and rehearsed a six-hour incident reporting path',
 'Supervisory expectations had tightened while incident escalation still depended on informal contact between teams.',
 ARRAY['Gap assessment against the applicable regulatory directions','VAPT across customer channels, APIs and internal networks','Third-party tiering with evidence collection for critical providers','Tabletop exercise covering detection, escalation and reporting'],
 '[{"value":"100%","label":"Critical systems in tested scope"},{"value":"5.5 hrs","label":"Rehearsed reporting time"},{"value":"38","label":"Vendors risk-tiered"}]'::jsonb,
 'Leadership gained a single risk register mapped to regulatory clauses, with named owners and a quarterly review rhythm.',
 '[{"title":"BFSI Regulatory Compliance","url":"/services/bfsi-regulatory-compliance"},{"title":"Third-Party Risk Management","url":"/services/third-party-risk-management"}]'::jsonb,
 'published', 20),
('logistics-resilience-program', 'Logistics network across three countries', 'Reduced external attack surface and proved recovery for time-critical operations',
 'Booking and documentation platforms were reachable by more than a hundred partners with inconsistent controls and untested backups.',
 ARRAY['Critical service and dependency mapping across sites','External attack-surface testing on portals and integrations','Segmentation and access hardening for partner connectivity','Recovery exercise against a ransomware disruption scenario'],
 '[{"value":"61%","label":"Internet-facing surface reduced"},{"value":"4 hrs","label":"Validated recovery objective"},{"value":"0","label":"Critical findings left open at retest"}]'::jsonb,
 'Operations leaders now hold documented manual fallbacks and a prioritised improvement plan tied to service impact.',
 '[{"title":"Network & Infrastructure VAPT","url":"/services/network-infrastructure-vapt"},{"title":"ISO 22301 Business Continuity","url":"/services/iso-22301-business-continuity"}]'::jsonb,
 'published', 30);