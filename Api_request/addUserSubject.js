const client = require("../config/db");

async function addUserSubject(req, res) {
  const { user_id, client_id, ct_id, designation, rfid } = req.body;

  if (!user_id || !client_id || !ct_id || !designation || !rfid) {
    return res.status(400).json({ success:false,message: "All fields (user_id, client_id, ct_id, designation, rfid) are required" });
  }

  try {
    // Check if client_id and ct_id exist in client_token table
    const clientCheck = await client.query(
      `SELECT * FROM client_token WHERE client_id = $1 AND ct_id = $2`,
      [client_id, ct_id]
    );

    if (clientCheck.rows.length === 0) {
      return res.status(400).json({ success:false,message: "Invalid client_id or ct_id" });
    }

    // Insert the new record into the "section" table
    await client.query(
      `INSERT INTO section (user_id, ct_id, designation, rfid) 
       VALUES ($1, $2, $3, $4)`,
      [user_id, ct_id, designation, rfid]
    );

    
    res.status(201).json({
      success: true,
      message: "Subject added successfully",
    });

  } catch (err) {
    console.error("Error adding subject:", err);
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = addUserSubject;
