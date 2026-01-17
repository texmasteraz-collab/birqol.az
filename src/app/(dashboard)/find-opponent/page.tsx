import { createClient } from "@/utils/supabase/server";
import { MatchCard } from "@/components/features/MatchCard";
import { MatchFilters } from "@/components/features/MatchFilters";
import Link from 'next/link';

interface RequestStatus {
    match_id: string;
    status: 'pending' | 'accepted' | 'declined';
}

interface PageProps {
    searchParams: Promise<{
        format?: string;
        date?: string;
        district?: string;
        skill?: string;
    }>;
}

export default async function FindOpponentPage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const params = await searchParams;
    const format = params.format;
    const date = params.date;
    const district = params.district;
    const skill = params.skill;

    // Build the query
    // We use !inner join to filter on related table columns if needed
    let query = supabase
        .from('matches')
        .select(`
            *,
            team:teams!team_creator_id!inner(name, avatar_url, skill_level, match_format)
        `)
        .eq('status', 'searching')
        .order('date', { ascending: true });

    // Apply Filters
    if (district) {
        query = query.eq('district', district);
    }

    if (format) {
        // match_format is in the teams table
        query = query.eq('team.match_format', format);
    }

    if (skill) {
        // skill_level is in the teams table
        query = query.eq('team.skill_level', skill);
    }

    if (date) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        if (date === 'today') {
            query = query.eq('date', todayStr);
        } else if (date === 'tomorrow') {
            const tmr = new Date(today);
            tmr.setDate(tmr.getDate() + 1);
            const tmrStr = tmr.toISOString().split('T')[0];
            query = query.eq('date', tmrStr);
        } else if (date === 'week') {
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            const nextWeekStr = nextWeek.toISOString().split('T')[0];
            query = query.gte('date', todayStr).lte('date', nextWeekStr);
        }
    }

    const { data: matches } = await query;

    // Fetch my team ID to check for requests
    let myRequests: RequestStatus[] = [];

    if (user) {
        const { data: team } = await supabase
            .from('teams')
            .select('id')
            .eq('owner_id', user.id)
            .single();

        if (team) {
            // Fetch my pending/active requests
            const { data: requests } = await supabase
                .from('match_requests')
                .select('match_id, status')
                .eq('requesting_team_id', team.id);

            if (requests) myRequests = requests as unknown as RequestStatus[];
        }
    }

    const hasMatches = matches && matches.length > 0;

    return (
        <div className="space-y-8">

            {/* Filter Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Active Match Requests</h1>
                <Link href="/matches/create" className="bg-primary text-background-dark font-black px-6 py-3 rounded-xl uppercase tracking-tight hover:scale-105 transition-transform flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span> Post Match
                </Link>
            </div>

            {/* Functional Filters */}
            <MatchFilters />

            {/* Matches Grid */}
            <div className="grid grid-cols-1 gap-6">
                {hasMatches ? (
                    matches.map((match) => {
                        const myRequest = myRequests.find(r => r.match_id === match.id);
                        return (
                            <MatchCard
                                key={match.id}
                                requestStatus={myRequest ? myRequest.status : null}
                                match={{
                                    id: match.id,
                                    team_name: match.team.name,
                                    team_avatar: match.team.avatar_url,
                                    skill_level: match.team.skill_level,
                                    match_format: match.team.match_format,
                                    district: match.district,
                                    date: match.date,
                                    time: match.time,
                                    field_type: match.field_type as 'paid' | 'free'
                                }}
                            />
                        )
                    })
                ) : (
                    <div className="text-center py-20 bg-slate-100 dark:bg-surface-dark/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-white/10">
                        <div className="size-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-3xl text-slate-400">search_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-500">No matches found</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mt-2">Try adjusting your filters or post a new match!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
