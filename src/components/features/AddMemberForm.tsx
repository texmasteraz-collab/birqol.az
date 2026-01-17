
'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { addTeamMember } from "@/app/(dashboard)/my-team/actions"
import { useState } from "react"

export function AddMemberForm({ teamId }: { teamId: string }) {
    const [status, setStatus] = useState<{ error?: string, success?: string } | null>(null)

    async function handleSubmit(formData: FormData) {
        setStatus(null)
        const result = await addTeamMember(formData)
        if (result.error) {
            setStatus({ error: result.error })
        } else if (result.success) {
            setStatus({ success: result.success })
            // Optional: reset form
            const form = document.getElementById('add-member-form') as HTMLFormElement
            form?.reset()
        }
    }

    return (
        <form id="add-member-form" action={handleSubmit} className="flex gap-2 items-start">
            <input type="hidden" name="teamId" value={teamId} />
            <div className="flex-1 space-y-1">
                <Input
                    name="phone"
                    placeholder="+994 50 123 45 67"
                    required
                    pattern="^\+?[0-9\s]+$"
                />
                {status?.error && <p className="text-xs text-red-500 font-bold ml-1">{status.error}</p>}
                {status?.success && <p className="text-xs text-green-500 font-bold ml-1">{status.success}</p>}
            </div>
            <Button type="submit">
                <span className="material-symbols-outlined mr-2">person_add</span> Add
            </Button>
        </form>
    )
}
