// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract DoctorAppointment {
    address public admin; // Address of the admin

    // Structure to represent a doctor
    struct Doctor {
        string name;
        string specialty;
        address walletAddress; // Ethereum address of the doctor
        mapping(string => address) availability; // Mapping for available slots
    }

    // Structure to represent a patient
    struct Patient {
        string name;
        address walletAddress; // Ethereum address of the patient
    }

    // Array to store doctors
    mapping(uint => Doctor) public doctors;
    mapping(uint => Patient) public patients;

    uint doctorCount;
    uint patientCount;
    // Event for appointment booking
    event AppointmentBooked(uint indexed doctorId, string timestamp);
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
    function registerDoctor(uint id, string memory _name, string memory _specialty, address account) public onlyAdmin {
        // Add the doctor to the mapping of doctors
        doctors[id] = Doctor(_name, _specialty, account);
        doctorCount++;
        emit DoctorRegistered(id, _name, _specialty);
    }

    // Function to register a new patient
    function registerPatient(uint id, string memory _name) public {
        // Ensure the sender is not already registered as a patient
        require(!isPatient(), "Already registered as a patient");
        patients[id] = Patient(_name, msg.sender);
        patientCount++;
        emit PatientRergistered(id , _name);
    }

    // Function to check if an address is registered as a patient
    function isPatient() public view returns (bool) {
        for (uint i = 0; i < patientCount; i++) {
            if (patients[i].walletAddress == msg.sender) {
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
    function bookAppointment(uint docId, string memory _timestamp) public {
        // Ensure the doctor exists - line always gives Metamask a problem
        // require(doctors[docId].walletAddress != address(0), "No doctor exists at the provided wallet address");
        
        // Ensure the slot is available
        require(doctors[docId].availability[_timestamp] == address(0), "Slot not available");

        // Emit an event indicating the booking
        emit AppointmentBooked(docId, _timestamp);

        // Mark the slot as unavailable after booking
        doctors[docId].availability[_timestamp] = msg.sender;
    }

    // List all registered Doctors ----------------------
    // Function to get the total number of doctors
    function getDoctorsCount() public view returns (uint) {
        return doctorCount;
    }
}
