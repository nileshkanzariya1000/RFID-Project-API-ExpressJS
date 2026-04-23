const client = require("../config/db");
const moment = require('moment');

async function getUserForDevice(req, res) {
    try {
        const pass_key = req.headers.token;
        
        // Get pagination parameters from query params (default values for pageNo and pageSize)
        let { pageno, pagesize } = req.query;
        pageNo = parseInt(pageno) || 1; // Default to page 1 if not provided
        pageSize = parseInt(pagesize) || 10; // Default to page size 10 if not provided

        if (!pass_key) {
            return res.status(400).json({ success: false, message: 'pass_key is required' });
        }

        const result = await client.query('SELECT ct_id,purchase_date, expire_date FROM client_token WHERE pass_key = $1', [pass_key]);

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid API pass_key' });
        }

        // Since only one record is expected, directly access the first row
        const { ct_id, purchase_date, expire_date } = result.rows[0];

        const purchaseDate = moment(purchase_date);
        const expireDate = moment(expire_date);
        const currentDate = moment(); // Get the current date

        // Check if current date is between purchase_date and expire_date
        const isValid = currentDate.isBetween(purchaseDate, expireDate, null, '[]'); // '[]' means inclusive range
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Your API is Expired' });
        }

        // Calculate the offset for pagination
        const offset = (pageNo - 1) * pageSize;

        // Query to get the users with pagination
        const result1 = await client.query(
            'SELECT u.user_id as id, s.rfid, u.name, s.designation as detail FROM users u JOIN section s ON u.user_id = s.user_id WHERE s.ct_id = $1 LIMIT $2 OFFSET $3',
            [ct_id, pageSize, offset]
        );

        if (result1.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get total count of users (for pagination purposes)
        const countResult = await client.query(
            'SELECT COUNT(*) FROM users u JOIN section s ON u.user_id = s.user_id WHERE s.ct_id = $1',
            [ct_id]
        );

        const totalCount = parseInt(countResult.rows[0].count);
        console.log(result1.rows);
        return res.status(200).json({
            success: true,
            users: result1.rows,
            count: totalCount,  // Total number of users for pagination
            modifiedon: "2025-02-19 05:06:59"
        });

    } catch (err) {
        console.error("Error occurred while fetching user data:", err);
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = getUserForDevice;
