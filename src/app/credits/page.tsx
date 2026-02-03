import Link from 'next/link';

export default function CreditsPage() {
    return (
        <div className="container" style={{ maxWidth: '800px', marginTop: '4rem', marginBottom: '4rem' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'hsl(var(--text-primary))' }}>Credits & Copyright</h1>

                <div style={{ marginBottom: '3rem' }}>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'hsl(var(--text-secondary))', marginBottom: '1rem' }}>
                        This is a derivative fan work collecting information from the series in one place for us to toy with our own builds and compare to the characters.
                        All information is copyright of the original author, artist, and publishers.
                    </p>
                </div>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'hsl(var(--accent-primary))', borderBottom: '1px solid hsl(var(--glass-border))', paddingBottom: '0.5rem' }}>
                        Original Series
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'baseline' }}>
                        <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>Title</span>
                        <span style={{ fontSize: '1.1rem' }}>To Another World... with Land Mines!</span>

                        <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>Original Title</span>
                        <span>異世界転移、地雷付き。</span>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'hsl(var(--accent-primary))', borderBottom: '1px solid hsl(var(--glass-border))', paddingBottom: '0.5rem' }}>
                        Creatives
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'baseline' }}>
                        <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>Author</span>
                        <span>Itsuki Mizuho (いつきみずほ)</span>

                        <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>Illustrator</span>
                        <span>Nekobyou Neko (猫猫猫)</span>
                    </div>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'hsl(var(--accent-primary))', borderBottom: '1px solid hsl(var(--glass-border))', paddingBottom: '0.5rem' }}>
                        Publishing
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', alignItems: 'baseline' }}>
                        <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>English Publisher</span>
                        <a href="https://j-novel.club/series/to-another-world-with-land-mines" target="_blank" rel="noopener noreferrer" style={{ color: 'hsl(var(--accent-secondary))', textDecoration: 'underline' }}>
                            J-Novel Club
                        </a>

                        <span style={{ color: 'hsl(var(--text-muted))', fontWeight: 'bold' }}>Japanese Publisher</span>
                        <span>Kadokawa (Dragon Novels)</span>
                    </div>
                </section>


            </div>
        </div>
    );
}
