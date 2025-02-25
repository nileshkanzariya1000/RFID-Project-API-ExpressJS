const client = require("../config/db");
const moment = require('moment');

async function getUserForDevice(req, res) {
    try {
        const { pass_key } = req.query;
        
       
        if (!pass_key) {
            return res.status(400).json({ error: 'pass_key is required' });
        }

        const result = await client.query('SELECT ct_id,purchase_date, expire_date FROM client_token WHERE pass_key = $1', [pass_key]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid API pass_key' });
        }

        // Since only one record is expected, directly access the first row
        const { ct_id,purchase_date, expire_date } = result.rows[0];

        const purchaseDate = moment(purchase_date);
        const expireDate = moment(expire_date);
        const currentDate = moment(); // Get the current date

        // Check if current date is between purchase_date and expire_date
        const isValid = currentDate.isBetween(purchaseDate, expireDate, null, '[]'); // '[]' means inclusive range
        if(!isValid){
            return res.status(401).json({ message: 'Yor API is Expire' });
        }
        const result1 = await client.query('SELECT u.user_id,s.rfid, u.name, s.designation FROM users u JOIN section s ON u.user_id = s.user_id WHERE s.ct_id = $1', [ct_id]);
        if (result1.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        } 
        return res.status(200).json({data:result1.rows,
            count:result1.rows.length,
            modifiedon: "2025-02-19 05:06:59"
        });

    } catch (err) {
        console.error("Error occurred while fetching user data:", err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = getUserForDevice;
