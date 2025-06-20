
-- Update RLS policies to work with anon key access for now
-- We'll remove the auth.jwt() checks since you're using Clerk

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can create their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update clap count on any post" ON public.posts;

-- Create more permissive policies for anon users
CREATE POLICY "Anyone can insert user profiles" 
  ON public.user_profiles 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update user profiles" 
  ON public.user_profiles 
  FOR UPDATE 
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create posts" 
  ON public.posts 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts" 
  ON public.posts 
  FOR UPDATE 
  TO anon, authenticated
  USING (true);

-- Update storage policies for anon access
DROP POLICY IF EXISTS "Authenticated users can upload post images" ON storage.objects;

CREATE POLICY "Anyone can upload post images" 
  ON storage.objects 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (bucket_id = 'post-images');
