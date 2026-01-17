
import { Button } from "@/components/ui/Button";
import { challengeMatch } from "@/app/(dashboard)/matches/actions";
import Image from "next/image";

interface MatchCardProps {
    match: {
        id: string;
        team_name: string;
        team_avatar?: string;
        skill_level: string;
        match_format: string;
        date: string; // ISO string
        time: string;
        district: string;
        field_type: 'paid' | 'free';
        price?: number;
    };
    requestStatus?: 'pending' | 'accepted' | 'declined' | null;
}

export function MatchCard({ match, requestStatus }: MatchCardProps) {
    return (
        <div className="group relative overflow-hidden bg-slate-200 dark:bg-surface-dark rounded-2xl border border-slate-300 dark:border-slate-800 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative shrink-0">
                    <div className="relative size-20 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden flex items-center justify-center">
                        {match.team_avatar ? (
                            <Image
                                src={match.team_avatar}
                                alt={match.team_name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="material-symbols-outlined text-3xl text-slate-500">groups</span>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold uppercase tracking-tight">{match.team_name}</h3>
                        <span className="material-symbols-outlined text-accent-blue text-sm" title="Verified Team">verified</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">trending_up</span>{match.skill_level} Level</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">location_on</span>{match.district}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">groups</span>{match.match_format}</span>
                    </div>
                </div>

                <div className="w-full md:w-auto grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-slate-300 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
                    <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Kickoff</p>
                        <p className="font-semibold text-primary">{new Date(match.date).toLocaleDateString('en-GB', { weekday: 'short' })}, {match.time.slice(0, 5)}</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Pitch</p>
                        <div className="flex items-center gap-1.5">
                            <p className="font-semibold capitalize">{match.field_type}</p>
                        </div>
                    </div>
                </div>

                <form action={challengeMatch}>
                    <input type="hidden" name="matchId" value={match.id} />
                    {requestStatus === 'pending' ? (
                        <Button className="w-full md:w-auto px-8 bg-slate-500 hover:bg-slate-600 cursor-not-allowed" disabled>
                            Request Sent
                        </Button>
                    ) : requestStatus === 'accepted' ? (
                        <Button className="w-full md:w-auto px-8 bg-green-500 hover:bg-green-600 cursor-not-allowed" disabled>
                            Accepted
                        </Button>
                    ) : (
                        <Button className="w-full md:w-auto px-8" type="submit">Challenge</Button>
                    )}
                </form>
            </div>
        </div>
    );
}
