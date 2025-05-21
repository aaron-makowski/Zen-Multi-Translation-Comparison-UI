import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ProfileForm } from "@/components/profile/profile-form"
import { PasswordForm } from "@/components/profile/password-form"

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?return_to=/profile/settings")
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link href="/profile" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft size={16} className="mr-1" /> Back to Profile
        </Link>
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileForm user={user} />
          </TabsContent>

          <TabsContent value="password" className="mt-6">
            <PasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
