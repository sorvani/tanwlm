import { getGameData } from '@/lib/data';
import Link from 'next/link';

export default async function SkillsPage() {
    const { skills } = await getGameData();

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Skills Database</h1>
            </div>

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
                            <div style={{ marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.875rem', color: 'hsl(var(--text-muted))' }}>
                                <span style={{ opacity: 0.7 }}>Hidden Info available</span>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
