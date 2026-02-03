import { getGameData } from '@/lib/data';
import Link from 'next/link';

export default async function SkillsPage() {
    const { skills, races } = await getGameData();

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Skills Database</h1>
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem' }}>Races</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {races.map((race, index) => (
                    <div key={index} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{race.name}</h3>
                            <span style={{
                                background: 'hsl(var(--accent-glow))',
                                color: 'hsl(var(--accent-primary))',
                                padding: '0.25rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                {race.cost} pts
                            </span>
                        </div>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1rem', flex: 1 }}>
                            {race.description || <em style={{ opacity: 0.5 }}>No description available</em>}
                        </p>
                        {race.hidden_info && (
                            <p style={{ fontSize: '0.9rem', color: 'hsl(var(--accent-secondary))', marginTop: '0.5rem' }}>
                                ({race.hidden_info})
                            </p>
                        )}

                    </div>
                ))}
            </div>

            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem' }}>Skills</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {skills.map((skill, index) => (
                    <div key={index} className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>{skill.name}</h3>
                            <span style={{
                                background: 'hsl(var(--accent-glow))',
                                color: 'hsl(var(--accent-primary))',
                                padding: '0.25rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}>
                                {skill.cost} pts
                            </span>
                        </div>
                        <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '1rem', flex: 1 }}>
                            {skill.description || <em style={{ opacity: 0.5 }}>No description available</em>}
                        </p>
                        {skill.hidden_info && (
                            <p style={{ fontSize: '0.9rem', color: 'hsl(var(--accent-secondary))', marginTop: '0.5rem' }}>
                                ({skill.hidden_info})
                            </p>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
