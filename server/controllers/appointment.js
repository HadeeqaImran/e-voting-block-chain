const AppointmentService = require('../services/appointment');

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentService.getAllAppointments();
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving appointments' });
  }
};

exports.getAvailableAppointmentsByDoctorID = async (req, res) => {
  try {
    const doctorID = req.params.doctorid;
    const appointments = await AppointmentService.getAvailableAppointmentsByDoctorID(doctorID);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving appointments' });
  }
};

exports.getAppointmentsByID = async (req, res) => {
  try {
    const id = req.params.id;
    const appointments = await AppointmentService.getAppointmentsByID(id);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments' });
  }
};

exports.addAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const result = await AppointmentService.addAvailableAppointment(appointmentData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding appointment' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id); // Assuming ID is in request params (modify as needed)
    const appointmentData = req.body;
    const result = await AppointmentService.updateAppointment(appointmentId, appointmentData);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating appointment' });
  }
};

exports.updateAppointmentWithPatientID = async (req, res) => {
  try {
      const appointmentId = parseInt(req.params.id); // Assuming ID is in request params (modify as needed)
      const { patientID } = req.body;
      const result = await AppointmentService.updateAppointmentWithPatientID(appointmentId, patientID);
      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating appointment' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = parseInt(req.params.id); // Assuming ID is in request params (modify as needed)
    const result = await AppointmentService.deleteAppointment(appointmentId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
};
