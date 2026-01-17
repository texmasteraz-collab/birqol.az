
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function ErrorPage(props: {
    searchParams: Promise<{ message: string }>;
}) {
    const searchParams = await props.searchParams;
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-dark text-white p-6 text-center">
            <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-red-500">error</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
            <p className="text-slate-400 mb-8 max-w-md">
                {searchParams.message || "An unexpected error occurred. Please try again later."}
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline">Go Home</Button>
                </Link>
                <Link href="/login">
                    <Button>Back to Login</Button>
                </Link>
            </div>
        </div>
    );
}
