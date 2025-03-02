const client = require("../config/db");

async function addNewSubject(req, res) {
  const { token_id, pass_key, status, purchase_date, expire_date, client_id ,subject_name} = req.body;

  // Validate input fields
  if (!token_id || !pass_key || !status || !purchase_date || !expire_date || !client_id || !subject_name) {
    return res.status(400).json({ success:false,message: "All fields (token_id, pass_key, status, purchase_date, expire_date, client_id,subject_name) are required" });
  }

  try {
    // Insert the new subject into the "subject_detail" table (or the relevant table name in your database)
    const result = await client.query(
      `INSERT INTO client_token (token_id, pass_key, status, purchase_date, expire_date, client_id,subject_name) 
       VALUES ($1, $2, $3, $4, $5, $6,$7)`,
      [token_id, pass_key, status, purchase_date, expire_date, client_id ,subject_name]
    );

    // Send response after successful insertion
    res.status(201).json({
      success: true,
      message: "New subject added successfully",
    });

  } catch (err) {
    console.error("Error adding new subject:", err);
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = addNewSubject;
