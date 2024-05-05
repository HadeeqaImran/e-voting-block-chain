const db = require('../connection'); // Assuming connection.js is in the same directory

class AppointmentService {
  async getAllAppointments() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM appointment', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getAvailableAppointmentsByDoctorID(doctorId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM appointment WHERE doctorID = ?', [doctorId], (err, rows) => {
          if (err) {
              reject(err);
          } else {
              resolve(rows);
          }
      });
    });
  }

  async getAppointmentsByID(id) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM appointment WHERE id = ? and patientID = ?', [id, -1], (err, rows) => {
          if (err) {
            console.log(err)
              reject(err);
          } else {
            console.log(err)
              resolve(rows);
          }
      });
    });
  }

  async addAvailableAppointment(appointmentData) {
    const { doctorID, patientID, startTime, date } = appointmentData;
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO appointment (doctorID, patientID, startTime, date) VALUES (?, ?, ?, ?)', [doctorID, patientID, startTime, date], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Appointment added successfully!' });
        }
      });
    });
  }
  
  async updateAppointment(appointmentId, appointmentData) {
    const { doctorID, patientID, startTime, date } = appointmentData;
    return new Promise((resolve, reject) => {
      db.run('UPDATE appointment SET doctorID = ?, patientID = ?, startTime = ?, date = ? WHERE id = ?', [doctorID, patientID, startTime, date, appointmentId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Appointment updated successfully!' });
        }
      });
    });
  }

  async updateAppointmentWithPatientID(appointmentId, patientID) {
    return new Promise((resolve, reject) => {
        db.run('UPDATE appointment SET patientID = ? WHERE id = ?', [patientID, appointmentId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Appointment updated successfully!' });
            }
        });
    });
  }

  async deleteAppointment(appointmentId) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM appointment WHERE id = ?', [appointmentId], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({ message: 'Appointment deleted successfully!' });
        }
      });
    });
  }
}

module.exports = new AppointmentService(); // Export a single instance
