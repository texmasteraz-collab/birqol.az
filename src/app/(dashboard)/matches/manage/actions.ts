
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function acceptRequest(formData: FormData) {
    const supabase = await createClient()
    const requestId = formData.get('requestId') as string
    const matchId = formData.get('matchId') as string

    // 1. Update request status to accepted
    const { error: reqError } = await supabase
        .from('match_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)

    if (reqError) {
        console.error(reqError)
        return
    }

    // 2. Update match status to confirmed and set opponent_team_id
    // We need to fetch the team ID from the request first
    const { data: req } = await supabase
        .from('match_requests')
        .select('requesting_team_id')
        .eq('id', requestId)
        .single()

    if (req) {
        console.log(`[Accept] Linking opponent ${req.requesting_team_id} to match ${matchId}`);
        const { error: matchError } = await supabase
            .from('matches')
            .update({
                status: 'confirmed',
                opponent_team_id: req.requesting_team_id
            })
            .eq('id', matchId)

        if (matchError) {
            console.error("[Accept] Match Update Error:", matchError);
            // Revert request status if match update fails? For now just log.
        } else {
            console.log("[Accept] Success");
        }

        // Optionally decline other pending requests for this match?
        // leaving for future refinement
    } else {
        console.error("[Accept] Could not find request", requestId);
    }

    revalidatePath('/matches/manage')
}

export async function declineRequest(formData: FormData) {
    const supabase = await createClient()
    const requestId = formData.get('requestId') as string

    await supabase
        .from('match_requests')
        .update({ status: 'declined' })
        .eq('id', requestId)

    revalidatePath('/matches/manage')
}

export async function deleteMatch(formData: FormData) {
    const supabase = await createClient()
    const matchId = formData.get('matchId') as string

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
        return
    }

    console.log(`[Delete] Attempting to delete match ${matchId} by user ${user.id}`);

    // Perform delete and return count to verify if it actually happened
    const { error, count } = await supabase
        .from('matches')
        .delete({ count: 'exact' })
        .eq('id', matchId)

    if (error) {
        console.error("Delete Match Error:", error)
        redirect(`/error?message=Database Error: ${encodeURIComponent(error.message)}`)
    }

    // If count is 0, it means RLS blocked it or match doesn't exist
    if (count === 0) {
        console.error("Delete Match Failed: Permission Denied or Not Found")
        // Check if match exists at all
        const { data: match } = await supabase.from('matches').select('team_creator_id').eq('id', matchId).single();
        if (match) {
            redirect(`/error?message=Permission Denied. You are not the owner of this match.`)
        } else {
            redirect(`/error?message=Match not found.`)
        }
    }

    console.log("[Delete] Success");
    revalidatePath('/matches/manage')
}
