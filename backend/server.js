require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Setup multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Helper to get all settings from Supabase
async function getSettings() {
  const { data, error } = await supabase.from('settings').select('*');
  if (error) throw error;
  
  const settings = {};
  data.forEach(row => {
    settings[row.key] = row.value;
  });
  return settings;
}

// API to get settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to update settings (Admin)
app.post('/api/settings', upload.fields([
  { name: 'mech_ps_file', maxCount: 1 }, 
  { name: 'mech_constraints', maxCount: 1 },
  { name: 'multi_ps_file', maxCount: 1 },
  { name: 'multi_constraints', maxCount: 1 }
]), async (req, res) => {
  const { password, mech_problem_statement, multi_problem_statement, problem_statement_visible, whatsapp_link } = req.body;
  
  if (password !== 'admin123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (mech_problem_statement !== undefined) {
      await supabase.from('settings').upsert({ key: 'mech_problem_statement', value: mech_problem_statement });
    }
    if (multi_problem_statement !== undefined) {
      await supabase.from('settings').upsert({ key: 'multi_problem_statement', value: multi_problem_statement });
    }
    if (problem_statement_visible !== undefined) {
      await supabase.from('settings').upsert({ key: 'problem_statement_visible', value: problem_statement_visible });
    }
    if (whatsapp_link !== undefined) {
      await supabase.from('settings').upsert({ key: 'whatsapp_link', value: whatsapp_link });
    }
    
    if (req.files) {
      const handleUpload = async (fileArray, keyName) => {
        if (fileArray && fileArray[0]) {
          const file = fileArray[0];
          const fileName = `${keyName}_${uuidv4()}_${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const { error } = await supabase.storage.from('fusion').upload(fileName, file.buffer, { contentType: file.mimetype, upsert: true });
          if (error) throw error;
          const { data: publicUrlData } = supabase.storage.from('fusion').getPublicUrl(fileName);
          await supabase.from('settings').upsert({ key: keyName, value: publicUrlData.publicUrl });
        }
      };

      await handleUpload(req.files.mech_ps_file, 'mech_ps_file');
      await handleUpload(req.files.mech_constraints, 'mech_constraints');
      await handleUpload(req.files.multi_ps_file, 'multi_ps_file');
      await handleUpload(req.files.multi_constraints, 'multi_constraints');
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123') {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

// Register Team
app.post('/api/teams', async (req, res) => {
  const teamData = req.body;
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert([
        {
          team_name: teamData.team_name,
          leader_name: teamData.leader_name,
          leader_email: teamData.leader_email,
          leader_phone: teamData.leader_phone,
          branch: teamData.branch,
          problem_statement_selection: teamData.problem_statement_selection,
          teammates: teamData.teammates
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json({ success: true, id: data[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Teams (Admin only)
app.get('/api/teams', async (req, res) => {
  const { password } = req.query;
  if (password !== 'admin123') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
