const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Web3, web3 } = require('web3');
const contractABI = require('./contractABI.json'); // Your smart contract ABI
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address
const db = require('./database'); // Your database module

// Connect to Ethereum node
const web3 = new Web3(new Web3.providers.HttpProvider('YOUR_ETH_NODE_URL'));

// Load smart contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Parse JSON bodies
app.use(bodyParser.json());

// Endpoint to register a new doctor
app.post('/register-doctor', async (req, res) => {
  try {
    const { name, specialty } = req.body;
    // Call smart contract function to register doctor
    const result = await contract.methods.registerDoctor(name, specialty).send({ from: 'YOUR_ADMIN_ADDRESS' });
    // Store doctor data in database
    await db.storeDoctor(name, specialty);
    res.status(200).json({ success: true, message: 'Doctor registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to register doctor' });
  }
});

// Endpoint to register a new patient
app.post('/register-patient', async (req, res) => {
  try {
    const { name } = req.body;
    // Call smart contract function to register patient
    const result = await contract.methods.registerPatient(name).send({ from: req.body.walletAddress });
    // Store patient data in database
    await db.storePatient(name, req.body.walletAddress);
    res.status(200).json({ success: true, message: 'Patient registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to register patient' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
