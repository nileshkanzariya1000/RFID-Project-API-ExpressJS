const client = require("../config/db");
async function adminLogin(req, res) {
  const { username, password, ...extraFields } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success:false,message: 'Missing username or password' });
  }

  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({ success:false,message: 'Unexpected fields in request' });
  }

  try {
    const result = await client.query('SELECT * FROM admin WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success:false,message: 'Invalid email or password' });
    }

    const admin = result.rows[0];
    if (admin.password !== password) {
      return res.status(401).json({ success:false,message: 'Invalid email or password' });
    }

    res.json({ 
      success:true,
      message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = adminLogin;
