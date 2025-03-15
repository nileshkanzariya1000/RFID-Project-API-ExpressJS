const client = require("../config/db");

async function updateClientStatus(req, res) {
  const { client_id, status } = req.body;

  // Validate input
  if (client_id === undefined || status === undefined) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (![0, 1].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value. Use 1 for active and 0 for inactive." });
  }

  try {
    // Check if the client exists
    const clientCheck = await client.query("SELECT * FROM client WHERE client_id = $1", [client_id]);

    if (clientCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    // Update client status
    await client.query(
      "UPDATE client SET status = $1 WHERE client_id = $2",
      [status, client_id]
    );

    res.status(200).json({
      success: true,
      message: `Client status updated to ${status === 1 ? "active" : "inactive"}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = updateClientStatus;
