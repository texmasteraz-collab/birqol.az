
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/error')
    }

    // Self-healing: Ensure public profile exists
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile } = await supabase.from('users').select('id').eq('id', user.id).single()

        if (!profile) {
            console.log('Profile missing, creating fallback profile...')
            const { error: profileError } = await supabase.from('users').insert({
                id: user.id,
                name: user.user_metadata.name || email.split('@')[0],
                phone: user.user_metadata.phone,
                role: user.user_metadata.role || 'player'
            })

            if (profileError) {
                console.error('Failed to create fallback profile:', profileError)
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const role = formData.get('role') as string

    console.log("Attempting signup for:", email)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                phone,
                role,
            },
        },
    })

    if (error) {
        console.error("Signup Auth Error:", error)
        redirect(`/error?message=${encodeURIComponent(error.message)}`)
    }

    if (data.user) {
        console.log("Auth user created:", data.user.id)

        // Manual Profile Creation (Backup for missing triggers)
        const { error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            name: name,
            phone: phone,
            role: role
        })

        if (profileError) {
            console.error("Manual Profile Creation Error:", profileError)
            // Check if it's just a duplicate key error (which means trigger worked)
            if (!profileError.message.includes('duplicate key')) {
                // If it's a real error, we might want to show it, or just let login handle it
                console.log("Ignoring profile error assuming trigger might have fired or login will self-heal.")
            }
        } else {
            console.log("Manual profile created successfully.")
        }
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=Account created! Please sign in.')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
