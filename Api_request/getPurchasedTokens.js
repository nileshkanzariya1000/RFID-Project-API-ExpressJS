const client = require("../config/db");

async function getPurchasedTokens(req, res) {
  try {
    // Query to get all purchased tokens with client details
    const result = await client.query(
      `SELECT ct.*, c.name, c.email 
       FROM client_token ct 
       JOIN client c ON ct.client_id = c.client_id`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No purchased tokens found" });
    }

    // Return the purchased tokens
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("Error fetching purchased tokens:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = getPurchasedTokens;
