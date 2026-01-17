
import { createClient } from './server'
import { cache } from 'react'
import { User } from '@supabase/supabase-js'

export const getUser = cache(async (): Promise<User | null> => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
})
