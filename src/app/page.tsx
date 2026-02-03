import { getGameData } from '@/lib/data';
import Link from 'next/link';

export default async function Home() {
  const data = await getGameData();
  const { roster, skills, races } = data;

  const aliveCount = roster.filter(c => c.status === 'Alive').length;
  const deadCount = roster.filter(c => c.status === 'Dead').length;
  const unknownCount = roster.filter(c => c.status === 'Unknown').length;

  return (
    <div className="container">
      <section className="hero" style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, hsl(var(--text-primary)), hsl(var(--text-secondary)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Land Mines DB
        </h1>
        <h2 style={{ fontSize: '1.5rem', color: 'hsl(var(--accent-primary))', marginBottom: '1.5rem', fontWeight: 'normal' }}>
          & Character Simulator
        </h2>
        <p style={{ fontSize: '1.25rem', color: 'hsl(var(--text-secondary))', maxWidth: '600px', margin: '0 auto' }}>
          A comprehensive character tracker and builder for<br />
          <em>To Another World... with Land Mines!</em>
        </p>
      </section>

      <section className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="card glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '3rem', color: 'hsl(var(--accent-primary))' }}>{roster.length}</h3>
          <p style={{ color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '1px' }}>Total Students</p>
        </div>
        <div className="card glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '3rem', color: 'hsl(var(--state-success))' }}>{aliveCount}</h3>
          <p style={{ color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '1px' }}>Alive</p>
        </div>
        <div className="card glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '3rem', color: 'hsl(var(--state-danger))' }}>{deadCount}</h3>
          <p style={{ color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '1px' }}>Dead</p>
        </div>
        <div className="card glass-panel" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '3rem', color: 'hsl(var(--accent-secondary))' }}>{skills.length}</h3>
          <p style={{ color: 'hsl(var(--text-muted))', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '1px' }}>Skills Registered</p>
        </div>
      </section>

      <section className="nav-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <Link href="/roster" className="card glass-panel" style={{ padding: '2rem', display: 'block', transition: 'transform 0.2s' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Class Roster &rarr;</h2>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>View the status, skills, and notes for all students transported to the new world.</p>
        </Link>
        <Link href="/builder" className="card glass-panel" style={{ padding: '2rem', display: 'block', transition: 'transform 0.2s' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Character Builder &rarr;</h2>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>Create new character builds calculator. Test combinations of races and skills.</p>
        </Link>
        <Link href="/skills" className="card glass-panel" style={{ padding: '2rem', display: 'block', transition: 'transform 0.2s' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Skill Database &rarr;</h2>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>Browse the complete list of available skills, descriptions, and costs.</p>
        </Link>
      </section>
    </div>
  );
}
