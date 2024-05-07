// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract DoctorAppointment {
    address public admin; // Address of the admin

    // Structure to represent a doctor
    struct Doctor {
        uint id;
        string name;
        string specialty;
        address walletAddress; // Ethereum address of the doctor
        mapping(string => bool) availability; // Mapping for available slots
    }

    // Structure to represent a patient
    struct Patient {
        uint id;
        string name;
        address walletAddress; // Ethereum address of the patient
    }

    // Array to store doctors
    Doctor[] public doctors;

    mapping(string => uint) doctorIdsByAddress;

    // Utility: Function to get doctor ID by wallet address
    function getDoctorIdByWallet(string memory _walletAddress) public view returns (uint) {
        return doctorIdsByAddress[_walletAddress];
    }

    // Convert address to string
    function addressToString(address _address) internal pure returns (string memory) {
        bytes memory addressBytes = abi.encodePacked(_address);
        return string(addressBytes);
    }

    // Array to store patients
    Patient[] public patients;

    // Event for appointment booking
    event AppointmentBooked(uint indexed doctorId, uint indexed patientId, string timestamp);
    event DoctorRegistered(uint id, string name, string speciality);
    event PatientRergistered(uint id, string name);

    // Modifier to restrict access to the admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    // Constructor to set the admin
    constructor() public{
        admin = msg.sender;
    }

    // Function to register a new doctor (only admin)
    function registerDoctor(string memory _name, string memory _specialty, address account) public onlyAdmin {
        // Add the doctor to the array of doctors
        doctors.push(Doctor(doctors.length, _name, _specialty, account));
        doctorIdsByAddress[addressToString(account)] = doctors.length;
        emit DoctorRegistered(doctors.length, _name, _specialty);
    }

    // Function to register a new patient
    function registerPatient(string memory _name) public {
        // Ensure the sender is not already registered as a patient
        require(!isPatient(msg.sender), "Already registered as a patient");

        // Add the patient to the array of patients
        patients.push(Patient(patients.length, _name, msg.sender));
        emit PatientRergistered(patients.length, _name);
    }

    // Function to check if an address is registered as a patient
    function isPatient(address _walletAddress) public view returns (bool) {
        for (uint i = 0; i < patients.length; i++) {
            if (patients[i].walletAddress == _walletAddress) {
                return true;
            }
        }
        return false;
    }

    // // Function for doctors to set their availability
    // function setAvailability(uint _doctorId, uint _slot, bool _available) public {
    //     // Ensure the doctor exists
    //     require(_doctorId < doctors.length, "Doctor does not exist");

    //     // Update the availability for the specified slot
    //     doctors[_doctorId].availability[_slot] = _available;
    // }

    // Function for patients to book an appointment
    function bookAppointment(string memory docAddress, string memory _timestamp) public {
        // Ensure the doctor exists
        uint _doctorId = doctorIdsByAddress[docAddress];
        require(_doctorId != 0, "No doctor exists at the provided wallet address");
        
        // Ensure the slot is available
        require(doctors[_doctorId].availability[_timestamp], "Slot not available");

        // Emit an event indicating the booking
        emit AppointmentBooked(_doctorId, patients.length - 1, _timestamp);

        // Mark the slot as unavailable after booking
        doctors[_doctorId].availability[_timestamp] = false;
    }

    // List all registered Doctors ----------------------
    // Function to get the total number of doctors
    function getDoctorsCount() public view returns (uint) {
        return doctors.length;
    }

    // Function to get doctor details by ID
    function getDoctor(uint _id) public view returns (uint, string memory, string memory, address) {
        require(_id < doctors.length, "Doctor does not exist");
        Doctor memory doctor = doctors[_id];
        return (doctor.id, doctor.name, doctor.specialty, doctor.walletAddress);
    }
}
