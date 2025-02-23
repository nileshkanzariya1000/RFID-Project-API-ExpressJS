const client = require("../config/db");
async function userLogin(req, res) {
  const { email, password, ...extraFields } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({ error: 'Unexpected fields in request' });
  }

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userData = result.rows[0];
    if (userData.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if(userData.status !== 0){
        return res.status(403).json({ error: 'Account is inactive' });
    }

    res.json({ message: 'Login successful',
        user_id:userData.user_id,
        user_name:userData.name,
        user_email:userData.email,
        user_mobile:userData.mobile,
        user_rfid:userData.rfid
     });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = userLogin;
