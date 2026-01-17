
import { Navbar } from '@/components/ui/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
          <div className="size-24 bg-primary flex items-center justify-center rounded-3xl rotate-6 shadow-2xl shadow-primary/20">
            <span className="material-symbols-outlined text-background-dark text-6xl font-black">sports_soccer</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase max-w-2xl">
            Find your next <span className="text-primary">opponent</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md">
            The ultimate football matchmaking platform for amateur teams in Baku.
          </p>
          <div className="flex gap-4">
            <a href="/find-opponent" className="bg-primary text-background-dark font-black uppercase tracking-tight px-8 py-4 rounded-xl hover:scale-105 transition-all">
              Find Match
            </a>
            <a href="/signup" className="bg-surface-dark text-white font-bold uppercase tracking-tight px-8 py-4 rounded-xl hover:bg-slate-800 transition-all">
              Create Team
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
