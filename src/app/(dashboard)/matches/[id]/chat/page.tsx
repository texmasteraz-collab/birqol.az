
import { createClient } from "@/utils/supabase/server";
import { ChatWindow } from "@/components/features/ChatWindow";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function MatchChatPage({ params }: PageProps) {
    const { id } = await params;
    const matchId = id;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Verify match access and confirmed status
    // User must be team_creator_id or opponent_team_id via team ownership
    // Currently checking teams is complex in one query without join knowledge of auth.
    // Simplest: Fetch match, get team IDs, compare with user owned team.

    const { data: match } = await supabase
        .from('matches')
        .select('status, team_creator_id, opponent_team_id')
        .eq('id', matchId)
        .single();

    if (!match) {
        redirect('/find-opponent');
    }

    // Check if user owns one of the teams
    const { data: userTeam } = await supabase
        .from('teams')
        .select('id')
        .eq('owner_id', user.id)
        .single();

    if (!userTeam) redirect('/my-team/create');

    const isParticipant = userTeam.id === match.team_creator_id || userTeam.id === match.opponent_team_id;

    if (!isParticipant) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-6xl text-slate-300">lock</span>
                    <h2 className="text-2xl font-bold">Access Denied</h2>
                    <p className="text-slate-500">You are not a participant in this match.</p>
                </div>
            </div>
        )
    }

    if (match.status !== 'confirmed') {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-6xl text-slate-300">hourglass_empty</span>
                    <h2 className="text-2xl font-bold">Chat Locked</h2>
                    <p className="text-slate-500">Chat will open once the match is confirmed.</p>
                </div>
            </div>
        )
    }

    // Fetch initial messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
            <div className="flex items-center justify-between shrink-0">
                <h1 className="text-2xl font-bold tracking-tight">Match Coordination</h1>
                <div className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span> Confirmed
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ChatWindow
                    matchId={matchId}
                    currentUserId={user.id}
                    initialMessages={messages || []}
                />
            </div>
        </div>
    )
}
