const pool = require("../config/db");
const moment = require("moment");

async function updateToken(req, res) {
  const { ct_id, token_id } = req.body;

  if (!ct_id || !token_id) {
    return res.status(400).json({ success:false,message: "Missing required fields (ct_id, token_id)" });
  }

  try {
    // 1️⃣ Fetch duration_days from token_detail based on token_id
    const tokenDetailQuery = await pool.query(
      `SELECT duration_day FROM token_detail WHERE token_id = $1`,
      [token_id]
    );

    if (tokenDetailQuery.rows.length === 0) { 
      return res.status(404).json({ success:false,message: "Token ID not found in token_detail" });
    }

    const durationDays = tokenDetailQuery.rows[0].duration_day;

    // 2️⃣ Get purchase_date, expire_date, and status from client_token
    const clientTokenQuery = await pool.query(
      `SELECT purchase_date, expire_date, status FROM client_token WHERE ct_id = $1`,
      [ct_id]
    );

    if (clientTokenQuery.rows.length === 0) {
      return res.status(404).json({ success:false,message: "Invalid client token ID" });
    }

    let { purchase_date, expire_date, status } = clientTokenQuery.rows[0];
    const today = moment().format("YYYY-MM-DD");
    console.log(status);
    // 3️⃣ If status = 0, return "Plan not purchased"
    if (status == 1) {
      return res.status(403).json({
        success: false,
        message: "Plan not purchased (deactivated)",
        purchase_date: null,
        expire_date: null,
        status
      });
    }

    // 4️⃣ If purchase_date is NULL, set it to today's date
    if (!purchase_date) {
      purchase_date = today;
    }

    // 5️⃣ If the plan is still active, return response
    if (expire_date && moment(today).isBefore(expire_date, "day")) {
      return res.status(200).json({
        success: true,
        message: "Your plan is still active",
        purchase_date,
        expire_date,
        duration_days: durationDays,
        status
      });
    }

    // 6️⃣ If plan expired or needs update, calculate new expire_date
    let newExpireDate = moment(purchase_date).add(durationDays, "days").format("YYYY-MM-DD");

    // 7️⃣ Update purchase_date, expire_date, token_id, and set status = 1 (active)
    const updateQuery = await pool.query(
      `UPDATE client_token 
       SET purchase_date = $1, expire_date = $2, token_id = $3, status = 1
       WHERE ct_id = $4`,
      [today, newExpireDate, token_id, ct_id]
    );

    if (updateQuery.rowCount === 0) {
      return res.status(404).json({ success:false,message: "Failed to update. No matching record found." });
    }

    // 8️⃣ Return success response with updated details
    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      purchase_date,
      expire_date: newExpireDate,
      duration_days: durationDays,
      status: 1
    });

  } catch (err) {
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = updateToken;
