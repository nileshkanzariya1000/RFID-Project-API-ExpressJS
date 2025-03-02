const client = require("../config/db");

async function clientChangePassword(req, res) {
  const { client_id, current_password, new_password } = req.body;

  if (!client_id || !current_password || !new_password) {
    return res.status(400).json({ success:false,message: "Missing required fields" });
  }

  try {
    // Check if the user exists
    const userCheck = await client.query("SELECT * FROM client WHERE client_id = $1", [client_id]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success:false,message: "User not found" });
    }
 console.log("skjhksad");
    const user = userCheck.rows[0];

    // Verify the current password (plain text comparison)
    if (user.password !== current_password) {
      return res.status(401).json({ success:false,message: "Incorrect current password" });
    }

    // Fix: Wrap "password" in double quotes if it's a reserved keyword
    await client.query(
      'UPDATE client SET "password" = $1 WHERE client_id = $2',
      [new_password, client_id]
    );

    res.status(200).json({ 
      success: true,
      message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = clientChangePassword;
