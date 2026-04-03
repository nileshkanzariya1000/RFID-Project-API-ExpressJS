const http = require('http');

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    const baseUrl = 'localhost';
    const port = 3000;

    console.log("--- Starting Tests ---");

    // 1. Get a valid user ID
    console.log("\n1. Fetching users...");
    const usersRes = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: '/getAllUsers',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    if (!usersRes.data.success || usersRes.data.data.length === 0) {
        console.error("No users found. Creating a test user or cannot proceed.");
        // In a real scenario, we might create one. Here we abort or assume specific ID.
        // Let's assume ID 1 if fetch fails, but hopefully it works.
        console.log("Assuming user_id=1 as fallback.");
    }

    const userId = usersRes.data.data && usersRes.data.data.length > 0 ? usersRes.data.data[0].user_id : 1;
    console.log(`Using User ID: ${userId}`);

    // 2. Apply for Leave
    console.log("\n2. Applying for leave...");
    const leaveData = {
        user_id: userId,
        reason: "Sick Leave",
        start_date: "2023-12-01",
        end_date: "2023-12-03"
    };

    const applyRes = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: '/applyLeave',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, leaveData);

    console.log("Apply Leave Response:", JSON.stringify(applyRes.data, null, 2));

    if (!applyRes.data.success) {
        console.error("Failed to apply leave. Aborting.");
        return;
    }

    const leaveId = applyRes.data.data.id;
    console.log(`Leave Applied. Leave ID: ${leaveId}`);

    // 3. Get User Leaves
    console.log("\n3. Fetching user leaves...");
    const userLeavesRes = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: `/getUserLeaves?user_id=${userId}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("User Leaves Count:", userLeavesRes.data.data.length);

    // 4. Get All Leave Requests
    console.log("\n4. Fetching all leave requests...");
    const allLeavesRes = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: '/getAllLeaveRequests',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    console.log("All Leaves Count:", allLeavesRes.data.data.length);

    // 5. Update Leave Status
    console.log("\n5. Updating leave status...");
    const updateData = {
        leave_id: leaveId,
        status: 'Approved'
    };

    const updateRes = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: '/updateLeaveStatus',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
    }, updateData);

    console.log("Update Status Response:", JSON.stringify(updateRes.data, null, 2));

    // 6. Verify Update
    console.log("\n6. Verifying update...");
    const verifyRes = await makeRequest({
        hostname: baseUrl,
        port: port,
        path: `/getUserLeaves?user_id=${userId}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const updatedLeave = verifyRes.data.data.find(l => l.id === leaveId);
    console.log("Updated Leave Status:", updatedLeave ? updatedLeave.status : "Not Found");

    console.log("\n--- Tests Completed ---");
}

runTests().catch(console.error);
