const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');  // Add HTTP module
const fs = require('fs'); 


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
const deleteUserFromSubject = require('./Api_request/deleteUserFromSubject');
const editUserInSubject = require('./Api_request/editUserInSubject');
const addNewToken = require('./Api_request/addNewToken');
const editTokenDetails = require('./Api_request/editTokenDetails');
const getTokensForClient = require('./Api_request/getTokensForClient');
const getTokensForAdmin = require('./Api_request/getTokensForAdmin');
const addNewSubject = require('./Api_request/addNewSubject');
const editSubject = require('./Api_request/editSubject');
const updateToken = require('./Api_request/updateToken');
const getPunchRecordByUser = require('./Api_request/getPunchRecordByUser');
const getPunchRecordBySubject = require('./Api_request/getPunchRecordBySubject');
const { getClientSubjectDetails } = require('./Api_request/getClientSubjectDetails');
const { getUserSubjectDetails } = require('./Api_request/getUserSubjectDetalis');
const getUserWhichInSubject = require('./Api_request/getUserWhichInSubject');
const getTokenById = require('./Api_request/getTokenById');
const getAllClients = require("./Api_request/getAllClients");
const getAllUsers = require("./Api_request/getAllUsers");
const adminChangePassword = require('./Api_request/adminChangePassword');
const updateClientStatus = require('./Api_request/updateClientStatus');
const updateUserStatus = require('./Api_request/updateUserStatus');
const getPurchasedTokens = require('./Api_request/getPurchasedTokens');

const app = express();
const port = 3000;
// Load SSL certificate and key files
const privateKey = fs.readFileSync('E:/RFID Project API ExpressJS/ssl/key.pem', 'utf8');
const certificate = fs.readFileSync('E:/RFID Project API ExpressJS/ssl/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

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
app.put('/adminChangePassword',adminChangePassword);
app.get('/getUserSubjects',getUserSubjects);
app.get('/getClientSubjects',getClientSubjects);
app.post('/addUserSubject',addUserSubject);
app.delete('/deleteUserFromSubject',deleteUserFromSubject);
app.put('/editUserInsubject',editUserInSubject);
app.post('/addNewToken',addNewToken);
app.put('/editTokenDetails',editTokenDetails);
app.get('/getTokensForClient',getTokensForClient);
app.get('/getTokensForAdmin',getTokensForAdmin);
app.post('/addNewSubject',addNewSubject);
app.put('/editSubject',editSubject);
app.put('/updateToken',updateToken);
app.get('/getPunchRecordByUser',getPunchRecordByUser);
app.get ('/getPunchRecordBySubject',getPunchRecordBySubject);
app.get('/getClientSubjectDetails',getClientSubjectDetails);
app.get ('/getUserSubjectDetalis',getUserSubjectDetails);
app.get('/getUserWhichInSubject',getUserWhichInSubject);
app.get('/getTokenById',getTokenById);
app.get("/getAllClients", getAllClients);
app.get('/getAllUsers', getAllUsers);
app.put('/updateClientStatus', updateClientStatus);
app.put('/updateUserStatus', updateUserStatus);
app.get('/getPurchasedTokens', getPurchasedTokens);
// Start the server
const httpsServer = https.createServer(credentials, app);

// Create HTTP server (non-secure)
const httpServer = http.createServer(app);



// Start the HTTPS server on port 3001
httpsServer.listen(3001, () => {
  console.log(`HTTPS server running on https://localhost:3001`);
});

// Start the HTTP server on port 3000 (or 80)
httpServer.listen(3000, () => {
  console.log(`HTTP server running on http://localhost:3000`);
});