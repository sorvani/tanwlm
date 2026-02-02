import { getGameData } from '@/lib/data';
import CharacterForm from '../CharacterForm';
import { notFound } from 'next/navigation';

export default async function CharacterPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { roster } = await getGameData();
    const character = roster.find(c => c.id === id);

    if (!character) {
        notFound();
    }

    return (
        <div className="container">
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Edit Character: {character.name}</h1>
            <CharacterForm character={character} />
        </div>
    );
}
