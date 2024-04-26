// Import necessary modules
const sqlite3 = require('sqlite3').verbose();

function initDatabase() {
    // Connect to SQLite database
    const db = new sqlite3.Database('./d.db');
    console.log("Entered");
    // Initialize database tables
    db.serialize(() => {
        
        // Create doctor table
        db.run(`CREATE TABLE IF NOT EXISTS doctor (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            specialty TEXT NOT NULL
        )`);

        // Create patient table
        db.run(`CREATE TABLE IF NOT EXISTS patient (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL,
            doctor_id INTEGER,
            FOREIGN KEY (doctor_id) REFERENCES doctor (id)
        )`);

    });

    // Export database object
    return db;
}

module.exports = { initDatabase };
