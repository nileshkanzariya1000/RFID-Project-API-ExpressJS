const client = require("../config/db");

async function adminChangePassword(req, res) {
  const { username, current_password, new_password } = req.body;

  // Validate request
  if (!username || !current_password || !new_password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Check if the admin exists
    const adminCheck = await client.query("SELECT * FROM admin WHERE username = $1", [username]);
    
    if (adminCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const admin = adminCheck.rows[0];

    // Verify the current password (plain text comparison)
    if (admin.password !== current_password) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // Update password without hashing
    await client.query(
      'UPDATE admin SET password = $1 WHERE username = $2',
      [new_password, username]
    );

    res.status(200).json({ 
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ success: false, message: "Server error: " + err.message });
  }
}

module.exports = adminChangePassword;