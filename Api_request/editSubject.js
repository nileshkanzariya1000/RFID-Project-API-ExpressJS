const client = require("../config/db");

async function editSubject(req, res) {
  const { ct_id, client_id, subject_name } = req.body;

  // Validate input fields
  if (!ct_id || !client_id || !subject_name) {
    return res.status(400).json({ success:false,message: "ct_id, client_id, and subject_name are required" });
  }

  try {
    // Perform the update query to change the subject_name for the given ct_id and client_id
    const result = await client.query(
      `UPDATE client_token
       SET subject_name = $1
       WHERE ct_id = $2 AND client_id = $3
       `,
      [subject_name, ct_id, client_id]
    );

    // Check if the update affected any rows
    if (result.rowCount === 0) {
      return res.status(404).json({ success:false,message: "Subject not found or you are not authorized to edit this subject." });
    }

    // Return the updated subject data
    res.status(200).json({
      success: true,
      message: "Subject name updated successfully",
     
    });

  } catch (err) {
    console.error("Error updating subject:", err);
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = editSubject;
