const db = require('../connection'); // Assuming connection.js is in the same directory

class PatientService {
  async getAllPatients() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM patient', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async addPatient(patientData) {
    const { name, age, gender, wallet_address, medicalHistory } = patientData;
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO patient (name, age, gender, wallet_address, medicalHistory) VALUES (?, ?, ?, ?, ?)', [name, age, gender, wallet_address,  medicalHistory], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Patient added successfully!' });
        }
      });
    });
  }

  async getPatientById(patientId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM patient WHERE id = ?', [patientId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row); // Might be null if patient not found
        }
      });
    });
  }

  async getPatientByWallet(wallet_address) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM patient WHERE wallet_address = ?', [wallet_address], (err, row) => {
        if (err) {
            reject(err);
        } else {
            resolve(row);
        }
      });
    });
  }
  
  async updatePatient(patientId, patientData) {
    const { name, age, gender, wallet_address, medicalHistory } = patientData;
    return new Promise((resolve, reject) => {
      db.run('UPDATE patient SET name = ?, age = ?, gender = ?, wallet_address = ?, medicalHistory = ? WHERE id = ?', [name, age, gender, wallet_address, medicalHistory, patientId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Patient updated successfully!' });
        }
      });
    });
  }

  async deletePatient(patientId) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM patient WHERE id = ?', [patientId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Patient deleted successfully!' });
        }
      });
    });
  }
}

module.exports = new PatientService(); // Export a single instance
