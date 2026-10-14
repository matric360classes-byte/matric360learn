import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Always fresh from Google, not from old profiles table
  const displayName = user?.user_metadata?.full_name ||
                      user?.user_metadata?.name ||
                      user?.email?.split('@')[0] ||
                      'there'

  // Pass to client
  return <DashboardClient user={user} displayName={displayName} />
}
