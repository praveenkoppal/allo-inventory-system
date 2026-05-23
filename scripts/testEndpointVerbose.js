const http = require('http');
const url = 'http://localhost:3001/api/reservations';

const req = http.get(url, (res) => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', res.headers);
  let data = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('BODY', data);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e);
});

req.end();
