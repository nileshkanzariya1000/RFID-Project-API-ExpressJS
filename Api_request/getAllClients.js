const client = require("../config/db");

async function getAllClients(req, res) {
  try {
    const result = await client.query(
      `SELECT client_id, name, email, mobile, status FROM client`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No clients found" });
    }

    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = getAllClients;
