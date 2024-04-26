const express = require('express');
const router = express.Router();
const patientService = require('../services/patient');

// Route to get all patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await patientService.getAllPatients();
        res.json(patients);
    } catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).json({ error: 'Error fetching patients' });
    }
});

module.exports = router;
