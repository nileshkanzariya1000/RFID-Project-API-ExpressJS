const client = require("../config/db");

async function getAllUsers(req, res) {
  try {
    const result = await client.query(
      "SELECT user_id, name, email, mobile, status FROM users"
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = getAllUsers;
