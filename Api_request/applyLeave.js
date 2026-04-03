const client = require("../config/db");

async function applyLeave(req, res) {
    const { user_id, reason, start_date, end_date } = req.body;

    if (!user_id || !reason || !start_date || !end_date) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const query = `
      INSERT INTO leave_requests (user_id, reason, start_date, end_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
        const values = [user_id, reason, start_date, end_date];
        const result = await client.query(query, values);

        res.status(201).json({ success: true, message: "Leave applied successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Error applying leave:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = applyLeave;
