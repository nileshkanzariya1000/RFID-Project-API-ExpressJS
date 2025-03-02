const client = require("../config/db");

async function getUserSubjects(req, res) {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ success:false,message: "User ID is required" });
  }

  try {
    const result = await client.query(
      `SELECT ct.ct_id , ct.subject_name 
       FROM section s
       JOIN client_token ct ON s.ct_id = ct.ct_id
       WHERE s.user_id = $1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success:false,message: "No subjects found for this user" });
    }

    res.status(200).json({success:true,data:result.rows});

  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = getUserSubjects;
