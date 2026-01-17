
import { Navbar } from "@/components/ui/Navbar";
import { getUser } from "@/utils/supabase/user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-foreground">
            <Navbar />
            <main className="max-w-[1400px] mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
