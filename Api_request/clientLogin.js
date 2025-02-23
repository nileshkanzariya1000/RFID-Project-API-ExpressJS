const client = require("../config/db");
async function clientLogin(req, res) {
  const { email, password, ...extraFields } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({ error: 'Unexpected fields in request' });
  }

  try {
    const result = await client.query('SELECT * FROM client WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const clientData = result.rows[0];
    if (clientData.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if(clientData.status !== 0){
        return res.status(403).json({ error: 'Account is inactive' });
    }

    res.json({ message: 'Login successful',
        client_id:clientData.client_id,
        client_name:clientData.name,
        client_email:clientData.email,
        client_mobile:clientData.mobile
     });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = clientLogin;
