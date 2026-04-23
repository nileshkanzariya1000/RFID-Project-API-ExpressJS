const client = require("../config/db");

async function updateLeaveStatus(req, res) {
    const { leave_id, status } = req.body;

    if (!leave_id || !status) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    try {
        const query = `
      UPDATE leave_requests
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
        const result = await client.query(query, [status, leave_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Leave request not found" });
        }

        res.status(200).json({ success: true, message: "Leave status updated", data: result.rows[0] });
    } catch (err) {
        console.error("Error updating leave status:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = updateLeaveStatus;
