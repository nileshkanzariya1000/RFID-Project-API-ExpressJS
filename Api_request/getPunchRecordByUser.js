const client = require("../config/db");
const moment = require("moment-timezone"); // Use moment-timezone

async function getPunchRecordByUser(req, res) {
  try {
    const { user_id, ct_id, from_date, to_date } = req.query;

    // Validate required inputs
    if (!user_id || !ct_id) {
      return res.status(400).json({ message: "user_id and ct_id are required" });
    }

    let query = `SELECT * FROM punch WHERE user_id = $1 AND ct_id = $2`;
    let values = [user_id, ct_id];

    // Convert only the date (YYYY-MM-DD) to epoch timestamps
    let fromEpoch, toEpoch;

    if (from_date) {
      fromEpoch = moment.tz(from_date, "YYYY-MM-DD", "Asia/Kolkata").startOf("day").unix();
    }

    // If to_date is not provided, use the current date
    const toDateValue = to_date ? moment.tz(to_date, "YYYY-MM-DD", "Asia/Kolkata") : moment.tz("Asia/Kolkata"); // Defaults to today
    toEpoch = toDateValue.endOf("day").unix();

    console.log("Converted from_date to epoch:", fromEpoch || "Not provided");
    console.log("Converted to_date to epoch:", toEpoch);

    if (fromEpoch) {
      query += ` AND timestamp BETWEEN $3 AND $4`;
      values.push(fromEpoch, toEpoch);
    }

    const result = await client.query(query, values);

    console.log("Query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Punch record not found" });
    }

    // Convert timestamps to readable date and time using Moment.js with timezone
    const formattedData = result.rows
      .filter(row => row.timestamp >= 1000000000) // Ignore invalid timestamps
      .map(row => ({
        ...row,
        timestamp: moment.unix(row.timestamp).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss") // Convert with timezone
      }));

    res.status(200).json({
      data: formattedData
    });

  } catch (err) {
    console.error("Error fetching punch record:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = getPunchRecordByUser;
