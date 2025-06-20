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
  bio?: string;
  created_at?: string;
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

// Get user profile by clerk_user_id
export const getUserProfile = async (clerkUserId: string): Promise<UserProfile | null> => {
  console.log("Fetching user profile for:", clerkUserId);
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .single();
  
  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
  
  console.log("User profile fetched successfully:", data);
  return data;
};

// Update user profile
export const updateUserProfile = async (clerkUserId: string, updates: Partial<UserProfile>) => {
  console.log("Updating user profile for:", clerkUserId, "with:", updates);
  
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('clerk_user_id', clerkUserId)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
  
  console.log("User profile updated successfully:", data);
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

// Check if user has clapped on a post
export const hasUserClapped = async (clerkUserId: string, postId: string): Promise<boolean> => {
  console.log("Checking if user clapped:", clerkUserId, postId);
  
  const { data, error } = await supabase
    .from('user_claps')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .eq('post_id', postId)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error("Error checking user clap:", error);
    return false;
  }
  
  return !!data;
};

// Add a clap to a post
export const addClap = async (clerkUserId: string, postId: string) => {
  console.log("Adding clap:", clerkUserId, postId);
  
  // First check if user already clapped
  const alreadyClapped = await hasUserClapped(clerkUserId, postId);
  if (alreadyClapped) {
    throw new Error("User has already clapped this post");
  }
  
  // Add the clap record
  const { error: clapError } = await supabase
    .from('user_claps')
    .insert({
      clerk_user_id: clerkUserId,
      post_id: postId
    });
  
  if (clapError) {
    console.error("Error adding clap:", clapError);
    throw clapError;
  }
  
  // Increment the clap count using RPC call
  const { data, error } = await supabase.rpc('increment_clap_count', {
    post_id: postId
  });
  
  if (error) {
    console.error("Error updating clap count:", error);
    throw error;
  }
  
  console.log("Clap added successfully");
  return data;
};

// Upload image to storage
export const uploadImage = async (file: File, fileName: string, bucket: string = 'post-images') => {
  console.log("Uploading image:", fileName, "to bucket:", bucket);
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  console.log("Image uploaded successfully, public URL:", publicUrl);
  return publicUrl;
};

// Upload profile image
export const uploadProfileImage = async (file: File, clerkUserId: string) => {
  const fileName = `${clerkUserId}-${Date.now()}.${file.name.split('.').pop()}`;
  return uploadImage(file, fileName, 'profile-images');
};

// Legacy function for backward compatibility
export const updateClapCount = async (postId: string, newCount: number) => {
  console.log("Legacy updateClapCount called - this should not be used anymore");
  return null;
};
