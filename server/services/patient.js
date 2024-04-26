const db = require('../models/patient');

// Service to get all patients
const getAllPatients = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM patient', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = {
    getAllPatients
};
