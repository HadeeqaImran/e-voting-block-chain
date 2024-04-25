// database.js

const mongoose = require('mongoose');
const { DoctorModel, PatientModel } = require('./models'); // Your database models

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Store doctor data in database
async function storeDoctor(name, specialty) {
  try {
    await DoctorModel.create({ name, specialty });
  } catch (error) {
    console.error('Error storing doctor data:', error);
    throw error;
  }
}

// Store patient data in database
async function storePatient(name, walletAddress) {
  try {
    await PatientModel.create({ name, walletAddress });
  } catch (error) {
    console.error('Error storing patient data:', error);
    throw error;
  }
}

module.exports = { storeDoctor, storePatient };
