
-- Create user_profiles table to store Clerk user data
CREATE TABLE public.user_profiles (
  clerk_user_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table with all required fields
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_user_id TEXT NOT NULL REFERENCES public.user_profiles(clerk_user_id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  clap_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view all profiles" 
  ON public.user_profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (clerk_user_id = auth.jwt() ->> 'sub');

-- RLS policies for posts
CREATE POLICY "Anyone can view posts" 
  ON public.posts 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can create their own posts" 
  ON public.posts 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (clerk_user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update clap count on any post" 
  ON public.posts 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true);

-- Storage policies for post images
CREATE POLICY "Anyone can view post images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'post-images');

CREATE POLICY "Authenticated users can upload post images" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'post-images');

-- Enable realtime for posts
ALTER TABLE public.posts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
