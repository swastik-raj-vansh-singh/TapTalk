
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
  console.log("Upserting user profile:", profile);
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile, { onConflict: 'clerk_user_id' });
  
  if (error) {
    console.error("Error upserting user profile:", error);
    throw error;
  }
  console.log("User profile upserted successfully:", data);
  return data;
};

// Create a new post
export const createPost = async (postData: {
  content: string;
  image_url?: string;
  clerk_user_id: string;
  user_name: string;
}) => {
  console.log("Creating post with data:", postData);
  
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
  
  if (error) {
    console.error("Error creating post:", error);
    throw error;
  }
  
  console.log("Post created successfully:", data);
  return data;
};

// Fetch all posts
export const fetchPosts = async (): Promise<Post[]> => {
  console.log("Fetching posts...");
  
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      user_profiles!posts_clerk_user_id_fkey (
        profile_image_url
      )
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
  
  console.log("Posts fetched successfully:", data);
  return data || [];
};

// Update clap count
export const updateClapCount = async (postId: string, newCount: number) => {
  console.log("Updating clap count for post:", postId, "to:", newCount);
  
  const { data, error } = await supabase
    .from('posts')
    .update({ clap_count: newCount })
    .eq('id', postId)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating clap count:", error);
    throw error;
  }
  
  console.log("Clap count updated successfully:", data);
  return data;
};

// Upload image to storage
export const uploadImage = async (file: File, fileName: string) => {
  console.log("Uploading image:", fileName);
  
  const { data, error } = await supabase.storage
    .from('post-images')
    .upload(fileName, file);
  
  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('post-images')
    .getPublicUrl(fileName);
  
  console.log("Image uploaded successfully, public URL:", publicUrl);
  return publicUrl;
};
