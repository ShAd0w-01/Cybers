CREATE TABLE public.site_theme (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active boolean NOT NULL DEFAULT true,
  heading_font text NOT NULL DEFAULT 'Sora',
  body_font text NOT NULL DEFAULT 'Manrope',
  base_font_size numeric NOT NULL DEFAULT 16,
  heading_scale numeric NOT NULL DEFAULT 1,
  color_ink text NOT NULL DEFAULT '#12121b',
  color_magenta text NOT NULL DEFAULT '#d63bab',
  color_coral text NOT NULL DEFAULT '#f2603f',
  color_coral_ink text NOT NULL DEFAULT '#c33a25',
  color_amber text NOT NULL DEFAULT '#f0a441',
  color_surface text NOT NULL DEFAULT '#f7f7f8',
  color_background text NOT NULL DEFAULT '#ffffff',
  color_foreground text NOT NULL DEFAULT '#1c1c26',
  color_muted_foreground text NOT NULL DEFAULT '#5f5f6b',
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_theme TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_theme TO authenticated;
GRANT ALL ON public.site_theme TO service_role;

ALTER TABLE public.site_theme ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read the active theme"
  ON public.site_theme FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can read all themes"
  ON public.site_theme FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert themes"
  ON public.site_theme FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update themes"
  ON public.site_theme FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete themes"
  ON public.site_theme FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_theme_updated_at
  BEFORE UPDATE ON public.site_theme
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_theme (is_active) VALUES (true);