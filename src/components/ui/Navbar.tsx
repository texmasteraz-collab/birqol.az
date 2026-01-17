import Link from 'next/link'
import { Input } from './Input'
import { getUser } from '@/utils/supabase/user'
import { signout } from '@/app/auth/actions'

export async function Navbar() {
    // Safe auth check for server component
    const user = await getUser()

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="size-10 bg-primary flex items-center justify-center rounded-xl rotate-3">
                            <span className="material-symbols-outlined text-background-dark font-bold">sports_soccer</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight uppercase hidden md:block">
                            MatchUp <span className="text-primary">Football</span>
                        </h1>
                    </Link>

                    {/* Search */}
                    <div className="flex-1 max-w-xl hidden md:block">
                        <Input
                            placeholder="Search teams, fields or locations..."
                            icon={<span className="material-symbols-outlined">search</span>}
                        />
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link href="/find-opponent" className="text-sm font-semibold border-b-2 border-primary pb-1">
                            Find Matches
                        </Link>
                        <Link href="/fields" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                            Fields
                        </Link>
                        {user && (
                            <>
                                <Link href="/my-team" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                                    My Team
                                </Link>
                                <Link href="/matches/manage" className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
                                    My Matches
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* User Actions */}
                    <div className="flex items-center gap-3">
                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-surface-dark rounded-lg transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full"></span>
                        </button>


                        {/* Avatar / Login Placeholder */}
                        <Link href={user ? "/my-team" : "/login"}>
                            <div className="size-10 rounded-lg bg-slate-700 flex items-center justify-center border-2 border-slate-700 hover:border-primary transition-colors cursor-pointer overflow-hidden">
                                {user ? (
                                    <span className="material-symbols-outlined text-white">person</span>
                                ) : (
                                    <span className="material-symbols-outlined text-white">login</span>
                                )}
                            </div>
                        </Link>

                        {user && (
                            <form action={signout}>
                                <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Sign Out">
                                    <span className="material-symbols-outlined">logout</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Nav - Moved outside header to avoid backdrop-filter containing block issue */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 flex justify-around p-2 md:hidden z-50 pb-safe">
                <Link href="/" className="flex flex-col items-center p-2 text-slate-500 hover:text-primary">
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                <Link href="/find-opponent" className="flex flex-col items-center p-2 text-slate-500 hover:text-primary">
                    <span className="material-symbols-outlined">search</span>
                    <span className="text-[10px] font-medium">Match</span>
                </Link>
                <Link href="/fields" className="flex flex-col items-center p-2 text-slate-500 hover:text-primary">
                    <span className="material-symbols-outlined">stadium</span>
                    <span className="text-[10px] font-medium">Fields</span>
                </Link>
                <Link href={user ? "/my-team" : "/login"} className="flex flex-col items-center p-2 text-slate-500 hover:text-primary">
                    <span className="material-symbols-outlined">groups</span>
                    <span className="text-[10px] font-medium">{user ? 'My Team' : 'Login'}</span>
                </Link>
            </nav>
        </>
    )
}
