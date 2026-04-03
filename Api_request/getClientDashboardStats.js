const client = require("../config/db");
const moment = require("moment");

async function getClientDashboardStats(req, res) {
    const { client_id } = req.query;

    if (!client_id) {
        return res.status(400).json({ success: false, message: "client_id is required" });
    }

    try {
        const today = moment().format("YYYY-MM-DD");
        const sevenDaysAgo = moment().subtract(6, "days").format("YYYY-MM-DD");

        // 1. Total Employees (Assigned to any subject owned by this client)
        const totalEmployeesQuery = await client.query(`
      SELECT COUNT(DISTINCT usd.user_id) as total_employees
      FROM user_subject_detail usd
      JOIN client_token ct ON usd.ct_id = ct.ct_id
      WHERE ct.client_id = $1
    `, [client_id]);
        const totalEmployees = parseInt(totalEmployeesQuery.rows[0]?.total_employees || 0);

        // 2. Today's Attendance Stats (Present/Late)
        const todayStatsQuery = await client.query(`
      SELECT 
        COUNT(DISTINCT pr.user_id) FILTER (WHERE pr.status IN ('Present', 'Late')) as present_today,
        COUNT(DISTINCT pr.user_id) FILTER (WHERE pr.status = 'Late') as late_today
      FROM punch_record pr
      JOIN user_subject_detail usd ON pr.user_id = usd.user_id AND pr.ct_id = usd.ct_id
      JOIN client_token ct ON usd.ct_id = ct.ct_id
      WHERE ct.client_id = $1 AND DATE(pr.panch_time) = $2
    `, [client_id, today]);

        const presentToday = parseInt(todayStatsQuery.rows[0]?.present_today || 0);
        const lateToday = parseInt(todayStatsQuery.rows[0]?.late_today || 0);
        const absentToday = totalEmployees > presentToday ? totalEmployees - presentToday : 0;

        // 3. Weekly Attendance Trends (Last 7 Days)
        const weeklyTrendsQuery = await client.query(`
      SELECT 
        DATE(pr.panch_time) as date,
        COUNT(DISTINCT pr.user_id) as present_count
      FROM punch_record pr
      JOIN client_token ct ON pr.ct_id = ct.ct_id
      WHERE ct.client_id = $1 AND DATE(pr.panch_time) >= $2
      GROUP BY DATE(pr.panch_time)
      ORDER BY DATE(pr.panch_time) ASC
    `, [client_id, sevenDaysAgo]);

        // Format weekly data for the chart (fill missing days with 0)
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const dateStr = moment().subtract(i, 'days').format('YYYY-MM-DD');
            const dayLabel = moment().subtract(i, 'days').format('ddd');
            const record = weeklyTrendsQuery.rows.find(r => moment(r.date).format('YYYY-MM-DD') === dateStr);
            weeklyData.push({
                dayLabel: dayLabel,
                date: dateStr,
                present: record ? parseInt(record.present_count) : 0
            });
        }

        // 4. Department / Subject Distribution
        const departmentQuery = await client.query(`
      SELECT 
        ct.subject_name,
        COUNT(DISTINCT usd.user_id) as user_count
      FROM client_token ct
      LEFT JOIN user_subject_detail usd ON ct.ct_id = usd.ct_id
      WHERE ct.client_id = $1 AND ct.status = 1
      GROUP BY ct.subject_name
    `, [client_id]);

        const departments = departmentQuery.rows.map(row => ({
            name: row.subject_name,
            count: parseInt(row.user_count || 0)
        }));

        // 5. Recent Activity (Last 5 punches)
        const recentActivityQuery = await client.query(`
      SELECT 
        u.name as user_name,
        ct.subject_name,
        pr.panch_time,
        pr.status
      FROM punch_record pr
      JOIN user_details u ON pr.user_id = u.user_id
      JOIN client_token ct ON pr.ct_id = ct.ct_id
      WHERE ct.client_id = $1
      ORDER BY pr.panch_time DESC
      LIMIT 5
    `, [client_id]);

        const recentActivity = recentActivityQuery.rows.map(row => ({
            userName: row.user_name,
            subjectName: row.subject_name,
            time: moment(row.panch_time).format("hh:mm A"),
            date: moment(row.panch_time).format("YYYY-MM-DD"),
            status: row.status
        }));

        // Send the compiled dashboard response
        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalEmployees,
                    presentToday,
                    absentToday,
                    lateToday
                },
                weeklyChart: weeklyData,
                departments: departments,
                recentActivity: recentActivity
            }
        });

    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = getClientDashboardStats;
