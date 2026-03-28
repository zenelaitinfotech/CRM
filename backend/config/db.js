// import pkg from 'pg';
// const { Pool } = pkg;

// const db = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false } // Render requires SSL
// });

// // Test connection once
// db.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.error("PostgreSQL connection failed:", err);
//   } else {
//     console.log("PostgreSQL Connected Successfully at:", res.rows[0].now);
//   }
// });

// export default db;


// import pkg from 'pg';
// const { Pool } = pkg;

// const db = new Pool({
//   connectionString: process.env.DATABASE_URL
//    // remove this if your DB doesn't support SSL
// });


// // Run a test query once when the app starts
// db.query('SELECT NOW()', (err, res) => {
//   if (err) {
//     console.log("DATABASE_URL:", process.env.DATABASE_URL);
//     console.error("PostgreSQL connection failed:", err);
//   } else {
//     console.log("DATABASE_URL:", process.env.DATABASE_URL);
//     console.log("PostgreSQL Connected Successfully at:", res.rows[0].now);
//   }
// });

// export default db;


import pkg from 'pg';
const { Pool } = pkg;

const db = new Pool({
  user: "crm_user",
  password: "s3I80IX5d62rXkWmeO98oVe3wYTimNPz",
  host: "dpg-d730v1cg9agc73brv4e0-a.oregon-postgres.render.com",
  port: 5432,
  database: "crm_job",
  ssl: { rejectUnauthorized: false } // keep if Render requires SSL
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







//external url
//postgresql://mydatabase_mmbg_user:SaApxzVlYn5e5QMEPz3EQRn9g3Sa9xHS@dpg-d72ipc4r85hc73dqt7k0-a.oregon-postgres.render.com/mydatabase_mmbg
//command   PGPASSWORD=SaApxzVlYn5e5QMEPz3EQRn9g3Sa9xHS psql -h dpg-d72ipc4r85hc73dqt7k0-a.oregon-postgres.render.com -U mydatabase_mmbg_user mydatabase_mmbg
//internal url
//postgresql://mydatabase_mmbg_user:SaApxzVlYn5e5QMEPz3EQRn9g3Sa9xHS@dpg-d72ipc4r85hc73dqt7k0-a/mydatabase_mmbg