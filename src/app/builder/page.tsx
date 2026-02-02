import { getGameData } from '@/lib/data';
import BuilderClient from './BuilderClient';

export default async function BuilderPage() {
    const { races, skills } = await getGameData();

    return (
        <div className="container">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Character Builder</h1>
            <BuilderClient races={races || []} skills={skills || []} />
        </div>
    );
}
