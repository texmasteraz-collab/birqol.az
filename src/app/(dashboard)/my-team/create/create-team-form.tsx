'use client'

import { createTeam } from '../actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useActionState } from 'react'

const initialState = {
    error: '',
}

export function CreateTeamForm() {
    const [state, formAction, isPending] = useActionState(createTeam, initialState)

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold">Team Name</label>
                    <Input id="name" name="name" required placeholder="e.g. Yasamal Lions" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="city" className="text-sm font-bold">City</label>
                        <select id="city" name="city" className="w-full bg-slate-200 dark:bg-surface-dark rounded-lg p-2.5" required>
                            <option value="Baku">Baku</option>
                            <option value="Sumgait">Sumgait</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="district" className="text-sm font-bold">District</label>
                        <Input id="district" name="district" required placeholder="e.g. Yasamal" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="skill_level" className="text-sm font-bold">Skill Level</label>
                        <select id="skill_level" name="skill_level" className="w-full bg-slate-200 dark:bg-surface-dark rounded-lg p-2.5" required>
                            <option value="Amateur">Amateur</option>
                            <option value="Semi-Pro">Semi-Pro</option>
                            <option value="Professional">Professional</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="match_format" className="text-sm font-bold">Preferred Format</label>
                        <select id="match_format" name="match_format" className="w-full bg-slate-200 dark:bg-surface-dark rounded-lg p-2.5" required>
                            <option value="5x5">5x5</option>
                            <option value="6x6">6x6</option>
                            <option value="7x7">7x7</option>
                            <option value="11x11">11x11</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-bold">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="w-full bg-slate-200 dark:bg-surface-dark rounded-lg p-3 min-h-[100px]"
                        placeholder="Tell us about your team style..."
                    />
                </div>

                {state?.error && (
                    <div className="text-red-500 text-sm font-medium">
                        {state.error}
                    </div>
                )}
            </div>

            <div className="pt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isPending}>
                    {isPending ? 'Creating...' : 'Create Team Profile'}
                </Button>
            </div>
        </form>
    )
}
