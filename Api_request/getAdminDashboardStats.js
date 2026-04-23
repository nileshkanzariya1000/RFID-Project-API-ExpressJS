const client = require("../config/db");
const moment = require("moment");

async function getAdminDashboardStats(req, res) {
  try {
    // 1. Total Users
    const usersQuery = await client.query("SELECT COUNT(*) as total_users FROM users");
    const total_users = parseInt(usersQuery.rows[0].total_users || 0);

    // 2. Total Clients
    const clientsQuery = await client.query("SELECT COUNT(*) as total_clients FROM client");
    const total_clients = parseInt(clientsQuery.rows[0].total_clients || 0);

    // 3. Active Client Tokens
    const activeTokensQuery = await client.query("SELECT COUNT(*) as active_tokens FROM client_token WHERE status = 0");
    const active_tokens = parseInt(activeTokensQuery.rows[0].active_tokens || 0);

    // 4. Today's unique punches/attendance across system
    const todayStart = moment().startOf("day").unix();
    const todayEnd = moment().endOf("day").unix();
    const punchesTodayQuery = await client.query(`
      SELECT COUNT(DISTINCT user_id) as total_attendance
      FROM punch
      WHERE timestamp BETWEEN $1 AND $2
    `, [todayStart, todayEnd]);
    const today_attendance = parseInt(punchesTodayQuery.rows[0].total_attendance || 0);

    // 5. Recent Activity (Latest token assignments / subject creations)
    const recentActivityQuery = await client.query(`
      SELECT 
        c.name as client_name,
        ct.subject_name,
        ct.purchase_date,
        ct.status
      FROM client_token ct
      JOIN client c ON ct.client_id = c.client_id
      ORDER BY ct.purchase_date DESC
      LIMIT 8
    `);
    
    const recentActivity = recentActivityQuery.rows.map(row => ({
      clientName: row.client_name,
      subjectName: row.subject_name,
      date: row.purchase_date ? moment(row.purchase_date).format("MMM DD, YYYY") : "—",
      status: row.status
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          total_users,
          total_clients,
          active_tokens,
          today_attendance
        },
        recentActivity
      }
    });

  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = getAdminDashboardStats;
