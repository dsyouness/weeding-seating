import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "../data");
const CSV_PATH = path.join(DATA_DIR, 'guests.csv');

function normalize(str) {
  return (str || '').toString().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function loadGuests() {
  return new Promise((resolve, reject) => {
    const guests = [];
    if (!fs.existsSync(CSV_PATH)) {
      return resolve(guests);
    }
    fs.createReadStream(CSV_PATH)
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
      .on('end', () => resolve(guests))
      .on('error', (err) => reject(err));
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
    const url = new URL(req.url, `https://${req.headers.host}`);
    const pathname = url.pathname;

    if (pathname === '/api/guests') {
      const guests = await loadGuests();
      res.json({ guests });
    } else if (pathname === '/api/guests/search') {
      const q = normalize(url.searchParams.get('q') || '');
      const guests = await loadGuests();
      if (!q) return res.json({ results: [] });
      const results = guests.filter(g => {
        return normalize(g.nom).includes(q) || normalize(g.prenom).includes(q);
      });
      res.json({ results });
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
