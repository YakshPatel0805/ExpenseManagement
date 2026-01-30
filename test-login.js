// Simple test to verify login functionality
// Run with: node test-login.js (after installing node-fetch: npm install node-fetch)

async function testLogin() {
    try {
        // Test with correct credentials
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'abc123@gmail.com',
                password: 'abcd@123'
            })
        });

        const data = await response.json();
        console.log('Login test result:', data);

        // Test with wrong credentials
        const response2 = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'wrong@email.com',
                password: 'wrongpass'
            })
        });

        const data2 = await response2.json();
        console.log('Wrong credentials test:', data2);

    } catch (error) {
        console.error('Test failed:', error);
        console.log('Make sure to install node-fetch: npm install node-fetch');
        console.log('And ensure the server is running on port 3000');
    }
}

// Check if fetch is available (Node.js 18+ has built-in fetch)
if (typeof fetch === 'undefined') {
    console.log('Installing node-fetch for testing...');
    try {
        global.fetch = require('node-fetch');
    } catch (err) {
        console.error('Please install node-fetch: npm install node-fetch');
        process.exit(1);
    }
}

testLogin();