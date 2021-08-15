

App = {
    loading: false,
    contracts: {},
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      // Modern dapp browsers...
if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
  }
  web3 = new Web3(App.web3Provider);
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      
      var accounts = await web3.eth.getAccounts(); 
      App.account = accounts[0];
      console.log(App.account);
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const birthDateRegistry = await $.getJSON('BirthDateRegistry.json')
      App.contracts.BirthDateRegistry = TruffleContract(birthDateRegistry);
      App.contracts.BirthDateRegistry.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.birthDateRegistry = await App.contracts.BirthDateRegistry.deployed();
      console.log(App.birthDateRegistry);
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderTasks: async () => {
      // Load the total task count from the blockchain
      const birthDetailsCount = await App.birthDateRegistry.birthDetailsCount();
      console.log(birthDetailsCount);
      const $birthDetailTemplate = $('.birthDetailTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= birthDetailsCount; i++) {
        // Fetch the task data from the blockchain
        const birthDetail = await App.birthDateRegistry.birthDetails(i);
        const birthDetailId = birthDetail[0].toNumber();
        const birthDetailNIN = birthDetail[1];
        const birthDetailDate = birthDetail[2];
        const birthDetailFullName = birthDetail[3];
        const birthDetailFatherNIN = birthDetail[4];
        const birthDetailMotherNIN = birthDetail[5];
        const birthDetailVerified = birthDetail[6];
  
        // Create the html for the task
        const $newBirthDetailTemplate = $birthDetailTemplate.clone()
        $newBirthDetailTemplate.find('.birthDate').html(birthDetailDate)
        $newBirthDetailTemplate.find('.fullName').html(birthDetailFullName)
        $newBirthDetailTemplate.find('.nin').html(birthDetailNIN)
        $newBirthDetailTemplate.find('.birthDetailId').html(birthDetailId);
        $newBirthDetailTemplate.find('.fatherNIN').html(birthDetailFatherNIN)
        $newBirthDetailTemplate.find('.motherNIN').html(birthDetailMotherNIN)
        $newBirthDetailTemplate.find('input')
                        .prop('name', birthDetailId)
                        .prop('checked', birthDetailVerified)
                        .on('click', App.toggleVerified)
  
        // Put the task in the correct list
        if (birthDetailVerified) {
          console.log("Verified");
          $('#verifiedBirthDetails').append($newBirthDetailTemplate)
        } else {
          console.log("Unverified");
          $('#unverifiedBirthDetails').append($newBirthDetailTemplate)
        }
  
        // Show the task
        $newBirthDetailTemplate.show()
      }
    },
  
    createBirthDetail: async () => {
      console.log("Create birth details");
      App.setLoading(true)
      const fullName = $('#full_name').val();
      const birthDate = $('#birth_date').val();
      const nin = $('#nin').val();
      const fatherNin = $('#father_nin').val();
      const motherNin = $('#mother_nin').val();
      await App.birthDateRegistry.createBirthDetail(nin, birthDate, fullName, fatherNin, motherNin, { from:  App.account});
      window.location.reload();
    },
  
    toggleVerified: async (e) => {
      App.setLoading(true)
      const birthDetailId = e.target.name
      await App.birthDateRegistry.toggleVerification(birthDetailId, {from: App.account});
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })