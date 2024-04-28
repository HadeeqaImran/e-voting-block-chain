const db = require('../connection'); // Assuming connection.js is in the same directory

class DoctorService {
  async getAllDoctors() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM doctor', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getDoctorByWallet(wallet_address) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM doctor WHERE wallet_address = ?', [wallet_address], (err, row) => {
        if (err) {
            reject(err);
        } else {
            resolve(row);
        }
      });
    });
  }

  async addDoctor(doctorData) {
    const { name, specialty, wallet_address } = doctorData;
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO doctor (name, specialty, wallet_address) VALUES (?, ?, ?)', [name, specialty, wallet_address], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Doctor added successfully!' });
        }
      });
    });
  }
  
  async updateDoctor(doctorId, doctorData) {
    const { name, specialty, wallet_address } = doctorData;
    return new Promise((resolve, reject) => {
      db.run('UPDATE doctor SET name = ?, specialty = ?, wallet_address = ? WHERE id = ?', [name, specialty, wallet_address, doctorId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Doctor updated successfully!' });
        }
      });
    });
  }

  async deleteDoctor(doctorId) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM doctor WHERE id = ?', [doctorId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Doctor deleted successfully!' });
        }
      });
    });
  }
}

module.exports = new DoctorService(); // Export a single instance