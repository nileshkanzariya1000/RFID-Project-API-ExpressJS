const moment = require('moment');
const client = require("../config/db");

async function getClientSubjectDetails(req, res) {
    const { ct_id } = req.query;  // Pass ct_id instead of client_id

    if (!ct_id) {
        return res.status(400).json({ success: false, message: "ct_id is required" });
    }

    try {
        // Updated query to join client_token and token_details
        const result = await client.query(
            `SELECT c.pass_key, c.purchase_date, c.expire_date, c.token_id, 
                    t.price, t.duration_day, t.description,t.name
             FROM client_token c
             JOIN token_detail t ON c.token_id = t.token_id
             WHERE c.ct_id = $1`,
            [ct_id]  // Use ct_id in query
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No details found for this ct_id" });
        }

        // Format the dates before sending the response
        result.rows = result.rows.map(row => {
            return {
                ...row,
                purchase_date: moment(row.purchase_date).format('YYYY-MM-DD'), // Format the purchase_date
                expire_date: moment(row.expire_date).format('YYYY-MM-DD')  // Format the expire_date
            };
        });

        res.status(200).json({ success: true, data: result.rows });

    } catch (err) {
        console.error("Error fetching client subject details:", err);
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { getClientSubjectDetails };
