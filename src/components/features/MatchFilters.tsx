
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const FILTERS = {
    format: [
        { label: 'Any Format', value: '' },
        { label: '5x5', value: '5x5' },
        { label: '6x6', value: '6x6' },
        { label: '7x7', value: '7x7' },
        { label: '8x8', value: '8x8' },
        { label: '11x11', value: '11x11' },
    ],
    date: [
        { label: 'Any Date', value: '' },
        { label: 'Today', value: 'today' },
        { label: 'Tomorrow', value: 'tomorrow' },
        { label: 'This Week', value: 'week' },
    ],
    district: [
        { label: 'Any District', value: '' },
        { label: 'Baku', value: 'Baku' },
        { label: 'Sumgait', value: 'Sumgait' },
        { label: 'Ganja', value: 'Ganja' },
    ],
    skill: [
        { label: 'Any Skill', value: '' },
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Amateur', value: 'Amateur' },
        { label: 'Semi-Pro', value: 'Semi-Pro' },
        { label: 'Professional', value: 'Professional' },
    ]
}

export function MatchFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    const handleFilterChange = (name: string, value: string) => {
        router.push('?' + createQueryString(name, value))
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Format Filter */}
            <select
                aria-label="Filter by Match Format"
                className="p-3 bg-slate-200 dark:bg-surface-dark rounded-xl border border-transparent hover:border-primary/50 cursor-pointer appearance-none font-semibold text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={searchParams.get('format') || ''}
                onChange={(e) => handleFilterChange('format', e.target.value)}
            >
                {FILTERS.format.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* Date Filter */}
            <select
                aria-label="Filter by Date"
                className="p-3 bg-slate-200 dark:bg-surface-dark rounded-xl border border-transparent hover:border-primary/50 cursor-pointer appearance-none font-semibold text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={searchParams.get('date') || ''}
                onChange={(e) => handleFilterChange('date', e.target.value)}
            >
                {FILTERS.date.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* District Filter */}
            <select
                aria-label="Filter by District"
                className="p-3 bg-slate-200 dark:bg-surface-dark rounded-xl border border-transparent hover:border-primary/50 cursor-pointer appearance-none font-semibold text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={searchParams.get('district') || ''}
                onChange={(e) => handleFilterChange('district', e.target.value)}
            >
                {FILTERS.district.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>

            {/* Skill Filter */}
            <select
                aria-label="Filter by Skill Level"
                className="p-3 bg-slate-200 dark:bg-surface-dark rounded-xl border border-transparent hover:border-primary/50 cursor-pointer appearance-none font-semibold text-sm outline-none focus:ring-2 focus:ring-primary/50"
                value={searchParams.get('skill') || ''}
                onChange={(e) => handleFilterChange('skill', e.target.value)}
            >
                {FILTERS.skill.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}
