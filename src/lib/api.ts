
import { supabase } from "@/integrations/supabase/client";

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  clap_count: number;
  created_at: string;
  user_name: string;
  clerk_user_id: string;
  user_profiles?: {
    profile_image_url?: string;
  };
}

export interface UserProfile {
  clerk_user_id: string;
  name: string;
  email: string;
  profile_image_url?: string;
}

// Create or update user profile
export const upsertUserProfile = async (profile: UserProfile) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile, { onConflict: 'clerk_user_id' });
  
  if (error) throw error;
  return data;
};

// Create a new post
export const createPost = async (postData: {
  content: string;
  image_url?: string;
  clerk_user_id: string;
  user_name: string;
}) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(postData)
    .select(`
      *,
      user_profiles!posts_clerk_user_id_fkey (
        profile_image_url
      )
    `)
    .single();
  
  if (error) throw error;
  return data;
};

// Fetch all posts
export const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user_profiles!posts_clerk_user_id_fkey (
        profile_image_url
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Update clap count
export const updateClapCount = async (postId: string, newCount: number) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ clap_count: newCount })
    .eq('id', postId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Upload image to storage
export const uploadImage = async (file: File, fileName: string) => {
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(fileName, file);
  
  if (error) throw error;
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(fileName);
  
  return publicUrl;
};
