// models.js

const mongoose = require('mongoose');

// Doctor schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
});

// Patient schema
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
});

// Doctor model
const DoctorModel = mongoose.model('Doctor', doctorSchema);

// Patient model
const PatientModel = mongoose.model('Patient', patientSchema);

module.exports = { DoctorModel, PatientModel };
