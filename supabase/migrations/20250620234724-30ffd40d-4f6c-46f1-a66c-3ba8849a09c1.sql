
-- Create user_claps table to track which users clapped on which posts (prevents multiple claps)
CREATE TABLE public.user_claps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(clerk_user_id, post_id)
);

-- Enable RLS on user_claps table
ALTER TABLE public.user_claps ENABLE ROW LEVEL SECURITY;

-- Create policies for user_claps
CREATE POLICY "Anyone can view claps" 
  ON public.user_claps 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create claps" 
  ON public.user_claps 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Add bio field to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN bio TEXT;

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true);

-- Storage policies for profile images
CREATE POLICY "Anyone can view profile images" 
  ON storage.objects 
  FOR SELECT 
  TO anon, authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Anyone can upload profile images" 
  ON storage.objects 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Anyone can update profile images" 
  ON storage.objects 
  FOR UPDATE 
  TO anon, authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Anyone can delete profile images" 
  ON storage.objects 
  FOR DELETE 
  TO anon, authenticated
  USING (bucket_id = 'profile-images');

-- Create function to get user clap status for a post
CREATE OR REPLACE FUNCTION public.has_user_clapped(user_id TEXT, post_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_claps 
    WHERE clerk_user_id = user_id AND post_id = has_user_clapped.post_id
  );
$$;

-- Enable realtime for user_claps
ALTER TABLE public.user_claps REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_claps;
