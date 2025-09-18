import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  console.log('=== DEBUG API CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));

  try {
    const cwd = process.cwd();
    console.log('Working directory:', cwd);

    // Lister le contenu du répertoire racine
    const rootFiles = fs.readdirSync(cwd);
    console.log('Root files:', rootFiles);

    // Vérifier si le dossier data existe
    const dataPath = path.join(cwd, 'data');
    const dataExists = fs.existsSync(dataPath);
    console.log('Data folder exists:', dataExists);

    let dataFiles = [];
    if (dataExists) {
      dataFiles = fs.readdirSync(dataPath);
      console.log('Data files:', dataFiles);
    }

    // Vérifier le fichier CSV spécifiquement
    const csvPath = path.join(cwd, 'data', 'guests.csv');
    const csvExists = fs.existsSync(csvPath);
    console.log('CSV exists:', csvExists);

    let csvContent = '';
    if (csvExists) {
      csvContent = fs.readFileSync(csvPath, 'utf8').substring(0, 200) + '...';
      console.log('CSV preview:', csvContent);
    }

    res.status(200).json({
      success: true,
      debug: {
        cwd,
        rootFiles,
        dataExists,
        dataFiles,
        csvExists,
        csvPath,
        csvPreview: csvContent,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
