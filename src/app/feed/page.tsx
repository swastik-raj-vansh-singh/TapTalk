
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedPage from "@/components/FeedPage";

export default async function Feed() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  
  return <FeedPage />;
}
