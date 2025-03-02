const client = require("../config/db");

async function getClientSubjects(req, res) {
  const { client_id } = req.query;

  if (!client_id) {
    return res.status(400).json({ success:false,message: "Client ID is required" });
  }

  try {
    const result = await client.query(
      `SELECT ct_id, subject_name
       FROM client_token
       WHERE client_id = $1`, 
      [client_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success:false,message: "No subjects found for this client" });
    }

    res.status(200).json({success:true,data:result.rows});

  } catch (err) {
    console.error("Error fetching client subjects:", err);
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = getClientSubjects;
