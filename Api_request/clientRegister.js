const client = require("../config/db");

async function clientRegister(req, res) {
  const { name, email, password, mobile, ...extraFields } = req.body;


  if (!name || !email || !password || !mobile) {
    return res.status(400).json({ success:false,message: "Missing required fields" });
  }

  
  if (Object.keys(extraFields).length > 0) {
    return res.status(400).json({ success:false,message: "Unexpected fields in request" });
  }

  try {
   
    const emailCheck = await client.query("SELECT * FROM client WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ success:false,message: "Email already registered" });
    }

    
    const result = await client.query(
      "INSERT INTO client (name, email, password, mobile) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, mobile]
    );

    res.status(201).json({
      success:true,
      message: "Client registered successfully"
      
    });
  } catch (err) {
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = clientRegister;
