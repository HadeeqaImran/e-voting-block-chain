const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./connection'); // Assuming connection.js is in the same directory

const doctorController = require('./controllers/doctor');
const patientController = require('./controllers/patient');

const app = express();
const port = process.env.PORT || 8000; // Set your preferred port

// Middleware
app.use(bodyParser.json());

// API endpoints
app.get('/api/doctors', doctorController.getDoctors);
app.post('/api/doctors', doctorController.addDoctor);
app.put('/api/doctors/:id', doctorController.updateDoctor); // Assuming ID is in URL path
app.delete('/api/doctors/:id', doctorController.deleteDoctor); // Assuming ID is in URL path

// API endpoints
app.get('/api/patients', patientController.getPatients);
app.post('/api/patients', patientController.addPatient);
app.put('/api/patients/:id', patientController.updatePatient); // Assuming ID is in URL path
app.delete('/api/patients/:id', patientController.deletePatient); // Assuming ID is in URL path

// Error handling middleware (optional)
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Internal server error' });
// });

app.listen(port, () => console.log(`Server listening on port ${port}`));
