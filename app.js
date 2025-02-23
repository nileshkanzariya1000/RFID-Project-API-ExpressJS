const express = require('express');
const cors = require('cors'); 
const adminLogin = require('./Api_request/adminLogin'); 
const clientLogin = require('./Api_request/clientLogin');
const userLogin = require('./Api_request/userLogin');
const getUserForDevice = require('./Api_request/getUserForDevice');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());  // To parse JSON bodies

app.post('/adminlogin', adminLogin);
app.post('/clientlogin', clientLogin);
app.post('/userlogin', userLogin);
app.get('/getUserForDevice',getUserForDevice);
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
