
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { acceptRequest, declineRequest, deleteMatch } from "@/app/(dashboard)/matches/manage/actions";
import Image from "next/image";

interface MatchRequest {
    id: string;
    status: 'pending' | 'accepted' | 'declined';
    created_at: string;
    team: {
        name: string;
        skill_level: string;
        avatar_url: string | null;
    };
}

export default async function ManageMatchesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get user's team
    const { data: team } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user?.id)
        .single();

    if (!team) {
        return <div>You need a team to manage matches.</div>
    }

    // Fetch matches involved with my team (created OR opponent)
    const { data: myMatches } = await supabase
        .from('matches')
        .select(`
      *,
      requests:match_requests(
        id, 
        status, 
        created_at,
        team:requesting_team_id(name, skill_level, avatar_url)
      )
    `)
        .or(`team_creator_id.eq.${team.id},opponent_team_id.eq.${team.id}`)
        .order('date', { ascending: false });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Manage Matches</h1>

            <div className="space-y-6">
                {myMatches?.map((match) => (
                    <div key={match.id} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex flex-col md:flex-row justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-lg">
                                        Match on {new Date(match.date).toLocaleDateString()} at {match.time.slice(0, 5)}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${match.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {match.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">{match.district} • {match.format} • {match.field_type}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {match.status === 'confirmed' && (
                                    <Link href={`/matches/${match.id}/chat`}>
                                        <Button size="sm" variant="secondary"><span className="material-symbols-outlined mr-2">chat</span> Open Chat</Button>
                                    </Link>
                                )}

                                <Link href={`/matches/${match.id}/edit`}>
                                    <Button size="sm" variant="ghost" className="text-slate-500 hover:text-slate-700">
                                        <span className="material-symbols-outlined">edit</span>
                                    </Button>
                                </Link>

                                <form action={deleteMatch}>
                                    <input type="hidden" name="matchId" value={match.id} />
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" type="submit">
                                        <span className="material-symbols-outlined">delete</span>
                                    </Button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Requests & Opponents</h4>

                            {(() => {
                                const requests = match.requests || [];
                                const visibleRequests = requests.filter((r: MatchRequest) => r.status !== 'declined');

                                return visibleRequests.length > 0 ? (
                                    <div className="grid gap-3">
                                        {visibleRequests.map((req: MatchRequest) => (
                                            <div key={req.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-black/20 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative size-10 rounded-full bg-slate-300 overflow-hidden">
                                                        {req.team.avatar_url ? (
                                                            <Image
                                                                src={req.team.avatar_url}
                                                                alt={req.team.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <span className="flex items-center justify-center w-full h-full material-symbols-outlined text-gray-500">groups</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{req.team.name}</p>
                                                        <p className="text-xs text-slate-500">{req.team.skill_level}</p>
                                                    </div>
                                                </div>

                                                {req.status === 'pending' && match.status !== 'confirmed' && (
                                                    <div className="flex gap-2">
                                                        <form action={acceptRequest}>
                                                            <input type="hidden" name="requestId" value={req.id} />
                                                            <input type="hidden" name="matchId" value={match.id} />
                                                            <Button size="sm" type="submit">Accept</Button>
                                                        </form>
                                                        <form action={declineRequest}>
                                                            <input type="hidden" name="requestId" value={req.id} />
                                                            <Button size="sm" variant="ghost" type="submit">Decline</Button>
                                                        </form>
                                                    </div>
                                                )}

                                                {req.status === 'accepted' && (
                                                    <span className="text-green-600 text-xs font-bold uppercase">Accepted Opponent</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No pending requests.</p>
                                );
                            })()}
                        </div>
                    </div>
                ))}

                {(!myMatches || myMatches.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">You haven&apos;t posted any matches yet.</p>
                        <Link href="/matches/create" className="text-primary font-bold hover:underline mt-2 inline-block">Post a Match</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
