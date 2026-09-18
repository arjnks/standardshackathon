import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState({ 
    mech_problem_statement: '', 
    multi_problem_statement: '', 
    whatsapp_link: '', 
    problem_statement_visible: 'false', 
    mech_ps_file: '', 
    mech_constraints: '', 
    multi_ps_file: '', 
    multi_constraints: '' 
  });
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [mechPsFile, setMechPsFile] = useState(null);
  const [mechConstraintsFile, setMechConstraintsFile] = useState(null);
  const [multiPsFile, setMultiPsFile] = useState(null);
  const [multiConstraintsFile, setMultiConstraintsFile] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        fetchDashboardData(password);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async (pwd) => {
    try {
      const [settingsRes, teamsRes] = await Promise.all([
        fetch(`${API_URL}/settings`),
        fetch(`${API_URL}/teams?password=${pwd}`)
      ]);
      
      if (settingsRes.ok) setSettings(await settingsRes.json());
      if (teamsRes.ok) setTeams(await teamsRes.json());
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('password', password);
      formData.append('whatsapp_link', settings.whatsapp_link || '');
      formData.append('mech_problem_statement', settings.mech_problem_statement || '');
      formData.append('multi_problem_statement', settings.multi_problem_statement || '');
      formData.append('problem_statement_visible', settings.problem_statement_visible === 'true' ? 'true' : 'false');
      
      if (mechPsFile) formData.append('mech_ps_file', mechPsFile);
      if (mechConstraintsFile) formData.append('mech_constraints', mechConstraintsFile);
      if (multiPsFile) formData.append('multi_ps_file', multiPsFile);
      if (multiConstraintsFile) formData.append('multi_constraints', multiConstraintsFile);

      const res = await fetch(`${API_URL}/settings`, {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        alert('Settings saved successfully!');
        setMechPsFile(null);
        setMechConstraintsFile(null);
        setMultiPsFile(null);
        setMultiConstraintsFile(null);
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (teams.length === 0) {
      alert("No teams to export");
      return;
    }

    // Define CSV Headers
    const headers = [
      "Team ID", "Team Name", "Branch", "Problem Statement", "Leader Name", "Leader Email", "Leader Phone",
      "M2 Name", "M2 Reg No", "M2 Email",
      "M3 Name", "M3 Reg No", "M3 Email",
      "M4 Name", "M4 Reg No", "M4 Email",
      "M5 Name", "M5 Reg No", "M5 Email"
    ];

    const csvRows = [];
    csvRows.push(headers.join(','));

    // Process each team
    teams.forEach(team => {
      const row = [
        team.id,
        `"${team.team_name.replace(/"/g, '""')}"`,
        `"${team.branch.replace(/"/g, '""')}"`,
        `"${(team.problem_statement_selection || '').replace(/"/g, '""')}"`,
        `"${team.leader_name.replace(/"/g, '""')}"`,
        `"${team.leader_email.replace(/"/g, '""')}"`,
        `"${team.leader_phone.replace(/"/g, '""')}"`
      ];

      // Add up to 4 teammates
      for (let i = 0; i < 4; i++) {
        if (team.teammates && team.teammates[i]) {
          row.push(`"${team.teammates[i].name.replace(/"/g, '""')}"`);
          row.push(`"${team.teammates[i].reg_no.replace(/"/g, '""')}"`);
          row.push(`"${team.teammates[i].email.replace(/"/g, '""')}"`);
        } else {
          row.push('', '', ''); // Empty columns if member doesn't exist
        }
      }

      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'hackathon_teams.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isAuthenticated) {
    return (
      <div className="card" style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <h2 className="mb-4 mono text-center">ADMIN SYSTEM</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Admin Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2 className="mb-4 mono">ADMIN DASHBOARD</h2>
      
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 className="mono text-gold mb-4">SYSTEM SETTINGS</h3>
          <form onSubmit={handleSaveSettings}>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <input 
                type="checkbox" 
                id="ps_visible"
                checked={settings.problem_statement_visible === 'true'}
                onChange={e => setSettings({...settings, problem_statement_visible: e.target.checked ? 'true' : 'false'})}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="ps_visible" style={{ marginBottom: 0, cursor: 'pointer', color: 'var(--accent-gold)' }}>Make Problem Statements Visible to Public</label>
            </div>

            <h4 className="mono mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>MECHANICAL CATEGORY</h4>
            
            <div className="form-group">
              <label>Problem Statement Description</label>
              <textarea 
                className="form-control" rows="4"
                value={settings.mech_problem_statement || ''}
                onChange={e => setSettings({...settings, mech_problem_statement: e.target.value})}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Problem Statement File (Image or PDF)</label>
              <input type="file" accept="image/*,.pdf" className="form-control" onChange={e => setMechPsFile(e.target.files[0])} />
              {settings.mech_ps_file && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={settings.mech_ps_file.startsWith('http') ? settings.mech_ps_file : `http://localhost:3000${settings.mech_ps_file}`} target="_blank" rel="noopener noreferrer" className="text-gold" style={{ fontSize: '0.8rem' }}>View Current File</a>
                </div>
              )}
            </div>

            <div className="form-group mb-4">
              <label>Constraints File (PDF)</label>
              <input type="file" accept=".pdf" className="form-control" onChange={e => setMechConstraintsFile(e.target.files[0])} />
              {settings.mech_constraints && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={settings.mech_constraints.startsWith('http') ? settings.mech_constraints : `http://localhost:3000${settings.mech_constraints}`} target="_blank" rel="noopener noreferrer" className="text-gold" style={{ fontSize: '0.8rem' }}>View Current Constraints</a>
                </div>
              )}
            </div>

            <h4 className="mono mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>MULTI-DISCIPLINARY CATEGORY</h4>
            
            <div className="form-group">
              <label>Problem Statement Description</label>
              <textarea 
                className="form-control" rows="4"
                value={settings.multi_problem_statement || ''}
                onChange={e => setSettings({...settings, multi_problem_statement: e.target.value})}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>Problem Statement File (Image or PDF)</label>
              <input type="file" accept="image/*,.pdf" className="form-control" onChange={e => setMultiPsFile(e.target.files[0])} />
              {settings.multi_ps_file && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={settings.multi_ps_file.startsWith('http') ? settings.multi_ps_file : `http://localhost:3000${settings.multi_ps_file}`} target="_blank" rel="noopener noreferrer" className="text-gold" style={{ fontSize: '0.8rem' }}>View Current File</a>
                </div>
              )}
            </div>

            <div className="form-group mb-4">
              <label>Constraints File (PDF)</label>
              <input type="file" accept=".pdf" className="form-control" onChange={e => setMultiConstraintsFile(e.target.files[0])} />
              {settings.multi_constraints && (
                <div style={{ marginTop: '0.5rem' }}>
                  <a href={settings.multi_constraints.startsWith('http') ? settings.multi_constraints : `http://localhost:3000${settings.multi_constraints}`} target="_blank" rel="noopener noreferrer" className="text-gold" style={{ fontSize: '0.8rem' }}>View Current Constraints</a>
                </div>
              )}
            </div>
            
            <h4 className="mono mb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>GENERAL</h4>
            <div className="form-group">
              <label>WhatsApp Group Link</label>
              <input 
                type="url" 
                className="form-control" 
                value={settings.whatsapp_link || ''}
                onChange={e => setSettings({...settings, whatsapp_link: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'SAVING...' : 'SAVE SETTINGS'}
            </button>
          </form>
        </div>
        
        <div className="card" style={{ overflowY: 'auto', maxHeight: '600px' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="mono text-gold mb-0">REGISTERED TEAMS ({teams.length})</h3>
            <button type="button" onClick={exportToCSV} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Export CSV
            </button>
          </div>
          {teams.length === 0 ? (
            <p className="text-secondary">No teams registered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {teams.map(team => (
                <div key={team.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'rgba(0,0,0,0.3)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-gold">{team.team_name}</h4>
                    <div style={{ textAlign: 'right' }}>
                      <span className="mono text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', display: 'block' }}>{team.branch}</span>
                      {team.problem_statement_selection && (
                        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', display: 'block', marginTop: '2px' }}>{team.problem_statement_selection}</span>
                      )}
                    </div>
                  </div>
                  <p className="mb-1" style={{ fontSize: '0.9rem' }}>
                    <strong>Leader:</strong> {team.leader_name} <br/>
                    <span className="text-secondary">{team.leader_email} | {team.leader_phone}</span>
                  </p>
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong className="text-secondary">Teammates:</strong>
                    <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.25rem' }}>
                      {team.teammates && team.teammates.map((member, i) => (
                        <li key={i}>- {member.name} ({member.reg_no}) - {member.email}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
