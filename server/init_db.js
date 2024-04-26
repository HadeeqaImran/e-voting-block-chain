const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db'); // Replace with your filename

// Define your table creation statements
const createDoctorTable = `
  CREATE TABLE IF NOT EXISTS doctor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL
  )
`;

const createPatientTable = `
  CREATE TABLE IF NOT EXISTS patient (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    medicalHistory TEXT
  )
`;

// Execute table creation queries
db.run(createDoctorTable, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Doctor table created!');
  }
});

db.run(createPatientTable, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Patient table created!');
  }
});

db.close(); // Close the database connection
