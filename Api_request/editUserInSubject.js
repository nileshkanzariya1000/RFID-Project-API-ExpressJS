const client = require("../config/db");

async function editUserInSubject(req, res) {
  const { ct_id, user_id, designation, rfid } = req.body;

  // Check if ct_id, user_id, and at least one field to update is provided
  if (!ct_id || !user_id || (!designation && !rfid)) {
    return res.status(400).json({ error: "ct_id, user_id, and at least one field (designation, rfid) are required" });
  }

  try {
    // Check if the user exists in the "section" table with the given ct_id and user_id
    const sectionCheck = await client.query(
      `SELECT * FROM section WHERE ct_id = $1 AND user_id = $2`,
      [ct_id, user_id]
    );

    if (sectionCheck.rows.length === 0) {
      return res.status(404).json({ error: "No such user found in this subject" });
    }

    // Dynamically build the SET clause for updating only the provided fields
    const updateFields = [];
    const values = [ct_id, user_id]; // Initial values are for ct_id and user_id
    let queryStr = 'UPDATE section SET ';

    if (designation) {
      updateFields.push('designation = $' + (values.length + 1));
      values.push(designation);
    }
    if (rfid) {
      updateFields.push('rfid = $' + (values.length + 1));
      values.push(rfid);
    }

    // Add the condition to the query
    queryStr += updateFields.join(', ') + ' WHERE ct_id = $1 AND user_id = $2 RETURNING *';

    // Execute the update query
    const updateResult = await client.query(queryStr, values);

    res.status(200).json({
      message: "User updated successfully"
    });

  } catch (err) {
    console.error("Error updating user in subject:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = editUserInSubject;
