const client = require("../config/db");

async function getTokenById(req, res) {
  const { token_id } = req.query; 
 
  try {
    const result = await client.query(
      `SELECT * FROM token_detail WHERE token_id = $1`, 
      [token_id] 
    );
  
    // Check if a token is found
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false, 
        message: "Token not found"
      });
    }

 
    res.status(200).json({
      success: true,
      data: result.rows[0], 
    });
  } catch (err) {
    console.error("Error fetching token by ID:", err);
    res.status(500).json({
      success: false, 
      message: "Internal server error", 
      error: err.message
    });
  }
}

module.exports = getTokenById;
