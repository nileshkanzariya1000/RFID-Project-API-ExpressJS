const client = require("../config/db");

async function updatePurchasedTokenStatus(req, res) {
  const { ct_id, status } = req.body;

  // Validate input
  if (ct_id === undefined || status === undefined) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (![0, 1].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status value. Use 0 for active and 1 for inactive." });
  }

  try {
    // Check if the client token exists
    const tokenCheck = await client.query("SELECT * FROM client_token WHERE ct_id = $1", [ct_id]);

    if (tokenCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Purchased token not found" });
    }

    // Update client token status
    // 0 is active, 1 is inactive
    await client.query(
      "UPDATE client_token SET status = $1 WHERE ct_id = $2",
      [status, ct_id]
    );

    res.status(200).json({
      success: true,
      message: `Purchased token status updated to ${status === 0 ? "active" : "inactive"}`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = updatePurchasedTokenStatus;
