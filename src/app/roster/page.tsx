import { getGameData } from '@/lib/data';
import RosterTable from './RosterTable';

// TODO: Optimize this for production later (e.g., ISR with revalidation) once data editing is stabilized.
export const dynamic = 'force-dynamic';

export default async function RosterPage() {
    const { roster } = await getGameData();

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Class Roster</h1>
            </div>

            <RosterTable roster={roster} />
        </div>
    );
}
