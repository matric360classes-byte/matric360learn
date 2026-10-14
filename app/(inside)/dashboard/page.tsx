import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    // middleware will redirect, but safety
    return null
  }
  return <DashboardClient user={user} />
}
