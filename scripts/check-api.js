// Simple script to check API response
const https = require('https');
const http = require('http');

const url = 'http://localhost:3000/api/admin/portfolio?status=active';

const client = url.startsWith('https') ? https : http;

client.get(url, (resp) => {
  let data = '';

  // A chunk of data has been received
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received
  resp.on('end', () => {
    try {
      const parsedData = JSON.parse(data);
      console.log('API Response:');
      console.log(JSON.stringify(parsedData, null, 2));
      
      if (parsedData.portfolios) {
        console.log(`\nFound ${parsedData.portfolios.length} portfolio items`);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.log('Raw response:', data);
    }
  });

}).on("error", (err) => {
  console.error("Error: " + err.message);
}); 