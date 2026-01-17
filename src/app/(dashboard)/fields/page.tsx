
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default async function FieldsPage() {
    const supabase = await createClient();

    const { data: fields } = await supabase
        .from('football_fields')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Football Fields</h1>
                <Button variant="outline" disabled>List Your Field (Coming Soon)</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fields && fields.length > 0 ? (
                    fields.map((field) => (
                        <Link href={`/fields/${field.id}`} key={field.id} className="group block h-full">
                            <div className="bg-slate-200 dark:bg-surface-dark rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
                                <div className="relative h-48 bg-slate-300 dark:bg-slate-700">
                                    <Image
                                        src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80"
                                        alt={field.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1 group-hover:text-primary transition-colors">{field.name}</h3>
                                    <p className="text-slate-500 text-sm mb-4 flex-1">{field.location}, {field.district}</p>

                                    <div className="flex items-center justify-between border-t border-slate-300 dark:border-white/10 pt-4">
                                        <span className="font-bold text-lg">{field.price} AZN <span className="text-xs font-normal text-slate-500">/ hour</span></span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-primary">View Details</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-20 bg-slate-100 dark:bg-surface-dark/50 rounded-3xl border-2 border-dashed border-slate-300 dark:border-white/10">
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-4">stadium</span>
                        <h3 className="text-xl font-bold text-slate-500">No fields listed yet</h3>
                        <p className="text-slate-400 max-w-xs mx-auto mt-2">Field owners will be listing their pitches soon.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
