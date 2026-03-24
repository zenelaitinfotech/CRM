import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Lisha@123",   // your MySQL password
  database: "CRM_job"
});

db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed:", err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

export default db;