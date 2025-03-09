const client = require("../config/db");

async function getUserSubjectDetails(req, res) {
    const { user_id, ct_id } = req.query;  // Accept user_id and ct_id as parameters

    if (!user_id || !ct_id) {
        return res.status(400).json({ success: false, message: "user_id and ct_id are required" });
    }

    try {
        // Query to retrieve designation and RFID from the section table
        const result = await client.query(
            `SELECT designation, rfid 
             FROM section 
             WHERE user_id = $1 AND ct_id = $2`, 
            [user_id, ct_id]  // Pass user_id and ct_id as parameters
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No details found for this user_id and ct_id" });
        }

        res.status(200).json({ success: true, data: result.rows });

    } catch (err) {
        console.error("Error fetching user subject details:", err);
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getUserSubjectDetails };
