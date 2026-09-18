import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    team_name: '',
    leader_name: '',
    leader_email: '',
    leader_phone: '',
    branch: '',
    problem_statement_selection: ''
  });
  
  const [teammates, setTeammates] = useState([{ name: '', reg_no: '', email: '' }, { name: '', reg_no: '', email: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTeammateChange = (index, field, value) => {
    const newTeammates = [...teammates];
    newTeammates[index][field] = value;
    setTeammates(newTeammates);
  };

  const addTeammate = () => {
    if (teammates.length < 4) { // Max 5 total members (1 leader + 4 teammates)
      setTeammates([...teammates, { name: '', reg_no: '', email: '' }]);
    }
  };

  const removeTeammate = (index) => {
    const newTeammates = teammates.filter((_, i) => i !== index);
    setTeammates(newTeammates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    const totalMembers = 1 + teammates.filter(t => t.name.trim() !== '').length;
    if (totalMembers < 3 || totalMembers > 5) {
      setError('Team size must be between 3 and 5 members.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teammates: teammates.filter(t => t.name.trim() !== '')
        })
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      alert('Team registered successfully!');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2 className="mb-4 mono text-center">TEAM REGISTRATION</h2>
      
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Team Name</label>
            <input type="text" name="team_name" className="form-control" required value={formData.team_name} onChange={handleFormChange} />
          </div>
          
          <div className="form-group">
            <label>Team Leader Name</label>
            <input type="text" name="leader_name" className="form-control" required value={formData.leader_name} onChange={handleFormChange} />
          </div>

          <div className="form-group">
            <label>Leader Email ID</label>
            <input type="email" name="leader_email" className="form-control" required value={formData.leader_email} onChange={handleFormChange} />
          </div>

          <div className="form-group">
            <label>Leader Phone Number</label>
            <input type="tel" name="leader_phone" className="form-control" required value={formData.leader_phone} onChange={handleFormChange} />
          </div>
          
          <div className="form-group">
            <label>Branch / Program</label>
            <input type="text" name="branch" className="form-control" placeholder="e.g. Mechanical, B.Tech CSE" required value={formData.branch} onChange={handleFormChange} />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Target Problem Statement</label>
            <select name="problem_statement_selection" className="form-control" required value={formData.problem_statement_selection} onChange={handleFormChange}>
              <option value="" disabled>Select your problem statement...</option>
              <optgroup label="Mechanical Track">
                <option value="Mechanical - 1">Mechanical - 1</option>
                <option value="Mechanical - 2">Mechanical - 2</option>
                <option value="Mechanical - 3">Mechanical - 3</option>
                <option value="Mechanical - 4">Mechanical - 4</option>
              </optgroup>
              <optgroup label="Multi-Disciplinary Track">
                <option value="Multi-Disciplinary - A">Multi-Disciplinary - A</option>
                <option value="Multi-Disciplinary - B">Multi-Disciplinary - B</option>
                <option value="Multi-Disciplinary - C">Multi-Disciplinary - C</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div className="mt-4 mb-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="mono text-gold">TEAMMATES</h3>
            {teammates.length < 4 && (
              <button type="button" className="btn btn-gold" style={{ padding: '0.25rem 0.75rem', fontSize: '1.2rem' }} onClick={addTeammate}>+</button>
            )}
          </div>
          <p className="text-secondary mb-4" style={{ fontSize: '0.8rem' }}>A team must have 3 to 5 members in total (including leader).</p>

          {teammates.map((teammate, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center" style={{ flexWrap: 'wrap' }}>
              <input type="text" placeholder={`Teammate ${idx + 1} Name`} className="form-control" style={{ flex: '1', minWidth: '150px' }} value={teammate.name} onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)} />
              <input type="text" placeholder="Reg No" className="form-control" style={{ width: '120px' }} value={teammate.reg_no} onChange={(e) => handleTeammateChange(idx, 'reg_no', e.target.value)} />
              <input type="email" placeholder="Email ID" className="form-control" style={{ width: '180px' }} value={teammate.email} onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)} />
              {teammates.length > 2 && (
                <button type="button" className="btn" style={{ borderColor: '#ff3232', color: '#ff3232', padding: '0.5rem 1rem' }} onClick={() => removeTeammate(idx)}>X</button>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-gold" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'REGISTERING...' : 'REGISTER TEAM'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
