// Test backend health
fetch('http://localhost:3001/health')
  .then(res => res.json())
  .then(data => console.log('Health check:', data))
  .catch(err => console.error('Health check failed:', err));

// Test execute endpoint
const code = `MOV AX, 5`;
fetch('http://localhost:3001/api/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code })
})
  .then(res => {
    console.log('Execute status:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('Execute response:', data.success ? 'SUCCESS' : 'FAILED');
    if (data.output) console.log('Output length:', data.output.length);
  })
  .catch(err => console.error('Execute failed:', err));
