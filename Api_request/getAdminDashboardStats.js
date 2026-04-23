const client = require("../config/db");
const moment = require("moment");

async function getAdminDashboardStats(req, res) {
  try {
    // Run all queries in parallel (fast ⚡)
    const [
      usersResult,
      clientsResult,
      activeTokensResult,
      todayAttendanceResult,
      recentActivityResult
    ] = await Promise.all([
      client.query(`SELECT COUNT(*) FROM users`),
      client.query(`SELECT COUNT(*) FROM client`),
      client.query(`SELECT COUNT(*) FROM client_token WHERE status = 0`),
      client.query(`
        SELECT COUNT(*) 
        FROM punch 
        WHERE DATE(to_timestamp(timestamp)) = CURRENT_DATE
      `),
      client.query(`
        SELECT 
          c.name AS clientName,
          t.name AS subjectName,
          ct.purchase_date AS date,
          ct.status
        FROM client_token ct
        JOIN client c ON ct.client_id = c.client_id
        JOIN token_detail t ON ct.token_id = t.token_id
        ORDER BY ct.purchase_date DESC
        LIMIT 5
      `)
    ]);

    // Prepare response
    const response = {
      stats: {
        total_users: parseInt(usersResult.rows[0].count),
        total_clients: parseInt(clientsResult.rows[0].count),
        active_tokens: parseInt(activeTokensResult.rows[0].count),
        today_attendance: parseInt(todayAttendanceResult.rows[0].count)
      },
      recentActivity: recentActivityResult.rows.map(row => ({
        ...row,
        date: moment(row.date).format("YYYY-MM-DD")
      }))
    };

    res.status(200).json({
      success: true,
      data: response
    });

  } catch (err) {
    console.log("Dashboard Error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

module.exports = { getAdminDashboardStats };