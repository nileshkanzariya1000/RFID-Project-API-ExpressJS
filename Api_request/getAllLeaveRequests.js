const client = require("../config/db");

async function getAllLeaveRequests(req, res) {
    try {
        const query = `
      SELECT lr.*, u.name as user_name, u.email as user_email
      FROM leave_requests lr
      JOIN users u ON lr.user_id = u.user_id
      ORDER BY lr.created_at DESC;
    `;
        const result = await client.query(query);

        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Error fetching all leave requests:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = getAllLeaveRequests;
