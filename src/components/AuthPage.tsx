
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TapTalk
            </span>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              <div className="flex justify-center">
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-primary hover:bg-primary/90",
                      card: "shadow-none border-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                    }
                  }}
                  fallbackRedirectUrl="/feed"
                  forceRedirectUrl="/feed"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="flex justify-center">
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-primary hover:bg-primary/90",
                      card: "shadow-none border-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                    }
                  }}
                  fallbackRedirectUrl="/feed"
                  forceRedirectUrl="/feed"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
