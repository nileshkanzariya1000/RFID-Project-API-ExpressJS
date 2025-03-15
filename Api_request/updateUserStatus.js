const client = require("../config/db");

async function updateUserStatus(req, res) {
  const { user_id, status } = req.body;

  // Validate input
  if (user_id === undefined || status === undefined) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (![0, 1].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value. Use 1 for active and 0 for inactive." });
  }

  try {
    // Check if the client exists
    const userCheck = await client.query("SELECT * FROM users WHERE user_id = $1", [user_id]);

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "user not found" });
    }

    // Update client status
    await client.query(
      "UPDATE users SET status = $1 WHERE user_id = $2",
      [status, user_id]
    );

    res.status(200).json({
      success: true,
      message: `User status updated to ${status === 1 ? "active" : "inactive"}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = updateUserStatus;
