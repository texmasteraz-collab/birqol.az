
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function FieldDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const fieldId = id;
    const supabase = await createClient();

    const { data: field } = await supabase
        .from('football_fields')
        .select('*')
        .eq('id', fieldId)
        .single();

    if (!field) {
        redirect('/fields');
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Link href="/fields" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg mr-1">arrow_back</span> Back to Fields
            </Link>

            <div className="relative w-full h-80 rounded-2xl overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80"
                    alt={field.name}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                    <h1 className="text-4xl font-bold text-white uppercase tracking-tight mb-2">{field.name}</h1>
                    <p className="text-white/80 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined">location_on</span> {field.location}, {field.district}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-200 dark:bg-surface-dark rounded-xl p-6 border border-slate-300 dark:border-slate-800">
                        <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span> About this Pitch
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            High quality artificial turf suitable for 5x5, 6x6 and 7x7 matches.
                            Changing rooms and showers are available. Parking is free for players.
                        </p>
                    </div>

                    <div className="bg-slate-200 dark:bg-surface-dark rounded-xl p-6 border border-slate-300 dark:border-slate-800">
                        <h3 className="text-lg font-bold uppercase tracking-tight mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">map</span> Location
                        </h3>
                        <div className="h-48 bg-slate-300 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                            <p className="text-slate-500 font-bold uppercase tracking-widest">Map View Unavailable</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-primary p-6 rounded-2xl sticky top-24 shadow-xl shadow-primary/10">
                        <div className="mb-6">
                            <p className="text-[10px] font-black uppercase text-background-dark/60 tracking-widest mb-1">Price per hour</p>
                            <p className="text-3xl font-black text-background-dark">{field.price} AZN</p>
                        </div>
                        <Button className="w-full bg-background-dark text-primary hover:scale-[1.02] active:scale-[0.98]">
                            Book Now
                        </Button>
                        <p className="text-xs text-center mt-3 text-background-dark/70 font-medium">
                            <span className="material-symbols-outlined text-sm align-bottom mr-1">call</span> Call to book
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
