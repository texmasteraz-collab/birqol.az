import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { EditTeamForm } from './edit-team-form'

export default async function EditTeamPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', user.id)
        .single()

    if (!team) redirect('/my-team/create')

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit Team Profile</h1>
                <Link href="/my-team" className="text-sm font-medium text-slate-500 hover:text-primary">Cancel</Link>
            </div>

            <EditTeamForm team={team} />

        </div>
    )
}
