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
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();
      
      return App.render();
    });
  },

  render: function() {
    var electionInstance;
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
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();
  
      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();
  
      for (var i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];
  
          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
  
          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        });
      }
      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
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
    App.init();
  });
});