export default function handler(req, res) {
  console.log('Test API called!');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Working directory:', process.cwd());

  // Test si le fichier CSV existe
  const fs = require('fs');
  const path = require('path');
  const csvPath = path.join(process.cwd(), 'data', 'guests.csv');
  const csvExists = fs.existsSync(csvPath);

  res.status(200).json({
    message: 'Test API works!',
    csvExists,
    csvPath,
    cwd: process.cwd(),
    timestamp: new Date().toISOString()
  });
}

