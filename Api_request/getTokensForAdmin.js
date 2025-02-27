const client = require("../config/db");

async function getTokensForAdmin(req, res) {
  try {
    // Query to get all tokens with status 0
    const result = await client.query(
      `SELECT * FROM token_detail `
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No tokens found" });
    }

    // Return the tokens with status 0
    res.status(200).json({
       data:result.rows
    });

  } catch (err) {
    console.error("Error fetching tokens:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = getTokensForAdmin;
