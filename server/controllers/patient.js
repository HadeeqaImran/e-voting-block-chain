const PatientService = require('../services/patient');

exports.getPatients = async (req, res) => {
  try {
    const patients = await PatientService.getAllPatients();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving patients' });
  }
};

exports.addPatient = async (req, res) => {
  try {
    const patientData = req.body;
    const result = await PatientService.addPatient(patientData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding patient' });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patientId = parseInt(req.params.id); // Assuming ID is in URL params
    const patient = await PatientService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving patient' });
  }
};

exports.getPatientByWallet = async (req, res) => {
  try {
      const wallet_address = req.params.wallet_address.toLowerCase();
      const patient = await PatientService.getPatientByWallet(wallet_address);
      res.json(patient);
  } catch (error) {
      console.error('Error retrieving patient:', error);
      res.status(500).json({ error: 'Error retrieving patient' });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const patientId = parseInt(req.params.id); // Assuming ID is in URL params
    const patientData = req.body;
    const result = await PatientService.updatePatient(patientId, patientData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating patient' });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patientId = parseInt(req.params.id); // Assuming ID is in URL params
    const result = await PatientService.deletePatient(patientId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting patient' });
  }
};


exports.maxIdFinder = async (req, res) => {
  try {
    const result = await PatientService.maxIdFinder();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error getting patient' +  result});
  }
};
