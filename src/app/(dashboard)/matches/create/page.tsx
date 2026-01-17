import { createMatch } from '../actions'
import { MatchForm } from '@/components/features/MatchForm'

export default function CreateMatchPage() {
    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Post a Match Request</h1>
            <MatchForm action={createMatch} />
        </div>
    )
}
