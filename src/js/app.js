//Do something about listening to events
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof window.ethereum !== 'undefined') {
        // If MetaMask is installed
        App.web3Provider = window.ethereum;
        web3 = new Web3(window.ethereum);
    } else {
        // Specify default instance if no web3 instance provided
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("DoctorAppointment.json", function(doc_appoint) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.DoctorAppointment = TruffleContract(doc_appoint);
      // Connect provider to interact with contract
      App.contracts.DoctorAppointment.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var docAppointInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();
  
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  
    // Load contract data
    App.contracts.DoctorAppointment.deployed().then(function(instance) {
      docAppointInstance = instance;
      return docAppointInstance.getDoctorsCount(); // Fetch total number of doctors
    }).then(function(doctorsCount) {
      var doctorsResults = $("#doctorsResults");
      doctorsResults.empty();

      for (var i = 0; i < doctorsCount; i++) {
        // Fetch details of each doctor
        docAppointInstance.getDoctor(i).then(function(doctor) {
          var id = doctor[0];
          var name = doctor[1];
          var specialty = doctor[2];
          var walletAddress = doctor[3];

          // Render doctor details
          var doctorTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + specialty + "</td><td>" + walletAddress + "</td></tr>";
          doctorsResults.append(doctorTemplate);
        });
      }
      // Hide loader and show content when done fetching and rendering doctors
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

  },

  // ---------------------------------------- Utility Functions --------------------------------------
  /* -------------------------------------------------------------------------------------------------
  ------------------------------------------------ Doctor --------------------------------------------
  ---------------------------------------------------------------------------------------------------*/
  registerDoctor: async function() {
    var name = $('#name').val();
    var specialty = $('#specialty').val();
    var wallet_address = $('#wallet_address').val();
    var maxId;
    fetch('http://localhost:8000/api/doctor')
    .then(response => response.json())
    .then(result => {
        maxId = result.id;
        App.contracts.DoctorAppointment.deployed().then(function(instance) {
          return instance.registerDoctor(maxId+1, name, specialty, wallet_address, { from: App.account });
        }).then(function(result) {
          // Send a request to the backend API to store the doctor in the database
          var response = $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8000/api/doctors",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                specialty: specialty,
                wallet_address: wallet_address.toLowerCase(),
            })
          });
        })
    }).catch(error => {
        // Handle fetch error
        console.error('Error fetching maximum doctor id:', error);
    });
  },

  // Display Doctors' List
  displayDoctorsList: function() {
    var doctorInstance;
    App.contracts.DoctorAppointment.deployed().then(function(instance) {
      doctorInstance = instance;
      // Call the getDoctorsCount function in the smart contract to get the total number of doctors
      return doctorInstance.getDoctorsCount();
    }).then(function(count) {
      var doctorsList = $("#doctorsList");
      doctorsList.empty();
      // Loop through all doctors and display their details
      for (var i = 0; i < count; i++) {
        doctorInstance.doctors(i).then(function(doctor) {
          var id = doctor[0];
          var name = doctor[1];
          var specialty = doctor[2];
          var walletAddress = doctor[3];
          // Append doctor details to the HTML
          var doctorItem = "<div><strong>ID:</strong> " + id + "<br><strong>Name:</strong> " + name + "<br><strong>Specialty:</strong> " + specialty + "<br><strong>Wallet Address:</strong> " + walletAddress + "<hr></div>";
          doctorsList.append(doctorItem);
        });
      }
    }).catch(function(err) {
      console.error(err);
    });
  },


/* -------------------------------------------------------------------------------------------------
  ----------------------------------------------- Patient ------------------------------------------
  --------------------------------------------------------------------------------------------------*/
  registerPatient: async function() {
    var name = $('#name').val();
    var age = $('#age').val();
    var gender = $('#gender').val()
    fetch('http://localhost:8000/api/patient')
    .then(response => response.json())
    .then(result => {
        maxId = result.id;
        App.contracts.DoctorAppointment.deployed().then(function(instance) {
      return instance.registerPatient(maxId + 1, name, { from: App.account });
    }).then(function(result) {
      alert("Sending request: " + result)
      // Send a request to the backend API to store the doctor in the database
      var response = $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/api/patients",
        contentType: "application/json",
        data: JSON.stringify({
            name: name,
            age: age,
            gender: gender,
            wallet_address: App.account.toLowerCase(),
            medicalHistory: "None"
        })
      });
    })
  }).catch(function(err) {
      alert("Error: " + err.data)
    });
  },



/* -------------------------------------------------------------------------------------------------
  ----------------------------------------------- Patient ------------------------------------------
  --------------------------------------------------------------------------------------------------*/

  bookAppointment: async function(date, time, id) {
      App.contracts.DoctorAppointment.deployed().then(function(instance) {
        const dateTimeString = date + " " + time;
        alert(id)
        // Get appointment ID from URL parameters
        const docId = new URLSearchParams(window.location.search).get('id');
        return instance.bookAppointment(1, dateTimeString, { from: App.account });
      }).then(async function(result) {
        alert("Sending request: " + result)
        try {
          // Make PATCH request to update appointment with patient ID
          const response = await fetch(`http://127.0.0.1:8000/api/appointments/${id}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  patientID: App.account.toLowerCase() // Assuming App.account is the patient's ID
              })
          });
  
          if (!response.ok) {
              throw new Error('Failed to update appointment');
          }
  
          const result = await response.json();
          console.log('Appointment updated:', result);
          } catch (error) {
              console.error('Error updating appointment:', error);
              alert('Error updating appointment:', error.message);
          }
      }).catch(function(err) {
        alert("Error: " + err)
      });
    },
  
/* --------------------------------------------------------------------------------------------------
  ------------------------------------------------ Events -------------------------------------------
  ---------------------------------------------------------------------------------------------------*/
 
  listenForDoctorRegistrationEvents: function() {
    App.contracts.DoctorAppointment.deployed().then(function(instance) {
      instance.DoctorRegistered({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  listenForAppointmentBokingEvents: function() {
    App.contracts.DoctorAppointment.deployed().then(function(instance) {
      instance.AppointmentBooked({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
})