const client = require("../config/db");

async function getUserLeaves(req, res) {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const query = `
      SELECT * FROM leave_requests
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
        const result = await client.query(query, [user_id]);

        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Error fetching user leaves:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = getUserLeaves;
