import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.resolve(__dirname, "../data");
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

app.get('/api/guests', async (req, res) => {
  try {
    const guests = await loadGuests();
    res.json({ guests });
  } catch (e) {
    res.status(500).json({ error: 'Failed to read CSV' });
  }
});

app.get('/api/guests/search', async (req, res) => {
  try {
    const q = normalize(req.query.q || '');
    const guests = await loadGuests();
    if (!q) return res.json({ results: [] });
    const results = guests.filter(g => {
      return normalize(g.nom).includes(q) || normalize(g.prenom).includes(q);
    });
    res.json({ results });
  } catch (e) {
    res.status(500).json({ error: 'Search failed' });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
