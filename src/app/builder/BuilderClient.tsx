'use client';

import { Race, Skill } from '@/lib/types';
import { useActionState, useState, useEffect, useMemo } from 'react';
import { createCharacter } from '@/app/actions/character';
import { calculateSkillCost } from '@/lib/game-mechanics';

type ActionState = {
    message?: string;
} | null;

interface BuilderClientProps {
    races: Race[];
    skills: Skill[];
}

interface SelectedSkillState {
    skill: Skill;
    level: number;
}

export default function BuilderClient({ races, skills }: BuilderClientProps) {
    const [state, formAction, isPending] = useActionState<ActionState, FormData>(
        createCharacter as any,
        null
    );

    // Configuration
    const [initialPoints, setInitialPoints] = useState(100);

    // Character State
    const [name, setName] = useState('');
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);
    const [selectedSkills, setSelectedSkills] = useState<SelectedSkillState[]>([]);
    const [hasHelpGuide, setHasHelpGuide] = useState(false);

    // Modal State
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showLoadModal, setShowLoadModal] = useState(false);
    const [loadJson, setLoadJson] = useState('');

    // Initialize defaults
    useEffect(() => {
        if (races.length > 0 && !selectedRace) {
            const human = races.find(r => r.name === 'Human');
            setSelectedRace(human || races[0]);
        }
    }, [races, selectedRace]);

    // -- Calculations --
    const raceCost = selectedRace?.cost || 0;

    const skillsCost = useMemo(() => {
        return selectedSkills.reduce((sum, s) => {
            return sum + calculateSkillCost(s.skill, s.level);
        }, 0);
    }, [selectedSkills]);

    const usedPoints = raceCost + skillsCost;
    const remainingPoints = initialPoints - usedPoints;

    // -- Handlers --

    const getSkillState = (skillName: string) => selectedSkills.find(s => s.skill.name === skillName);

    const handleSkillToggle = (skill: Skill) => {
        const existing = getSkillState(skill.name);

        if (existing) {
            // Remove logic
            if (skill.name === 'Help Guide') {
                // Strict Rule: Cannot remove Help Guide once added
                return;
            }
            setSelectedSkills(selectedSkills.filter(s => s.skill.name !== skill.name));
            if (skill.name === 'Help Guide') setHasHelpGuide(false);
        } else {
            // Add logic - check cost for Level 1
            const cost = calculateSkillCost(skill, 1);
            if (remainingPoints < cost) return; // Can't afford

            setSelectedSkills([...selectedSkills, { skill, level: 1 }]);
            if (skill.name === 'Help Guide') setHasHelpGuide(true);
        }
    };

    const handleLevelChange = (skill: Skill, delta: number) => {
        const existing = getSkillState(skill.name);
        if (!existing) return;

        const newLevel = existing.level + delta;

        // Validation
        if (newLevel < 1) {
            // Removing via level down
            if (skill.name === 'Help Guide') return; // Cannot remove
            setSelectedSkills(selectedSkills.filter(s => s.skill.name !== skill.name));
            return;
        }

        // Check Affordability of upgrade
        const currentCost = calculateSkillCost(skill, existing.level);
        const newCost = calculateSkillCost(skill, newLevel);
        const diff = newCost - currentCost;

        if (remainingPoints < diff) return; // Can't afford upgrade

        // Update Level
        setSelectedSkills(selectedSkills.map(s =>
            s.skill.name === skill.name ? { ...s, level: newLevel } : s
        ));
    };

    const handleSave = () => {
        setShowSaveModal(true);
    };

    const handleLoad = () => {
        try {
            const data = JSON.parse(loadJson);
            if (data.name) setName(data.name);
            if (data.initialPoints) setInitialPoints(Math.min(250, Math.max(0, data.initialPoints)));

            if (data.race) {
                const r = races.find(r => r.name === data.race);
                if (r) setSelectedRace(r);
            }

            if (Array.isArray(data.skills)) {
                // Parse skills
                const newSkills: SelectedSkillState[] = [];
                let helpFound = false;

                data.skills.forEach((s: any) => {
                    const skillName = typeof s === 'string' ? s : s.name;
                    const level = typeof s === 'object' && s.level ? s.level : 1;

                    const skillObj = skills.find(sk => sk.name === skillName);
                    if (skillObj) {
                        newSkills.push({ skill: skillObj, level });
                        if (skillObj.name === 'Help Guide') helpFound = true;
                    }
                });

                setSelectedSkills(newSkills);
                setHasHelpGuide(helpFound);
            }
            setShowLoadModal(false);
            setLoadJson('');
        } catch (e) {
            alert('Invalid JSON');
        }
    };

    // Export Data structure
    const exportData = {
        name,
        initialPoints,
        race: selectedRace?.name,
        skills: selectedSkills.map(s => ({ name: s.skill.name, level: s.level }))
    };

    return (
        <div className="builder-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>
            {/* -- Left Column: Logic -- */}
            <form action={formAction} id="builder-form">
                <input type="hidden" name="raceCost" value={raceCost} />
                <input type="hidden" name="points" value={remainingPoints} />
                {/* Simplified skills output for server action - just names for now, or JSON if needed. 
                    The Original server action expects "skills" string or array. 
                    If we want levels in the roster, we might need to serialize differently.
                    For now, we will just send the list of names with Level strings if > 1 for compatibility with Roster Page parsing?
                    Roster page parses "Level X Name". So we should format it that way!
                */}
                <input type="hidden" name="skills" value={JSON.stringify(selectedSkills.map(s =>
                    s.level > 1 && s.skill.has_levels ? `Level ${s.level} ${s.skill.name}` : s.skill.name
                ))} />

                <div className="options-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Settings Card */}
                    <section className="card glass-panel">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Configuration</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label>Initial Points (Max 250):</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="250"
                                    value={initialPoints}
                                    onChange={(e) => setInitialPoints(Math.min(250, parseInt(e.target.value) || 0))}
                                    style={{ width: '80px', padding: '0.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))' }}
                                />
                            </div>
                        </div>
                    </section>

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
                                const state = getSkillState(skill.name);
                                const isSelected = !!state;
                                const costAtCurrentLevel = state ? calculateSkillCost(skill, state.level) : calculateSkillCost(skill, 1);

                                // Hiding Logic: Hide if not selected AND too expensive for remaining points
                                if (!isSelected && costAtCurrentLevel > remainingPoints) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            padding: '1rem',
                                            border: isSelected ? '1px solid hsl(var(--accent-primary))' : '1px solid var(--border-color)',
                                            background: isSelected ? 'hsl(var(--accent-primary) / 0.1)' : 'transparent',
                                            borderRadius: 'var(--radius-md)',
                                            transition: 'all 0.2s',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                                            <strong style={{ cursor: 'pointer' }} onClick={() => handleSkillToggle(skill)}>{skill.name}</strong>

                                            {isSelected && skill.has_levels ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'hsl(var(--bg-secondary))', borderRadius: '4px', padding: '2px 4px' }}>
                                                    <button type="button" onClick={() => handleLevelChange(skill, -1)} style={{ padding: '0 5px', cursor: 'pointer', background: 'none', border: 'none', color: 'hsl(var(--text-primary))' }}>-</button>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Lvl {state.level}</span>
                                                    <button type="button" onClick={() => handleLevelChange(skill, 1)} style={{ padding: '0 5px', cursor: 'pointer', background: 'none', border: 'none', color: 'hsl(var(--text-primary))' }}>+</button>
                                                </div>
                                            ) : (
                                                <span style={{ color: 'hsl(var(--accent-secondary))', fontWeight: 'bold' }}>{costAtCurrentLevel}</span>
                                            )}
                                        </div>

                                        {/* Cost Indicator for Leveled Selection */}
                                        {isSelected && skill.has_levels && (
                                            <div style={{ fontSize: '0.8rem', textAlign: 'right', color: 'hsl(var(--accent-secondary))', marginBottom: '0.5rem' }}>
                                                Total: {calculateSkillCost(skill, state.level)} pts
                                            </div>
                                        )}

                                        <div style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', cursor: 'pointer' }} onClick={() => handleSkillToggle(skill)}>
                                            {skill.description}
                                        </div>

                                        {skill.hidden_info && (
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!isSelected) handleSkillToggle(skill);
                                                }}
                                                style={{
                                                    display: hasHelpGuide ? 'block' : 'none',
                                                    marginTop: '0.5rem',
                                                    paddingTop: '0.5rem',
                                                    borderTop: '1px dashed var(--border-color)',
                                                    color: 'hsl(var(--state-warning))',
                                                    fontSize: '0.85rem',
                                                    fontStyle: 'italic',
                                                    cursor: !isSelected ? 'pointer' : 'default'
                                                }}>
                                                {skill.hidden_info}
                                            </div>
                                        )}

                                        {!isSelected && (
                                            <div onClick={() => handleSkillToggle(skill)} style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} aria-label="Select skill"></div>
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
                    <p style={{ color: 'hsl(var(--text-muted))' }}>Limit: {initialPoints}</p>

                    <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0 }}>Selected:</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="button" onClick={handleSave} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', cursor: 'pointer' }}>Save</button>
                                <button type="button" onClick={() => setShowLoadModal(true)} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', cursor: 'pointer' }}>Load</button>
                            </div>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Race: {selectedRace?.name}</span>
                                <span>{selectedRace?.cost}</span>
                            </li>
                            {selectedSkills.map(s => {
                                const cost = calculateSkillCost(s.skill, s.level);
                                return (
                                    <li key={s.skill.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>
                                            {s.skill.name}
                                            {s.level > 1 && <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.8em' }}> (Lvl {s.level})</span>}
                                        </span>
                                        <span>{cost}</span>
                                    </li>
                                );
                            })}
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
                        {isPending ? 'Saving...' : 'Save Character'}
                    </button>
                </div>
            </div>

            {/* Save Modal */}
            {showSaveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'hsl(var(--bg-primary))', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '500px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Save Character Data</h3>
                        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>Copy this text to save your build.</p>
                        <textarea
                            readOnly
                            value={JSON.stringify(exportData, null, 2)}
                            style={{ width: '100%', height: '200px', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))', padding: '1rem', fontFamily: 'monospace' }}
                        />
                        <button onClick={() => setShowSaveModal(false)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Close</button>
                    </div>
                </div>
            )}

            {/* Load Modal */}
            {showLoadModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'hsl(var(--bg-primary))', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '500px', maxWidth: '90%' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Load Character Data</h3>
                        <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'hsl(var(--text-secondary))' }}>Paste your build data here.</p>
                        <textarea
                            value={loadJson}
                            onChange={(e) => setLoadJson(e.target.value)}
                            placeholder='Paste JSON here...'
                            style={{ width: '100%', height: '200px', background: 'hsl(var(--bg-secondary))', color: 'hsl(var(--text-primary))', padding: '1rem', fontFamily: 'monospace' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={handleLoad} className="btn-primary" style={{ flex: 1, cursor: 'pointer' }}>Load</button>
                            <button onClick={() => setShowLoadModal(false)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
