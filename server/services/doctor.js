const db = require('../models/doctor');

// Service to get all doctors
const getAllDoctors = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM doctor', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = {
    getAllDoctors
};
