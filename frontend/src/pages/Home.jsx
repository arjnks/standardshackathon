import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Home() {
  const [settings, setSettings] = useState({ problem_statement: '', whatsapp_link: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/settings`)
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch settings", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div style={{ marginBottom: '-1rem', marginTop: '-2rem' }}>
          <img src="/club-logo.svg" alt="Club Logo" style={{ width: '250px', height: '250px', objectFit: 'contain' }} className="glow-logo" />
        </div>
        <h3 className="mono text-gold mb-2">STANDARDS CLUB PRESENTS</h3>
        <h1 className="hero-title">AUTODESK FUSION <br/><span className="text-gold">×</span> STANDARDS</h1>
        <p className="mono text-secondary mb-4" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
          Industry Hackathon • Two-day multidisciplinary engineering competition • Bridging the gap between academic knowledge and practical industrial problem solving.
        </p>
        <div className="flex justify-center gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
          <div className="card" style={{ padding: '1rem', minWidth: '200px' }}>
            <h4 className="text-gold mono mb-1" style={{ fontSize: '0.8rem' }}>DATES & TIMING</h4>
            <p className="text-primary" style={{ fontSize: '0.9rem' }}>18-19 Sept 2026<br/>8:00 AM - 6:00 PM</p>
          </div>
          <div className="card" style={{ padding: '1rem', minWidth: '200px' }}>
            <h4 className="text-gold mono mb-1" style={{ fontSize: '0.8rem' }}>VENUE</h4>
            <p className="text-primary" style={{ fontSize: '0.9rem' }}>MGB 108<br/>VIT Vellore</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link to="/register" className="btn btn-gold">Register Now</Link>
          {settings.whatsapp_link && (
            <a href={settings.whatsapp_link} target="_blank" rel="noopener noreferrer" className="btn">Join WhatsApp Group</a>
          )}
        </div>
      </section>

      {settings.problem_statement_visible === 'true' && (
        <section className="mb-4" style={{ marginTop: '3rem' }}>
          <h2 className="text-gold mb-4 mono text-center">_PROBLEM STATEMENTS RELEASED</h2>
          <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* MECHANICAL CARD */}
            {(settings.mech_problem_statement || settings.mech_ps_file || settings.mech_constraints) && (
              <div className="card" style={{ border: '1px solid var(--accent-gold)' }}>
                <h3 className="text-gold mb-4 mono text-center">MECHANICAL TRACK</h3>
                
                {settings.mech_ps_file && (
                  <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {settings.mech_ps_file.toLowerCase().endsWith('.pdf') || settings.mech_ps_file.includes('.pdf') ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <iframe 
                          src={settings.mech_ps_file.startsWith('http') ? settings.mech_ps_file : `http://localhost:3000${settings.mech_ps_file}`} 
                          style={{ width: '100%', height: '500px', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                          title="Mechanical Problem Statement PDF"
                        />
                        <a 
                          href={settings.mech_ps_file.startsWith('http') ? settings.mech_ps_file : `http://localhost:3000${settings.mech_ps_file}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-gold"
                        >
                          Open Problem Statement PDF
                        </a>
                      </div>
                    ) : (
                      <img 
                        src={settings.mech_ps_file.startsWith('http') ? settings.mech_ps_file : `http://localhost:3000${settings.mech_ps_file}`} 
                        alt="Mechanical Problem Statement" 
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                      />
                    )}
                  </div>
                )}
                
                {settings.mech_problem_statement && (
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    {settings.mech_problem_statement}
                  </div>
                )}

                {settings.mech_constraints && (
                  <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <h4 className="text-gold mb-3 mono">CONSTRAINTS</h4>
                    <a 
                      href={settings.mech_constraints.startsWith('http') ? settings.mech_constraints : `http://localhost:3000${settings.mech_constraints}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn"
                    >
                      Download Constraints PDF
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* MULTI-DISCIPLINARY CARD */}
            {(settings.multi_problem_statement || settings.multi_ps_file || settings.multi_constraints) && (
              <div className="card" style={{ border: '1px solid var(--accent-gold)' }}>
                <h3 className="text-gold mb-4 mono text-center">MULTI-DISCIPLINARY TRACK</h3>
                
                {settings.multi_ps_file && (
                  <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    {settings.multi_ps_file.toLowerCase().endsWith('.pdf') || settings.multi_ps_file.includes('.pdf') ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <iframe 
                          src={settings.multi_ps_file.startsWith('http') ? settings.multi_ps_file : `http://localhost:3000${settings.multi_ps_file}`} 
                          style={{ width: '100%', height: '500px', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                          title="Multi-Disciplinary Problem Statement PDF"
                        />
                        <a 
                          href={settings.multi_ps_file.startsWith('http') ? settings.multi_ps_file : `http://localhost:3000${settings.multi_ps_file}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-gold"
                        >
                          Open Problem Statement PDF
                        </a>
                      </div>
                    ) : (
                      <img 
                        src={settings.multi_ps_file.startsWith('http') ? settings.multi_ps_file : `http://localhost:3000${settings.multi_ps_file}`} 
                        alt="Multi-Disciplinary Problem Statement" 
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                      />
                    )}
                  </div>
                )}
                
                {settings.multi_problem_statement && (
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    {settings.multi_problem_statement}
                  </div>
                )}

                {settings.multi_constraints && (
                  <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    <h4 className="text-gold mb-3 mono">CONSTRAINTS</h4>
                    <a 
                      href={settings.multi_constraints.startsWith('http') ? settings.multi_constraints : `http://localhost:3000${settings.multi_constraints}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn"
                    >
                      Download Constraints PDF
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="mb-4" style={{ marginTop: '4rem' }}>
        <h2 className="mb-4 mono">ABOUT THE HACKATHON</h2>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card">
            <h3 className="text-gold mb-2">Multidisciplinary</h3>
            <p className="text-secondary">
              Open to Mechanical, CS, IT, Electrical, Electronics, and other engineering disciplines. We encourage teams of 3-5 members to combine design, software, controls, and data.
            </p>
          </div>
          <div className="card">
            <h3 className="text-gold mb-2">Standards & AI</h3>
            <p className="text-secondary">
              Apply BIS standards to your design. AI workflows are permitted, but your team must justify and defend every engineering decision.
            </p>
          </div>
          <div className="card">
            <h3 className="text-gold mb-2">Judging (100 Marks)</h3>
            <ul className="text-secondary" style={{ paddingLeft: '1rem' }}>
              <li>Technical Approach & Feasibility (20)</li>
              <li>Innovation & Creativity (15)</li>
              <li>Design & Implementation (15)</li>
              <li>Sustainability (10)</li>
              <li>Standards & Relevance (10)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
