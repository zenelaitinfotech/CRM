import pkg from 'pg';
const { Pool } = pkg;

const isLocal = process.env.DATABASE_URL && (process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1"));

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false }
});

// Test connection
db.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err);
  } else {
    console.log("PostgreSQL Connected Successfully at:", res.rows[0].now);
  }
});

export default db;