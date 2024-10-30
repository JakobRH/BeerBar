/**
 * Update balances when new block are received.
 */
const subscribeBlocks = function () {
  // Subscribe to new blocks
  const ethSubscription = web3.eth.subscribe('newBlockHeaders', async function (error, result) {
    console.log("New block mined");

    if (!error) {
      console.log(result);
      // Check if beerToken has changed
      const newAddress = (await songVotingContractInstance.methods.beerTokenContractAddress().call());
      if (beerTokenContractAddress !== newAddress) {
        console.log("Unsubscribing from blocks...");
        ethSubscription.unsubscribe();
        // refresh whole page
        window.location.reload();
        return;
      }

      // Update blockNumber
      $(".current-block").html(await web3.eth.getBlockNumber());

      const addresses = [songVotingContractInstance.options.address].concat(persons());

      // Update balances and pending-beer-status for all addresses
      addresses.map(async function (address) {
        $(".eth-balance-" + address).html(web3.utils.fromWei((await web3.eth.getBalance(address)), "ether"));
        $(".pending-beertoken-balance-" + address).html(await songVotingContractInstance.methods.pendingBeer(address).call());
      });

      if (beerTokenContractInstance != null) {
        addresses.map(async function (address) {
          $(".beertoken-balance-" + address).html(await beerTokenContractInstance.methods.balanceOf(address).call());
        });
      }
    } else {
      $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
    }
  });
};

/**
 * Listen to Contract events and update data correspondingly.
 */
const listenToContractEvents = function () {
  console.log("Listening for contract events...");

  songVotingContractInstance.events.BarOpened(function (error, result) {
    console.log('got barOpenedEvent!');
    if (!error) {
      $(".bar-open").addClass('active');
      $(".bar-closed").removeClass('active');
    } else {
      $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
    }
  });

  songVotingContractInstance.events.BarClosed(function (error, result) {
    console.log('got barClosedEvent!');
    if (!error) {
      $(".bar-open").removeClass('active');
      $(".bar-closed").addClass('active');
    } else {
      $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
    }
  });

  songVotingContractInstance.events.OwnerAdded(function (error, result) {
    console.log('got ownerAddedEvent!');
    if (!error) {
      addPersonTemplate("owner", result.returnValues.account);
    } else {
      $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
    }
  });

  songVotingContractInstance.events.BarkeeperAdded(function (error, result) {
    console.log('got BarkeeperAddedEvent!');
    if (!error) {
      addPersonTemplate("barkeeper", result.returnValues.account);
    } else {
      $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
    }
  });

  songVotingContractInstance.events.OwnerRemoved(function (error, result) {
    console.log('got ownerRemovedEvent!');
    if (!error) {
      removePersonTemplate("owner", result.returnValues.account);
    } else {
      $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
    }
  });

  songVotingContractInstance.events.BarkeeperRemoved(function (error, result) {
    console.log('got barkeeperRemovedEvent!');
    if (!error) {
      removePersonTemplate("barkeeper", result.returnValues.account);
    } else {
      $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
    }
  });
};
