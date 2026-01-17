
import { signup } from '../../auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Join Birqol</h1>
                    <p className="mt-2 text-sm text-slate-500">Create an account to start playing</p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="Full Name"
                            icon={<span className="material-symbols-outlined">person</span>}
                        />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Email address"
                            icon={<span className="material-symbols-outlined">mail</span>}
                        />
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            placeholder="Phone Number"
                            icon={<span className="material-symbols-outlined">call</span>}
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            icon={<span className="material-symbols-outlined">lock</span>}
                        />

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium text-slate-700 dark:text-slate-300">I am a...</label>
                            <select
                                id="role"
                                name="role"
                                className="w-full bg-slate-200 dark:bg-surface-dark border-transparent rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                                required
                            >
                                <option value="player">Player</option>
                                <option value="team_captain">Team Captain</option>
                                <option value="field_owner">Field Owner</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button formAction={signup} className="w-full">
                            Create Account
                        </Button>
                        <p className="text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
