const express = require('express');
const cors = require('cors'); 
const adminLogin = require('./Api_request/adminLogin'); 
const clientLogin = require('./Api_request/clientLogin');
const userLogin = require('./Api_request/userLogin');
const getUserForDevice = require('./Api_request/getUserForDevice');
const saveRfid = require('./Api_request/saveRfid');
const userRegister = require('./Api_request/userRegister');

const clientRegister = require('./Api_request/clientRegister');
const clientUpdate = require('./Api_request/clientUpdate');
const userUpdate = require('./Api_request/userUpdate');
const userChangePassword = require('./Api_request/userChangePassword');
const clientChangePassword = require('./Api_request/clientChangePassword');
const getUserSubject = require('./Api_request/getUserSubjects');
const getClientSubjects = require('./Api_request/getClientSubjects');
const addUserSubject = require('./Api_request/addUserSubject');
const getUserSubjects = require('./Api_request/getUserSubjects');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());  // To parse JSON bodies

app.post('/adminlogin', adminLogin);
app.post('/clientlogin', clientLogin);
app.post('/userlogin', userLogin);
app.get('/getUserForDevice',getUserForDevice);
app.post('/saveRfid',saveRfid);
app.post('/userRegister',userRegister);
app.post('/clientRegister',clientRegister);
app.put('/clientUpdate',clientUpdate);
app.put('/userUpdate',userUpdate);
app.put('/userChangePassword',userChangePassword);
app.put('/clientChangePassword',clientChangePassword);
app.get('/getUserSubjects',getUserSubjects);
app.get('/getClientSubjects',getClientSubjects)
app.post('/addUserSubject',addUserSubject)
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
