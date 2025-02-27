const client = require("../config/db");

async function deleteUserFromSubject(req, res) {
  const { ct_id, user_id } = req.body;

  // Check if ct_id and user_id are provided
  if (!ct_id || !user_id) {
    return res.status(400).json({ error: "Both ct_id and user_id are required" });
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

    // Delete the record from the "section" table
    await client.query(
      `DELETE FROM section WHERE ct_id = $1 AND user_id = $2`,
      [ct_id, user_id]
    );

    res.status(200).json({
      message: "User removed from subject successfully",
    });

  } catch (err) {
    console.error("Error deleting user from subject:", err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = deleteUserFromSubject;
