const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.hackmlofittovwbotokw:Jesushanwork1@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => console.log('Supabase Connected ✅'))
  .catch(err => console.log('Connection error:', err));

module.exports = pool;