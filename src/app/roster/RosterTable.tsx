'use client';

import { Character } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface RosterTableProps {
    roster: Character[];
}

export default function RosterTable({ roster }: RosterTableProps) {
    const router = useRouter();
    const [sortConfig, setSortConfig] = useState<{ key: keyof Character; direction: 'asc' | 'desc' } | null>(null);

    const sortedRoster = [...roster].sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numeric conversion for ID or Points if they are strings but represent numbers
        if (sortConfig.key === 'id') {
            return sortConfig.direction === 'asc'
                ? parseInt(a.id) - parseInt(b.id) // ID is string in type but represents number
                : parseInt(b.id) - parseInt(a.id);
        }

        if (sortConfig.key === 'points') {
            // Points can be number or string types in DB sometimes
            const aNum = Number(aValue) || 0;
            const bNum = Number(bValue) || 0;
            return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // Generic String comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return 0;
    });

    const requestSort = (key: keyof Character) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof Character) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 'inherit' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', userSelect: 'none' }}>
                        <th onClick={() => requestSort('id')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}># {getSortIndicator('id')}</th>
                        <th onClick={() => requestSort('name')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}>Name {getSortIndicator('name')}</th>
                        <th onClick={() => requestSort('points')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}>Points {getSortIndicator('points')}</th>
                        <th onClick={() => requestSort('jp_family')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}>Family Name (JP) {getSortIndicator('jp_family')}</th>
                        <th onClick={() => requestSort('jp_given')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}>Given Name (JP) {getSortIndicator('jp_given')}</th>
                        <th onClick={() => requestSort('sex')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}>Girl/Boy {getSortIndicator('sex')}</th>
                        <th onClick={() => requestSort('status')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}>Status {getSortIndicator('status')}</th>
                        <th onClick={() => requestSort('note')} style={{ padding: '1rem', cursor: 'pointer', userSelect: 'none' }}>Note {getSortIndicator('note')}</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRoster.map((student) => (
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
