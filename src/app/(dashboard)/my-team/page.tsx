import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { removeTeamMember } from "@/app/(dashboard)/my-team/actions";
import { AddMemberForm } from "@/components/features/AddMemberForm";
import { getUser } from "@/utils/supabase/user";

interface TeamMember {
    id: string;
    role: string;
    user: {
        id: string;
        name: string | null;
        phone: string | null;
    };
}

export default async function MyTeamPage() {
    const supabase = await createClient();
    const user = await getUser();

    // Mock checking if user has a team
    const { data: team } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_id', user?.id)
        .single();

    if (!team || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="size-20 bg-slate-200 dark:bg-surface-dark rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-400">groups</span>
                </div>
                <div className="max-w-md space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">You don&apos;t have a team yet</h2>
                    <p className="text-slate-500">Create a team to start challenging opponents and climbing the leaderboard.</p>
                </div>
                <Link href="/my-team/create">
                    <Button size="lg">Create Team</Button>
                </Link>
            </div>
        );
    }

    // Fetch team members
    const { data: membersData } = await supabase
        .from('team_members')
        .select(`
            id,
            role,
            user:users!inner(id, name, phone)
        `)
        .eq('team_id', team.id);

    const members = membersData as unknown as TeamMember[];

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative w-full h-80 rounded-2xl overflow-hidden group">
                <Image
                    src={team.avatar_url || 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?auto=format&fit=crop&q=80'}
                    alt="Team Cover"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
                    <div className="flex items-center gap-6">
                        <div className="relative w-32 h-32 rounded-xl border-4 border-background-dark shadow-2xl bg-slate-800 flex items-center justify-center overflow-hidden">
                            {team.avatar_url ? (
                                <Image
                                    src={team.avatar_url}
                                    alt={team.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <span className="material-symbols-outlined text-4xl text-slate-500">shield</span>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-4xl font-bold tracking-tight uppercase text-white">{team.name}</h2>
                                <span className="material-symbols-outlined text-primary" title="Verified">verified</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <span className="flex items-center gap-1 text-primary/80 text-sm font-medium">
                                    <span className="material-symbols-outlined text-sm">location_on</span> {team.city}, {team.district}
                                </span>
                                <span className="text-white/40">•</span>
                                <span className="text-white/80 text-sm font-medium">{team.skill_level}</span>
                                <span className="text-white/40">•</span>
                                <span className="text-white/80 text-sm font-medium">{team.match_format}</span>
                            </div>
                        </div>
                    </div>

                    <Link href="/my-team/edit">
                        <Button variant="secondary">
                            <span className="material-symbols-outlined mr-2">edit</span> Edit Profile
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid mockup */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/5">
                    <h3 className="font-bold uppercase text-sm text-slate-500 mb-2">Matches Played</h3>
                    <p className="text-3xl font-bold">0</p>
                </div>
                <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/5">
                    <h3 className="font-bold uppercase text-sm text-slate-500 mb-2">Wins</h3>
                    <p className="text-3xl font-bold text-primary">0</p>
                </div>
                <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/5">
                    <h3 className="font-bold uppercase text-sm text-slate-500 mb-2">Reputation</h3>
                    <p className="text-3xl font-bold text-accent-blue">New</p>
                </div>
            </div>

            {/* Roster Section - NEW */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/5 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Team Roster</h3>
                    <span className="text-sm text-slate-500">{members?.length || 0} Players</span>
                </div>

                <div className="space-y-4">
                    {/* Owner/Captain (Me) */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-background-dark font-bold">
                                {user.email?.[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-sm">You (Captain)</p>
                                <p className="text-xs text-slate-500">Team Owner</p>
                            </div>
                        </div>
                        <span className="text-xs font-bold uppercase text-primary bg-primary/10 px-2 py-1 rounded">Captain</span>
                    </div>

                    {/* Members List */}
                    {members?.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-black/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold">
                                    {member.user.name?.[0]?.toUpperCase() || 'P'}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{member.user.name || 'Unnamed Player'}</p>
                                    <p className="text-xs text-slate-500">{member.user.phone || 'No Phone'}</p>
                                </div>
                            </div>

                            <form action={async (formData) => {
                                'use server'
                                await removeTeamMember(formData)
                            }}>
                                <input type="hidden" name="memberId" value={member.id} />
                                <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" type="submit">
                                    <span className="material-symbols-outlined">remove_circle</span>
                                </Button>
                            </form>
                        </div>
                    ))}
                </div>

                {/* Add Member Form */}
                <div className="pt-6 border-t border-slate-200 dark:border-white/5">
                    <h4 className="font-bold text-sm mb-4">Add Player by Phone</h4>
                    <AddMemberForm teamId={team.id} />
                </div>
            </div>
        </div>
    );
}
