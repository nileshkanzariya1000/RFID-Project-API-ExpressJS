const client = require("../config/db");

async function userUpdate(req, res) {
  const { user_id, name, email, mobile } = req.body;

  if (!user_id || !name || !email || !mobile) {
    return res.status(400).json({  success:false,message: "Missing required fields" });
  }

  try {
    // Check if the client exists
    const clientCheck = await client.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    
    if (clientCheck.rows.length === 0) {
      return res.status(404).json({  success:false,message: "User not found" });
    }

    // Update client details
    await client.query(
      "UPDATE users SET name = $1, email = $2, mobile = $3 WHERE user_id = $4",
      [name, email, mobile, user_id]
    );

    res.status(200).json({ 
      success: true,
      message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = userUpdate;
