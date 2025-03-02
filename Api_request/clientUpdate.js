const client = require("../config/db");

async function clientUpdate(req, res) {
  const { client_id, name, email, mobile } = req.body;

  if (!client_id || !name || !email || !mobile) {
    return res.status(400).json({ success:false,message: "Missing required fields" });
  }

  try {
    // Check if the client exists
    const clientCheck = await client.query("SELECT * FROM client WHERE client_id = $1", [client_id]);
    
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ success:false,message: "Client not found" });
    }

    // Update client details
    await client.query(
      "UPDATE client SET name = $1, email = $2, mobile = $3 WHERE client_id = $4",
      [name, email, mobile, client_id]
    );

    res.status(200).json({ 
      success: true,
      message: "Client updated successfully" });
  } catch (err) {
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = clientUpdate;
