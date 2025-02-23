const express = require('express');
const cors = require('cors'); 
const adminLogin = require('./Api_request/adminLogin'); 
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());  // To parse JSON bodies

app.post('/adminlogin', adminLogin);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
