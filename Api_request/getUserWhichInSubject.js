const client = require("../config/db");

async function getUserWhichInSubject(req, res) {
  try {
    console.log("Received query params:", req.query); // Debugging

    // Extract ct_id from query params
    const { ct_id } = req.query;

    // Validate required parameter
    if (!ct_id) {
      return res.status(400).json({ success: false, message: "ct_id is required" });
    }

    // Query to fetch rfid, user_id, designation from section table and name, email, mobile from user table
    const result = await client.query(
      `SELECT 
          s.rfid, 
          s.user_id, 
          s.designation, 
          u.name, 
          u.email, 
          u.mobile 
       FROM section s
       JOIN "users" u ON s.user_id = u.user_id
       WHERE s.ct_id = $1`,
      [ct_id]
    );

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No records found for this ct_id" });
    }

   
    res.status(200).json({  success: true, data:result.rows });

  } catch (err) {
    console.error("Error fetching section and user info:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = getUserWhichInSubject;
