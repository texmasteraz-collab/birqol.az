
import { createClient } from "@/utils/supabase/server";
import { MatchForm } from "@/components/features/MatchForm";
import { updateMatch } from "../../actions";
import { redirect } from "next/navigation";

export default async function EditMatchPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect('/login');

    // WORKAROUND: Sanitize ID. 
    // Sometimes URLs arrive with spaces instead of hyphens (browser translation/encoding issues)
    const rawId = params.id;
    const cleanId = rawId.includes(' ') || rawId.includes('%20')
        ? rawId.replace(/%20/g, '-').replace(/ /g, '-')
        : rawId;

    console.log(`Edit Page: fetching match. Raw: '${rawId}', Clean: '${cleanId}'`);

    const { data: match, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', cleanId)
        .single();

    if (error) {
        console.error("Edit Page Error:", error);
    }
    console.log("Edit Page Match Data:", match);

    if (!match) return <div>Match not found (Check console for error)</div>;

    // Optional: Check if user owns the team that created the match
    // For now assuming if they can see the edit button (or access the page), RLS will handle the update permission.

    // Transform match data to match form expectations
    // match.time is usually "HH:MM:MM", need "HH:MM" for input
    const initialData = {
        date: match.date,
        time: match.time.slice(0, 5),
        district: match.district,
        format: match.format,
        field_type: match.field_type
    };

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit Match</h1>
            {/* Pass match ID as a hidden child input to the form */}
            <MatchForm action={updateMatch} initialData={initialData}>
                <input type="hidden" name="matchId" value={match.id} />
            </MatchForm>
        </div>
    );
}
