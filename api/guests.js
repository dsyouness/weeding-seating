import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

function normalize(str) {
  return (str || '').toString().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

async function loadGuests() {
  return new Promise((resolve, reject) => {
    const guests = [];
    // Chercher le fichier CSV dans le bon répertoire
    const csvPath = path.join(process.cwd(), 'data', 'guests.csv');

    console.log('Looking for CSV at:', csvPath);

    if (!fs.existsSync(csvPath)) {
      console.log('CSV file not found, returning empty array');
      return resolve(guests);
    }

    fs.createReadStream(csvPath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on('data', (row) => {
        const prenom = (row.prenom || row.first || row.firstname || '').toString();
        const nom = (row.nom || row.last || row.lastname || '').toString();
        const table = (row.table || row.table_number || row.tableNum || '').toString();
        const gif_name = (row.gif_name || row.gif || "").toString();
        const nom_table = (row.nom_table || row.table_name || "").toString();
        if (prenom || nom) {
          guests.push({ prenom, nom, table, gif_name, nom_table });
        }
      })
      .on('end', () => {
        console.log('Loaded guests:', guests.length);
        resolve(guests);
      })
      .on('error', (err) => {
        console.error('CSV parsing error:', err);
        reject(err);
      });
  });
}

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const guests = await loadGuests();
    res.status(200).json({ guests });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to load guests' });
  }
}
