const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware
const connection = require('./connection'); // Assuming connection.js is in the same directory

const doctorController = require('./controllers/doctor');
const patientController = require('./controllers/patient');
const appointmentController = require('./controllers/appointment');

const app = express();
const port = process.env.PORT || 8000; // Set your preferred port

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// API endpoints for doctors
app.get('/api/doctors', doctorController.getDoctors);
app.get('/api/doctors/:wallet_address', doctorController.getDoctorByWallet)
app.post('/api/doctors', doctorController.addDoctor);
app.put('/api/doctors/:id', doctorController.updateDoctor); // Assuming ID is in URL path
app.delete('/api/doctors/:id', doctorController.deleteDoctor); // Assuming ID is in URL path


// API endpoints for patients
app.get('/api/patients', patientController.getPatients);
app.get('/api/patients/:wallet_address', patientController.getPatientByWallet)
app.post('/api/patients', patientController.addPatient);
app.put('/api/patients/:id', patientController.updatePatient); // Assuming ID is in URL path
app.delete('/api/patients/:id', patientController.deletePatient); // Assuming ID is in URL path


// API endpoints for appointments
app.get('/api/appointments', appointmentController.getAppointments);
app.get('/api/appointments/:id', appointmentController.getAppointmentsByID);
app.get('/api/appointments/available/:doctorid', appointmentController.getAvailableAppointmentsByDoctorID);
// app.get('/api/appointments/booked/:doctorId', appointmentController.getBookedAppointments);
app.post('/api/appointments', appointmentController.addAppointment);
app.patch('/api/appointments/:id', appointmentController.updateAppointmentWithPatientID)
app.put('/api/appointments/:id', appointmentController.updateAppointment); // Assuming ID is in URL path
app.delete('/api/appointments/:id', appointmentController.deleteAppointment); // Assuming ID is in URL path


// Error handling middleware (optional)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Internal server error' });
// });


app.listen(port, () => console.log(`Server listening on port ${port}`));
