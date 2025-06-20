
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";

export default async function Profile() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/");
  }
  
  return <ProfilePage />;
}
