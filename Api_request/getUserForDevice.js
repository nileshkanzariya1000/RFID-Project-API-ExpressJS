const client = require("../config/db");
const moment = require('moment');

async function getUserForDevice(req, res) {
    try {
        const { ct_id, pass_key } = req.query;
        
        if (!ct_id) {
            return res.status(400).json({ error: 'ct_id is required' });
        }
        if (!pass_key) {
            return res.status(400).json({ error: 'pass_key is required' });
        }

        const result = await client.query('SELECT purchase_date, expire_date FROM client_token WHERE ct_id = $1 AND pass_key = $2', [ct_id, pass_key]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid API token or pass_key' });
        }

        // Since only one record is expected, directly access the first row
        const { purchase_date, expire_date } = result.rows[0];

        const purchaseDate = moment(purchase_date);
        const expireDate = moment(expire_date);
        const currentDate = moment(); // Get the current date

        // Check if current date is between purchase_date and expire_date
        const isValid = currentDate.isBetween(purchaseDate, expireDate, null, '[]'); // '[]' means inclusive range
        if(!isValid){
            return res.status(401).json({ message: 'Yor API is Expire' });
        }
        const result1 = await client.query('SELECT u.user_id,u.rfid, u.name, s.designation FROM users u JOIN section s ON u.user_id = s.user_id WHERE s.ct_id = $1', [ct_id]);
        if (result1.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(result1.rows);

    } catch (err) {
        console.error("Error occurred while fetching user data:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = getUserForDevice;
