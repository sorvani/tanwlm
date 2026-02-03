import { getGameData } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'hsl(var(--text-primary))' }}>{student.name}</h1>
                            <div style={{ color: 'hsl(var(--text-secondary))', fontSize: '1.2rem' }}>
                                {student.jp_family} {student.jp_given}
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                background: student.status === 'Alive' ? 'hsl(var(--state-success) / 0.2)' :
                                    student.status === 'Dead' ? 'hsl(var(--state-danger) / 0.2)' : 'hsl(var(--bg-tertiary))',
                                color: student.status === 'Alive' ? 'hsl(var(--state-success))' :
                                    student.status === 'Dead' ? 'hsl(var(--state-danger))' : 'hsl(var(--text-muted))',
                                fontWeight: 'bold'
                            }}>
                                {student.status}
                            </span>
                        </div>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Sex</h3>
                        <p style={{ fontSize: '1.1rem' }}>{student.sex}</p>
                    </div>
                    <div>
                        <h3 style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Points</h3>
                        <p style={{ fontSize: '1.1rem' }}>{student.points}</p>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ color: 'hsl(var(--text-muted))', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Notes</h3>
                    <p style={{ lineHeight: '1.6', color: 'hsl(var(--text-secondary))' }}>{student.note || "No notes available."}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
                    <div className="card" style={{ background: 'hsl(var(--bg-secondary))' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'hsl(var(--accent-primary))' }}>Purchased Skills</h3>
                        {student.purchasedSkills && student.purchasedSkills.length > 0 ? (
                            <ul style={{ listStyle: 'none' }}>
                                {student.purchasedSkills.map((skill: string, index: number) => (
                                    <li key={index} style={{ marginBottom: '0.5rem', paddingLeft: '1rem', position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 0, color: 'hsl(var(--accent-primary))' }}>•</span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'hsl(var(--text-muted))', fontStyle: 'italic' }}>None recorded.</p>
                        )}
                    </div>

                    <div className="card" style={{ background: 'hsl(var(--bg-secondary))' }}>
                        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'hsl(var(--accent-secondary))' }}>Learned / Improved Skills</h3>
                        {student.learnedSkills && student.learnedSkills.length > 0 ? (
                            <ul style={{ listStyle: 'none' }}>
                                {student.learnedSkills.map((skill: string, index: number) => (
                                    <li key={index} style={{ marginBottom: '0.5rem', paddingLeft: '1rem', position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: 0, color: 'hsl(var(--accent-secondary))' }}>•</span>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: 'hsl(var(--text-muted))', fontStyle: 'italic' }}>None learned yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
