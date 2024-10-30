let beerTokenContractAddress;
let songVotingContractInstance;
let beerTokenContractInstance;

/****************************
 * Entry point
 ***************************/
$(document).ready(async function () {

  // Connecting to local node
  const provider = new Web3.providers.WebsocketProvider("ws://localhost:8546");
  const web3 = window['web3'] = new Web3(provider);
  const isConnected = await web3.eth.net.isListening();
  if (!isConnected) {
    alert("Not connected to client!");
    return;
  } else {
    console.log('Connected to client!');
  }

  const contractAddress = $.urlParam('contract');
  if (contractAddress != null) {
    // Check whether bar contract is deployed by checking the code deployed on that address
    const data = await web3.eth.getCode(contractAddress);
    if (data === "0x") {
      alert("No contract deployed on that address!");
      return;
    }

    // Get ABIs
    const songVotingABI = await getSongVotingABI();
    const beerTokenABI = await getBeerTokenABI();

    // Instantiate contracts
    songVotingContractInstance = new web3.eth.Contract(songVotingABI, contractAddress);
    beerTokenContractAddress = await songVotingContractInstance.methods.beerTokenContractAddress().call();

    // Check whether token contract address is valid
    const isTokenAddressNotEmpty = beerTokenContractAddress !== '0x0000000000000000000000000000000000000000';
    const isTokenAddressValid = await isBeerTokenAddressValid(beerTokenContractAddress);
    if (isTokenAddressNotEmpty) {
      if (isTokenAddressValid) {
        beerTokenContractInstance = new web3.eth.Contract(beerTokenABI, beerTokenContractAddress);
      } else {
        $.notify({message: '<strong>Wrong address for Beer Token!</strong> ' + beerTokenContractAddress}, {type: 'danger'});
      }
    }

    // Start event handlers
    subscribeBlocks();
    listenToContractEvents();

    // Load UI
    await loadBarContract(contractAddress);
    await Promise.all(persons().map(async (person_address) => {
      await addPerson(person_address);
    }));
  }

  $("#loadBarSubmit").click(function () {
    const address = $("#address").val();
    window.location.href = updateUrlParameter(window.location.href, 'contract', address);
  });

  $(document).on("click", ".invite_submit", function () {
    const bar = $(this).closest("#bar");

    const invite_address = bar.find('.invite_address').val();
    console.log("invite_address: " + invite_address);

    const p = persons();
    if (p.indexOf(invite_address) < 0) {
      p.push(invite_address);
    }
    window.location.href = updateUrlParameter(window.location.href, 'invite', p.join());
  });
}());
