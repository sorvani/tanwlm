import { getGameData } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// TODO: Optimize this for production later (e.g., ISR with revalidation) once data editing is stabilized.
export const dynamic = 'force-dynamic';

export default async function RosterDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { roster, skills, races } = await getGameData();
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

                        <div>
                            {(() => {
                                const skills = student.currentSkills || [];
                                if (skills.length === 0) return <span style={{ color: 'hsl(var(--text-muted))' }}>Skills: None</span>;

                                const MAX_WIDTH = 70; // Character width limit
                                const lines: string[] = [];
                                let currentLine = "Skills: ";

                                skills.forEach((skill) => {
                                    // Separator logic: if line is just "Skills: ", no comma. Otherwise ", "
                                    const separator = (currentLine === "Skills: ") ? "" : ", ";
                                    const predictedLength = currentLine.length + separator.length + skill.length;

                                    if (predictedLength > MAX_WIDTH) {
                                        // Push current completed line
                                        lines.push(currentLine);
                                        // Start new line with just this skill (no indentation as requested)
                                        currentLine = skill;
                                    } else {
                                        currentLine += separator + skill;
                                    }
                                });
                                // Push the final line
                                if (currentLine) lines.push(currentLine);

                                return lines.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ));
                            })()}
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
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                {student.purchasedSkills.map((itemName: string, index: number) => {
                                    // Determine if student has "Help Guide" in CURRENT skills (or purchased, logic: usually current)
                                    const hasHelpGuide = student.currentSkills?.includes("Help Guide") || student.purchasedSkills?.includes("Help Guide");

                                    // Find item details in Races or Skills
                                    const race = races.find(r => r.name === itemName);
                                    const skill = skills.find(s => s.name === itemName);
                                    const item = race || skill;

                                    if (!item) {
                                        // Fallback for items not found in DB
                                        return (
                                            <div key={index} className="card" style={{ background: 'hsl(var(--bg-secondary))', padding: '1rem' }}>
                                                <h4 style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{itemName}</h4>
                                                <p style={{ color: 'hsl(var(--text-muted))', fontSize: '0.9rem' }}>Unknown item</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={index} className="card" style={{ background: 'hsl(var(--bg-secondary))', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h4 style={{ fontWeight: 'bold', fontSize: '1rem', color: 'hsl(var(--text-primary))' }}>{item.name}</h4>
                                                <span style={{
                                                    background: 'hsl(var(--bg-tertiary))',
                                                    padding: '0.1rem 0.5rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    color: 'hsl(var(--text-secondary))',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {item.cost} pts
                                                </span>
                                            </div>

                                            <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem', flex: 1 }}>
                                                {item.description}
                                            </p>

                                            {/* Show Hidden Info if user has Help Guide AND hidden_info exists */}
                                            {hasHelpGuide && 'hidden_info' in item && item.hidden_info && (
                                                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--accent-secondary))', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem' }}>
                                                    ({item.hidden_info})
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
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
