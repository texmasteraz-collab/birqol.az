
'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTeam(prevState: ActionState, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const name = formData.get('name') as string
    const city = formData.get('city') as string
    const district = formData.get('district') as string
    const skill_level = formData.get('skill_level') as string
    const match_format = formData.get('match_format') as string
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('teams')
        .insert({
            name,
            city,
            district,
            skill_level,
            match_format,
            description,
            owner_id: user.id
        })

    if (error) {
        console.error('Create Team Error:', error)
        return { error: error.message }
    }

    revalidatePath('/my-team')
    redirect('/my-team')
}


type ActionState = {
    error?: string
    success?: string
}

export async function updateTeam(prevState: ActionState, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const teamId = formData.get('teamId') as string
    const name = formData.get('name') as string
    const city = formData.get('city') as string
    const district = formData.get('district') as string
    const skill_level = formData.get('skill_level') as string
    const match_format = formData.get('match_format') as string
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('teams')
        .update({
            name,
            city,
            district,
            skill_level,
            match_format,
            description,
        })
        .eq('id', teamId)
        .eq('owner_id', user.id)

    if (error) {
        console.error('Update Team Error:', error)
        return { error: error.message }
    }

    revalidatePath('/my-team')
    redirect('/my-team')
}

export async function addTeamMember(formData: FormData) {
    const supabase = await createClient()
    const phone = formData.get('phone') as string
    const teamId = formData.get('teamId') as string

    if (!phone || !teamId) {
        return { error: "Phone number is required" }
    }

    try {
        // 1. Find the user by phone number
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, name')
            .eq('phone', phone)
            .single()

        if (userError || !user) {
            return { error: "User not found. They must register first." }
        }

        // 2. Add to team_members
        const { error: insertError } = await supabase
            .from('team_members')
            .insert({
                team_id: teamId,
                user_id: user.id,
                role: 'member'
            })

        if (insertError) {
            if (insertError.code === '23505') { // Unique violation
                return { error: "Player is already in this team." }
            }
            console.error("Add Member Error:", insertError)
            return { error: "Failed to add player. Please try again." }
        }

        revalidatePath('/my-team')
        return { success: `Added ${user.name || 'player'} to the team!` }

    } catch {
        return { error: "Unexpected error occurred." }
    }
}

export async function removeTeamMember(formData: FormData) {
    const supabase = await createClient()
    const memberId = formData.get('memberId') as string

    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)

    if (error) {
        console.error("Remove Member Error:", error)
        return { error: "Failed to remove player." }
    }

    revalidatePath('/my-team')
    return { success: "Player removed." }
}
