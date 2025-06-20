
-- Drop existing policies first, then recreate them
DROP POLICY IF EXISTS "Anyone can view user profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can view post images" ON storage.objects;

-- Add SELECT policies for the tables
CREATE POLICY "Anyone can view user profiles" 
  ON public.user_profiles 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view posts" 
  ON public.posts 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

-- Add storage policies for viewing files
CREATE POLICY "Anyone can view post images" 
  ON storage.objects 
  FOR SELECT 
  TO anon, authenticated
  USING (bucket_id = 'post-images');
