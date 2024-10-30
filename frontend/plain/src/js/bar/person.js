const personTemplateObject = Handlebars.getTemplate('person-template');

function Person(address, ether, beerTokens, pendingBeerTokens) {
  this.address = address;
  this.ether = ether;
  this.beertokens = beerTokens;
  this.pendingBeertokens = pendingBeerTokens;
  this.addressShort = this.address.substring(0, 7);
}

async function addPerson(person_address) {
  await addPersonTemplate('customer', person_address);

  if (await songVotingContractInstance.methods.isBarkeeper(person_address).call()) {
    await addPersonTemplate('barkeeper', person_address);
  }
  if (await songVotingContractInstance.methods.isOwner(person_address).call()) {
    await addPersonTemplate('owner', person_address);
  }
}

async function getPerson(person_address) {
  const ether = web3.utils.fromWei(await web3.eth.getBalance(person_address), "ether");

  let beerTokens;
  if (beerTokenContractInstance != null) {
    beerTokens = await beerTokenContractInstance.methods.balanceOf(person_address).call();
  }
  const pendingBeerTokens = await songVotingContractInstance.methods.pendingBeer(person_address).call();

  return new Person(person_address, ether, beerTokens, pendingBeerTokens);
}

async function addPersonTemplate(role, person_address) {
  const roleComponent = $("#" + role);
  roleComponent.parent().find(" .empty ").remove();

  const context = {
    role: role,
    person: await getPerson(person_address),
  };

  const html = personTemplateObject(context);
  roleComponent.append(html);
}

function removePersonTemplate(role, person_address) {
  $('.' + role + '_card[data-address=\'' + person_address + '\']').remove();
}

/**
 * Get person array from url
 */
function persons() {
  const personAddress = $.urlParam('invite');
  if (!personAddress) {
    return [];
  }
  return personAddress.split(',');
}
