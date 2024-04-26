var DoctorAppointment = artifacts.require("./DoctorAppointment.sol");

module.exports = function(deployer) {
  deployer.deploy(DoctorAppointment);
};