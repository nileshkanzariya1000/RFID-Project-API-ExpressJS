const client = require("../config/db");

async function clientRegister(req, res) {
  const { name, email, password, mobile, ...extraFields } = req.body;


  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  
  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({ error: "Unexpected fields in request" });
  }

  try {
   
    const emailCheck = await client.query("SELECT * FROM client WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    
    const result = await client.query(
      "INSERT INTO client (name, email, password, mobile) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, mobile]
    );

    res.status(201).json({
      message: "Client registered successfully"
      
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = clientRegister;
