const client = require("../config/db");

async function getPunchRecordBySubject(req, res) {
  try {
    console.log("Received query params:", req.query); // Debugging

    // Extract parameters
    const { ct_id, from_date, to_date } = req.query;

    // Validate required parameter
    if (!ct_id) {
      return res.status(400).json({ success: false, message: "ct_id is required" });
    }

    // Convert from_date and to_date to Unix timestamps (seconds)
    let fromTimestamp, toTimestamp;

    if (from_date) {
      fromTimestamp = Math.floor(new Date(from_date).setHours(0, 0, 0, 0) / 1000);
    } else {
      return res.status(400).json({ success: false, message: "from_date is required" });
    }

    // If to_date is not provided, set it to today's date at 23:59:59
    if (to_date) {
      toTimestamp = Math.floor(new Date(to_date).setHours(23, 59, 59, 999) / 1000);
    } else {
      let currentDate = new Date();
      toTimestamp = Math.floor(currentDate.setHours(23, 59, 59, 999) / 1000);
    }

    console.log("Converted from_timestamp:", fromTimestamp);
    console.log("Converted to_timestamp:", toTimestamp);

    // Single query to fetch all required data: user_id, designation, subject_name, user_name, and timestamp
    const result = await client.query(
      `SELECT 
          p.user_id, 
          COALESCE(s.designation, 'No Designation') AS designation, 
          ct.subject_name, 
          COALESCE(u.name, 'Unknown User') AS name,
          p.timestamp
       FROM punch p
       JOIN client_token ct ON p.ct_id = ct.ct_id
       LEFT JOIN section s ON p.user_id = s.user_id AND p.ct_id = s.ct_id  -- Join with section for designation
       LEFT JOIN users u ON p.user_id = u.user_id  -- Join with users table for user name
       WHERE p.ct_id = $1
       AND p.timestamp BETWEEN $2 AND $3
       ORDER BY p.timestamp`,
      [ct_id, fromTimestamp, toTimestamp]
    );

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No punch records found for this date range" });
    }

    // Format the timestamp to a readable date format
    const formattedData = result.rows.map(row => ({
      user_id: row.user_id,
      name: row.name,
      designation: row.designation,
      subject_name: row.subject_name || "No Subject",
      timestamp: new Date(row.timestamp * 1000).toISOString().replace("T", " ").split(".")[0] // Convert to readable date
    }));

    res.status(200).json({ ct_id: ct_id, success: true, data: formattedData });

  } catch (err) {
    console.error("Error fetching punch record:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = getPunchRecordBySubject;
