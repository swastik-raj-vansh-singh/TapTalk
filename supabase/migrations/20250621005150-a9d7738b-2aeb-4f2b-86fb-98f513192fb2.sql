
-- Create a table for post comments
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  clerk_user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to view comments
CREATE POLICY "Anyone can view comments" 
  ON public.post_comments 
  FOR SELECT 
  USING (true);

-- Create policy that allows authenticated users to create comments
CREATE POLICY "Authenticated users can create comments" 
  ON public.post_comments 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that allows users to update their own comments
CREATE POLICY "Users can update their own comments" 
  ON public.post_comments 
  FOR UPDATE 
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create policy that allows users to delete their own comments
CREATE POLICY "Users can delete their own comments" 
  ON public.post_comments 
  FOR DELETE 
  USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');
