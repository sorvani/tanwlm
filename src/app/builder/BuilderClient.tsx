'use client';

import { Race, Skill } from '@/lib/types';
import { useActionState, useState, useEffect } from 'react';
import { createCharacter } from '@/app/actions/character';

type ActionState = {
    message?: string;
} | null;

interface BuilderClientProps {
    races: Race[];
    skills: Skill[];
}

const STARTING_POINTS = 100;

export default function BuilderClient({ races, skills }: BuilderClientProps) {
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        createCharacter as any,
        null
    );

    const [name, setName] = useState('');
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
    const [hasHelpGuide, setHasHelpGuide] = useState(false);

    // Initialize defaults
    useEffect(() => {
        if (races.length > 0 && !selectedRace) {
            // Default to Human if exists, otherwise first
            const human = races.find(r => r.name === 'Human');
            setSelectedRace(human || races[0]);
        }
    }, [races, selectedRace]);

    // Calculations
    const raceCost = selectedRace?.cost || 0;
    const skillsCost = selectedSkills.reduce((sum, s) => sum + s.cost, 0);
    const usedPoints = raceCost + skillsCost;
    const remainingPoints = STARTING_POINTS - usedPoints;

    const toggleSkill = (skill: Skill) => {
        if (selectedSkills.find(s => s.name === skill.name)) {
            setSelectedSkills(selectedSkills.filter(s => s.name !== skill.name));
            if (skill.name === 'Help Guide') setHasHelpGuide(false);
        } else {
            setSelectedSkills([...selectedSkills, skill]);
            if (skill.name === 'Help Guide') setHasHelpGuide(true);
        }
    };

    return (
        <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
            <form action={formAction} id="builder-form">
                <input type="hidden" name="raceCost" value={raceCost} />
                <input type="hidden" name="points" value={remainingPoints} />
                <input type="hidden" name="skills" value={JSON.stringify(selectedSkills)} />

                <div className="options-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <section className="card glass-panel">
                        <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Profile</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Race</label>
                                <select
                                    name="race"
                                    onChange={(e) => setSelectedRace(races.find(r => r.name === e.target.value) || null)}
                                    value={selectedRace?.name || ''}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }}
                                >
                                    {races.map(r => (
                                        <option key={r.name} value={r.name}>{r.name} ({r.cost})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="card glass-panel">
                        <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Skills</h2>
                        <div className="skills-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {skills.map((skill, index) => {
                                const isSelected = selectedSkills.some(s => s.name === skill.name);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => toggleSkill(skill)}
                                        style={{
                                            padding: '1rem',
                                            border: isSelected ? '1px solid hsl(var(--accent-primary))' : '1px solid var(--border-color)',
                                            background: isSelected ? 'hsl(var(--accent-primary) / 0.1)' : 'transparent',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <strong>{skill.name}</strong>
                                            <span style={{ color: 'hsl(var(--accent-secondary))', fontWeight: 'bold' }}>{skill.cost}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>
                                            {skill.description}
                                        </div>
                                        {skill.hidden_info && (
                                            <div style={{
                                                display: hasHelpGuide ? 'block' : 'none',
                                                marginTop: '0.5rem',
                                                paddingTop: '0.5rem',
                                                borderTop: '1px dashed var(--border-color)',
                                                color: 'hsl(var(--state-warning))',
                                                fontSize: '0.85rem',
                                                fontStyle: 'italic'
                                            }}>
                                                {skill.hidden_info}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>
            </form>

            <div className="sidebar" style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
                <div className="card glass-panel" style={{ textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Remaining Points</h3>
                    <div style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        color: remainingPoints < 0 ? 'hsl(var(--state-danger))' : 'hsl(var(--accent-primary))',
                        marginBottom: '0.5rem'
                    }}>
                        {remainingPoints}
                    </div>
                    <p style={{ color: 'hsl(var(--text-muted))' }}>Starting Points: {STARTING_POINTS}</p>

                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Selected:</h4>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Race: {selectedRace?.name}</span>
                                <span>{selectedRace?.cost}</span>
                            </li>
                            {selectedSkills.map(s => (
                                <li key={s.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>{s.name}</span>
                                    <span>{s.cost}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {state?.message && <p style={{ color: 'hsl(var(--state-danger))', marginTop: '1rem' }}>{state.message}</p>}

                    <button
                        type="submit"
                        form="builder-form"
                        disabled={isPending || remainingPoints < 0}
                        className="btn-primary"
                        style={{ width: '100%', marginTop: '2rem', filter: remainingPoints < 0 ? 'grayscale(1)' : 'none' }}
                    >
                        {isPending ? 'Saving...' : 'Finalize Character'}
                    </button>
                </div>
            </div>
        </div>
    );
}
