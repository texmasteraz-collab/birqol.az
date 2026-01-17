
import { login } from '../../auth/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Birqol Login</h1>
                    <p className="mt-2 text-sm text-slate-500">Sign in to your account</p>
                </div>

                <form className="mt-8 space-y-6">
                    <div className="space-y-4 rounded-md shadow-sm">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            placeholder="Email address"
                        />
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            placeholder="Password"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button formAction={login} className="w-full">
                            Sign in
                        </Button>
                        <p className="text-center text-sm text-slate-500">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
