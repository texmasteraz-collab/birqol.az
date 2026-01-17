'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface MatchFormProps {
    action: (formData: FormData) => Promise<void>
    initialData?: {
        date: string
        time: string
        district: string
        format: string
        field_type: string
    },
    children?: React.ReactNode
}

export function MatchForm({ action, initialData, children }: MatchFormProps) {
    return (
        <form action={action} className="space-y-6">
            {children}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold">Date</label>
                    <Input name="date" type="date" required defaultValue={initialData?.date} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold">Time</label>
                    <Input name="time" type="time" required defaultValue={initialData?.time} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold">District / Preferred Location</label>
                <Input name="district" required placeholder="e.g. Yasamal, Downtown" defaultValue={initialData?.district} />
            </div>

            <div className="space-y-2">
                <label htmlFor="format" className="text-sm font-bold">Format</label>
                <select id="format" name="format" className="w-full bg-slate-200 dark:bg-surface-dark rounded-lg p-2.5" required defaultValue={initialData?.format}>
                    <option value="5x5">5x5</option>
                    <option value="6x6">6x6</option>
                    <option value="7x7">7x7</option>
                    <option value="11x11">11x11</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="field_type" className="text-sm font-bold">Field Type</label>
                <select id="field_type" name="field_type" className="w-full bg-slate-200 dark:bg-surface-dark rounded-lg p-2.5" required defaultValue={initialData?.field_type}>
                    <option value="paid">Paid (Splitting Cost)</option>
                    <option value="free">Free / Already Booked</option>
                </select>
            </div>

            <div className="pt-4">
                <Button type="submit" size="lg" className="w-full">
                    {initialData ? 'Update Match' : 'Post Request'}
                </Button>
            </div>
        </form>
    )
}
