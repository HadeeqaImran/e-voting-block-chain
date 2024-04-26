App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
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

      App.listenForEvents();
      
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

  // ----------------- Utility Functions -------------------------
  // Function to handle doctor registration form submission
  registerDoctor: function(name, specialty) {
    var doctorInstance;
    console.log("Doctor register function entered");
    App.contracts.DoctorAppointment.deployed().then(function(instance) {
      doctorInstance = instance;
      // Call the registerDoctor function in the smart contract
      return doctorInstance.registerDoctor(name, specialty, { from: App.account });
    }).then(function(result) {
      // Handle success
      console.log("Doctor registered successfully:", result);
      alert("Doctor registered successfully!");
    }).catch(function(err) {
      // Handle error
      console.error(err);
      alert("Failed to register doctor");
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

  castVote: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      instance.votedEvent({}, {
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
    consle.log("Yes")
    App.init();
  });
});