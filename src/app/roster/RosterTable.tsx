'use client';

import { Character } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface RosterTableProps {
    roster: Character[];
}

export default function RosterTable({ roster }: RosterTableProps) {
    const router = useRouter();

    return (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 'inherit' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <th style={{ padding: '1rem' }}>#</th>
                        <th style={{ padding: '1rem' }}>Name</th>
                        <th style={{ padding: '1rem' }}>Points</th>
                        <th style={{ padding: '1rem' }}>Family Name (JP)</th>
                        <th style={{ padding: '1rem' }}>Given Name (JP)</th>
                        <th style={{ padding: '1rem' }}>Girl/Boy</th>
                        <th style={{ padding: '1rem' }}>Status</th>
                        <th style={{ padding: '1rem' }}>Note</th>
                    </tr>
                </thead>
                <tbody>
                    {roster.map((student) => (
                        <tr
                            key={student.id}
                            onClick={() => router.push(`/roster/${student.id}`)}
                            style={{
                                borderBottom: '1px solid var(--border-color)',
                                transition: 'background-color 0.2s',
                                cursor: 'pointer'
                            }}
                            className="hover-row"
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--bg-tertiary))'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <td style={{ padding: '1rem', color: 'hsl(var(--text-muted))' }}>{student.id}</td>
                            <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                {student.name}
                            </td>
                            <td style={{ padding: '1rem' }}>{student.points}</td>
                            <td style={{ padding: '1rem' }}>{student.jp_family}</td>
                            <td style={{ padding: '1rem' }}>{student.jp_given}</td>
                            <td style={{ padding: '1rem' }}>{student.sex}</td>
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
    );
}
