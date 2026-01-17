
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createMatch(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Get user's team
    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!team) {
        redirect('/my-team/create?message=You need a team to post a match')
    }

    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const district = formData.get('district') as string
    const format = formData.get('format') as string
    const field_type = formData.get('field_type') as string

    const { error } = await supabase.from('matches').insert({
        team_creator_id: team.id,
        date,
        time: `${time}:00`,
        district,
        format,
        field_type,
        status: 'searching'
    })

    if (error) {
        console.error("Create Match Error:", error)
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/find-opponent')
    redirect('/find-opponent')
}

export async function challengeMatch(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const matchId = formData.get('matchId') as string

    // Get user's team
    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!team) {
        redirect('/my-team/create')
    }

    const { error } = await supabase.from('match_requests').insert({
        match_id: matchId,
        requesting_team_id: team.id,
        status: 'pending'
    })

    if (error) {
        console.error("Challenge Match Error:", error)
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/find-opponent')
}

export async function updateMatch(formData: FormData) {
    const supabase = await createClient()
    const matchId = formData.get('matchId') as string

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const district = formData.get('district') as string
    const format = formData.get('format') as string
    const field_type = formData.get('field_type') as string

    // RLS will handle ownership check, but good to be safe
    const { error, count } = await supabase
        .from('matches')
        .update({
            date,
            time: `${time}:00`,
            district,
            format,
            field_type
        }, { count: 'exact' })
        .eq('id', matchId)

    if (error) {
        console.error("Update Match Error:", error)
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    if (count === 0) {
        redirect(`/error?message=Update Failed: Permission Denied (Not Owner) or Match Not Found`)
    }

    revalidatePath('/matches/manage')
    redirect('/matches/manage')
}
