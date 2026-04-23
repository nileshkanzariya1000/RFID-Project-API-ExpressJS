const express = require('express');
const cors = require('cors');
const https = require('https');
const http = require('http');
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
const applyLeave = require('./Api_request/applyLeave');
const getUserLeaves = require('./Api_request/getUserLeaves');
const getAllLeaveRequests = require('./Api_request/getAllLeaveRequests');
const updateLeaveStatus = require('./Api_request/updateLeaveStatus');
const getClientDashboardStats = require('./Api_request/getClientDashboardStats');
const updatePurchasedTokenStatus = require('./Api_request/updatePurchasedTokenStatus');
const getAdminDashboardStats = require('./Api_request/getAdminDashboardStats');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/adminlogin', adminLogin);
app.post('/clientlogin', clientLogin);
app.post('/userlogin', userLogin);
app.get('/getUserForDevice', getUserForDevice);
app.post('/saveRfid', saveRfid);
app.post('/userRegister', userRegister);
app.post('/clientRegister', clientRegister);
app.put('/clientUpdate', clientUpdate);
app.put('/userUpdate', userUpdate);
app.put('/userChangePassword', userChangePassword);
app.put('/clientChangePassword', clientChangePassword);
app.put('/adminChangePassword', adminChangePassword);
app.get('/getUserSubjects', getUserSubjects);
app.get('/getClientSubjects', getClientSubjects);
app.post('/addUserSubject', addUserSubject);
app.delete('/deleteUserFromSubject', deleteUserFromSubject);
app.put('/editUserInsubject', editUserInSubject);
app.post('/addNewToken', addNewToken);
app.put('/editTokenDetails', editTokenDetails);
app.get('/getTokensForClient', getTokensForClient);
app.get('/getTokensForAdmin', getTokensForAdmin);
app.post('/addNewSubject', addNewSubject);
app.put('/editSubject', editSubject);
app.put('/updateToken', updateToken);
app.get('/getPunchRecordByUser', getPunchRecordByUser);
app.get('/getPunchRecordBySubject', getPunchRecordBySubject);
app.get('/getClientSubjectDetails', getClientSubjectDetails);
app.get('/getUserSubjectDetalis', getUserSubjectDetails);
app.get('/getUserWhichInSubject', getUserWhichInSubject);
app.get('/getTokenById', getTokenById);
app.get("/getAllClients", getAllClients);
app.get('/getAllUsers', getAllUsers);
app.put('/updateClientStatus', updateClientStatus);
app.put('/updateUserStatus', updateUserStatus);
app.get('/getPurchasedTokens', getPurchasedTokens);
app.post('/applyLeave', applyLeave);
app.get('/getUserLeaves', getUserLeaves);
app.get('/getAllLeaveRequests', getAllLeaveRequests);
app.put('/updateLeaveStatus', updateLeaveStatus);
app.get('/getClientDashboardStats', getClientDashboardStats);
app.put('/updatePurchasedTokenStatus', updatePurchasedTokenStatus);
app.get('/getAdminDashboardStats', getAdminDashboardStats);

// Support both HTTPS (local) and HTTP (deployment like Render)
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  // On Render/cloud: use plain HTTP
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
} else {
  // Local: try HTTPS with SSL certs
  try {
    const privateKey = fs.readFileSync('C:/Users/kakadiya nishil/Desktop/rfid-react-project/RFID-Project-API-ExpressJS/ssl/key.pem', 'utf8');
    const certificate = fs.readFileSync('C:/Users/kakadiya nishil/Desktop/rfid-react-project/RFID-Project-API-ExpressJS/ssl/cert.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);
    const httpServer = http.createServer(app);

    httpsServer.listen(443, () => console.log("HTTPS Server running on port 443"))
      .on('error', (err) => console.error("HTTPS Server failed to start:", err.message));
    httpServer.listen(PORT, () => console.log("HTTP Server running on port " + PORT))
      .on('error', (err) => console.error("HTTP Server failed to start:", err.message));
  } catch (e) {
    // SSL certs not found, fallback to HTTP
    app.listen(PORT, () => {
      console.log("Server running on port " + PORT + " (HTTP fallback)");
    });
  }
}