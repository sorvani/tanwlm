import { getGameData } from '@/lib/data';
import Link from 'next/link';

export default async function RosterPage() {
    const { roster } = await getGameData();

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Class Roster</h1>
                <Link href="/builder" className="btn-primary">
                    + Add Character
                </Link>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 'inherit' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>#</th>
                            <th style={{ padding: '1rem' }}>Sex</th>
                            <th style={{ padding: '1rem' }}>Family Name (JP)</th>
                            <th style={{ padding: '1rem' }}>Given Name (JP)</th>
                            <th style={{ padding: '1rem' }}>Current Name</th>
                            <th style={{ padding: '1rem' }}>Points</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.map((student) => (
                            <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                                <td style={{ padding: '1rem', color: 'hsl(var(--text-muted))' }}>{student.id}</td>
                                <td style={{ padding: '1rem' }}>{student.sex}</td>
                                <td style={{ padding: '1rem' }}>{student.jp_family}</td>
                                <td style={{ padding: '1rem' }}>{student.jp_given}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                    <Link href={`/roster/${student.id}`} style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}>
                                        {student.name}
                                    </Link>
                                </td>
                                <td style={{ padding: '1rem' }}>{student.points}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        color: student.status === 'Dead' ? 'hsl(var(--state-danger))' :
                                            student.status === 'Alive' ? 'hsl(var(--state-success))' : 'hsl(var(--text-muted))',
                                        fontWeight: 600
                                    }}>
                                        {student.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'hsl(var(--text-secondary))', fontSize: '0.9rem' }}>{student.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
