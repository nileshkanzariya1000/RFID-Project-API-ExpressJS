const client = require("../config/db");

async function editTokenDetails(req, res) {
  const { token_id, name, price, duration_day, description, status } = req.body;

  // Validate input fields
  if (!token_id || (!name && !price && !duration_day && !description && status === undefined)) {
    return res.status(400).json({ error: "token_id is required and at least one field to update (name, price, duration_day, description, status) must be provided" });
  }

  // Validate status field (if provided) to be either 0 or 1
  if (status !== undefined && status !== 0 && status !== 1) {
    return res.status(400).json({ error: "status must be either 0 or 1" });
  }

  try {
    // Check if the token exists in the "token" table
    const tokenCheck = await client.query(
      `SELECT * FROM token_detail WHERE token_id = $1`,
      [token_id]
    );

    if (tokenCheck.rows.length === 0) {
      return res.status(404).json({ error: "Token not found" });
    }

    // Dynamically build the SET clause for updating only the provided fields
    const updateFields = [];
    const values = [token_id]; // The first value is for token_id
    let queryStr = 'UPDATE token_detail SET ';

    if (name) {
      updateFields.push('name = $' + (values.length + 1));
      values.push(name);
    }
    if (price) {
      updateFields.push('price = $' + (values.length + 1));
      values.push(price);
    }
    if (duration_day) {
      updateFields.push('duration_day = $' + (values.length + 1));
      values.push(duration_day);
    }
    if (description) {
      updateFields.push('description = $' + (values.length + 1));
      values.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = $' + (values.length + 1));
      values.push(status);
    }

    // Add the condition to the query
    queryStr += updateFields.join(', ') + ' WHERE token_id = $1';

    // Execute the update query
    const updateResult = await client.query(queryStr, values);

    res.status(200).json({
      message: "Token updated successfully",
    });

  } catch (err) {
    console.error("Error updating token:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = editTokenDetails;
