const client = require("../config/db");
const moment = require('moment');

// Helper function to split data into chunks
const chunkArray = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

async function saveRfid(req, res) {
  console.log(req.body);
  try {
    
    const pass_key = req.headers.token;
    const { scanrecords } = req.body;
    
        if (!pass_key || !scanrecords || !Array.isArray(scanrecords)) {
      return res.status(400).json({ success:false,message: "Invalid data format" });
    }

    const result = await client.query('SELECT ct_id,  purchase_date, expire_date FROM client_token WHERE pass_key = $1', [pass_key]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success:false,message: 'Invalid pass_key' });
    }

    // Extracting relevant data
    const { ct_id, purchase_date, expire_date } = result.rows[0];
    const purchaseDate = moment(purchase_date);
    const expireDate = moment(expire_date);
    const currentDate = moment();

    const isValid = currentDate.isBetween(purchaseDate, expireDate, null, '[]');
    if (!isValid) {
      return res.status(401).json({ success:false,message: 'Your API has expired' });
    }

    const chunkedUsers = chunkArray(scanrecords, 10);

    for (let chunk of chunkedUsers) {
      const insertPromises = chunk.map(user => {
        return client.query(
          'INSERT INTO punch (user_id, ct_id, timestamp) VALUES ($1, $2, $3)',
          [user.user, ct_id, user.date]
        );
      });

      await Promise.all(insertPromises);
    }

    res.status(200).json({
      success: true,
      message: 'Users data saved successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false,message: err.message });
  }
}

module.exports = saveRfid;
