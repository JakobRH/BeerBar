const barTemplateObject = Handlebars.getTemplate('bar-template');
const footerTemplateObject = Handlebars.getTemplate('footer-template');

async function loadBarContract(address) {
  let barTemplate = await renderBarTemplate(address);
  $('#bar').data('address', address).html(barTemplate);

  let footerTemplate = await renderFooterTemplate();
  $('footer').html(footerTemplate);
}

async function renderBarTemplate(address) {
  const barIsOpen = await songVotingContractInstance.methods.barIsOpen().call();
  const ether = web3.utils.fromWei(await web3.eth.getBalance(address), "ether");

  let beerAmount;
  let beerTotalSupply;
  let beerName;
  let beerSymbol;

  if (beerTokenContractInstance != null) {
    beerAmount = await beerTokenContractInstance.methods.balanceOf(address).call();
    beerTotalSupply = await beerTokenContractInstance.methods.totalSupply().call();
    beerName = await beerTokenContractInstance.methods.name().call();
    beerSymbol = await beerTokenContractInstance.methods.symbol().call();
  }

  const context = {
    address: address,
    ether: ether,
    barIsOpen: barIsOpen,
    beerAddress: beerTokenContractAddress,
    beerAmount: beerAmount,
    beerTotalSupply: beerTotalSupply,
    beerName: beerName,
    beerSymbol: beerSymbol
  };

  return barTemplateObject(context);
}

async function renderFooterTemplate() {
  const context = {
    block: await web3.eth.getBlockNumber()
  };

  return footerTemplateObject(context);
}
