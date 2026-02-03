import { getGameData } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// TODO: Optimize this for production later (e.g., ISR with revalidation) once data editing is stabilized.
export const dynamic = 'force-dynamic';

export default async function RosterDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { roster } = await getGameData();
    const student = roster.find((s) => s.id === id);

    if (!student) {
        notFound();
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/roster" className="hover-link" style={{ fontSize: '0.9rem', color: 'hsl(var(--text-muted))' }}>
                    &larr; Back to Roster
                </Link>
            </div>

            <div className="glass-panel" style={{ padding: '0', marginBottom: '2rem', overflow: 'hidden' }}>
                <div style={{ padding: '2rem', background: 'hsl(var(--bg-tertiary))', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'hsl(var(--accent-secondary))', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Status Screen</h2>
                    <div style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '1rem', lineHeight: '1.6', color: 'hsl(var(--text-primary))' }}>
                        <div style={{ marginBottom: '0.25rem' }}>Name: {student.name}</div>
                        <div style={{ marginBottom: '0.25rem' }}>Race: {student.race || 'Unknown'} <span style={{ color: 'hsl(var(--text-secondary))' }}>(Age: {student.age || '?'})</span></div>
                        <div style={{ marginBottom: '1rem' }}>Condition: <span style={{ color: student.condition === 'Healthy' ? 'hsl(var(--state-success))' : 'inherit' }}>{student.condition || student.status}</span></div>

                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <span style={{ marginRight: '0.5rem', whiteSpace: 'nowrap' }}>Skills:</span>
                            <div>
                                {student.currentSkills && student.currentSkills.length > 0 ? (
                                    <span>{student.currentSkills.join(', ')}</span>
                                ) : (
                                    <span style={{ color: 'hsl(var(--text-muted))' }}>None</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Full Name (JP)</h3>
                            <p style={{ fontSize: '1.1rem' }}>{student.jp_family} {student.jp_given}</p>
                        </div>
                        <div>
                            <h3 style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Initial Points</h3>
                            <p style={{ fontSize: '1.1rem' }}>{student.points}</p>
                        </div>
                        <div>
                            <h3 style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Notes</h3>
                            <p style={{ lineHeight: '1.6', color: 'hsl(var(--text-secondary))' }}>{student.note || "No notes available."}</p>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', color: 'hsl(var(--accent-primary))', marginBottom: '1rem' }}>Purchased Race & Skills</h3>
                        {student.purchasedSkills && student.purchasedSkills.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {student.purchasedSkills.map((skill: string, index: number) => (
                                    <span key={index} style={{
                                        background: 'hsl(var(--bg-primary))',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.9rem',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: 'hsl(var(--text-muted))', fontStyle: 'italic' }}>None recorded.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
