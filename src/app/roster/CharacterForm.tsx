'use client';

import { Character } from '@/lib/types';
import { useActionState } from 'react';
import { updateCharacter } from '@/app/actions/character';

// Define the action state type clearly
type ActionState = {
    message?: string;
} | null;

export default function CharacterForm({ character }: { character: Character }) {
    // Cast updateCharacter to the correct type for useActionState
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        updateCharacter as any, // Temporary casting if type mismatch occurs
        null
    );

    return (
        <form action={formAction} className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <input type="hidden" name="id" value={character.id} />

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Current Name</label>
                        <input name="name" defaultValue={character.name} required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Sex</label>
                        <input name="sex" defaultValue={character.sex} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Family Name (JP)</label>
                        <input name="jp_family" defaultValue={character.jp_family} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Given Name (JP)</label>
                        <input name="jp_given" defaultValue={character.jp_given} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }} />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Points</label>
                        <input type="number" name="points" defaultValue={character.points} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Status</label>
                        <select name="status" defaultValue={character.status} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }}>
                            <option value="Alive">Alive</option>
                            <option value="Dead">Dead</option>
                            <option value="Unknown">Unknown</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Notes</label>
                    <textarea name="note" defaultValue={character.note} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }} />
                </div>

                {state?.message && <p style={{ color: 'hsl(var(--state-danger))' }}>{state.message}</p>}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" disabled={isPending} className="btn-primary" style={{ flex: 1 }}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <a href="/roster" style={{ flex: 1, padding: '0.75rem', textAlign: 'center', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'transparent' }}>
                        Cancel
                    </a>
                </div>
            </div>
        </form>
    );
}
