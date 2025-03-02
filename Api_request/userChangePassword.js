const client = require("../config/db");

async function userChangePassword(req, res) {
  const { user_id, current_password, new_password } = req.body;

  if (!user_id || !current_password || !new_password) {
    return res.status(400).json({ success:false,message: "Missing required fields" });
  }

  try {
    // Check if the user exists
    const userCheck = await client.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success:false,message: "User not found" });
    }

    const user = userCheck.rows[0];

    // Verify the current password (plain text comparison)
    if (user.password !== current_password) {
      return res.status(401).json({ success:false,message: "Incorrect current password" });
    }

    // Update password in the database
    await client.query(
      "UPDATE users SET password = $1 WHERE user_id = $2",
      [new_password, user_id]
    );

    res.status(200).json({ 
      success : true,
      message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = userChangePassword;
