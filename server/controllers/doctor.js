const express = require('express');
const router = express.Router();
const doctorService = require('../services/doctor');

// Route to get all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await doctorService.getAllDoctors();
        res.json(doctors);
    } catch (err) {
        console.error('Error fetching doctors:', err);
        res.status(500).json({ error: 'Error fetching doctors' });
    }
});

module.exports = router;