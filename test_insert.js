const fetch = require('node-fetch');

async function test() {
    const loginRes = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'password123' }) // assume typical seed Admin
    });
    if (!loginRes.ok) {
        console.log('Login failed:', await loginRes.text());
        return;
    }
    const token = (await loginRes.json()).access_token;
    console.log('Login OK. Token length:', token.length);

    const res = await fetch('http://localhost:3001/daily', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ content: 'Test from script', projectId: null })
    });
    console.log('POST /daily status:', res.status);
    console.log('Response body:', await res.text());
}
test();
