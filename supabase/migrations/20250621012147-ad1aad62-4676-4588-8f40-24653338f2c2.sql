
-- Fix the increment_clap_count function by setting a secure search_path
CREATE OR REPLACE FUNCTION public.increment_clap_count(post_id uuid)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path = public
AS $function$
  update posts
  set clap_count = clap_count + 1
  where id = post_id;
$function$;

-- Fix the has_user_clapped function by setting a secure search_path
CREATE OR REPLACE FUNCTION public.has_user_clapped(user_id text, post_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_claps 
    WHERE clerk_user_id = user_id AND post_id = has_user_clapped.post_id
  );
$function$;
