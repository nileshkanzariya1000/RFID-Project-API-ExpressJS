const client = require("../config/db");

async function addNewToken(req, res) {
  const { name, price, duration_day, description } = req.body;

  // Validate input fields
  if (!name || !price || !duration_day || !description) {
    return res.status(400).json({ success:false,message: "All fields (name, price, duration_day, description) are required" });
  }

  try {
    // Insert the new token into the "token" table
    const result = await client.query(
      `INSERT INTO token_detail (name, price, duration_day, description) 
       VALUES ($1, $2, $3, $4)`,
      [name, price, duration_day, description]
    );

    // Send response after successful insertion
    res.status(201).json({
      success: true,
      message: "New token added successfully",
    });

  } catch (err) {
    console.error("Error adding new token:", err);
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = addNewToken;
