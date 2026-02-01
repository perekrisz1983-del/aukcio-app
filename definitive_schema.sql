-- Existing schema content...

-- Add new schema for Animals
CREATE TABLE IF NOT EXISTS public.animals (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    gender text NOT NULL CHECK (gender IN ('Kan', 'Szuka')),
    size text NOT NULL CHECK (size IN ('Kicsi', 'Közepes', 'Nagy')),
    age_category text NOT NULL CHECK (age_category IN ('Kölyök (0-1 év)', 'Felnőtt (1-8 év)', 'Idős (8+ év)')),
    image_url text,
    status text DEFAULT 'Gazdira vár'::text NOT NULL CHECK (status IN ('Gazdira vár', 'Lefoglalva', 'Gazdára talált')),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.animals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for animals table
DROP POLICY IF EXISTS "Public can read animals" ON public.animals;
CREATE POLICY "Public can read animals" ON public.animals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage animals" ON public.animals;
CREATE POLICY "Authenticated users can manage animals" ON public.animals FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create Storage Bucket for animal images
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-images', 'animal-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for animal-images bucket
DROP POLICY IF EXISTS "Public can view animal images" ON storage.objects;
CREATE POLICY "Public can view animal images" ON storage.objects FOR SELECT
USING ( bucket_id = 'animal-images' );

DROP POLICY IF EXISTS "Authenticated users can upload animal images" ON storage.objects;
CREATE POLICY "Authenticated users can upload animal images" ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'animal-images' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated users can update their own animal images" ON storage.objects;
CREATE POLICY "Authenticated users can update their own animal images" ON storage.objects FOR UPDATE
USING ( auth.uid() = owner AND bucket_id = 'animal-images' );

DROP POLICY IF EXISTS "Authenticated users can delete their own animal images" ON storage.objects;
CREATE POLICY "Authenticated users can delete their own animal images" ON storage.objects FOR DELETE
USING ( auth.uid() = owner AND bucket_id = 'animal-images' );