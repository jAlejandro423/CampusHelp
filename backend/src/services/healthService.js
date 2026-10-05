// Health: verifica que la BD responda (SELECT 1).
const pool = require('../db/pool');

async function checkDatabase() {
  const [rows] = await pool.query('SELECT 1 AS ok');
  return rows;
}

module.exports = { checkDatabase };
