async function isBeerTokenAddressValid(address) {
  const beerTokenABI = await getBeerTokenABI();
  let beerTokenContractInstance = new web3.eth.Contract(beerTokenABI, address);

  // Check whether the beerToken address actually points to a corresponding token contract by calling a method.
  return beerTokenContractInstance.methods.balanceOf('0x0000000000000000000000000000000000000000').call()
    .then(() => {
      return true;
    }).catch(() => {
      console.log("Invalid token contract address!");
      return false;
    });
}

$.urlParam = function (name) {
  const results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results == null) {
    return null;
  } else {
    return decodeURI(results[1]) || 0;
  }
};

let resultHandler = function (error, result) {
  if (!error) {
    $.notify('Transaction sent: ' + JSON.stringify(result));
  } else {
    $.notify({message: '<strong>Error:</strong> ' + error}, {type: 'danger'});
  }
};

/**
 * Shows the bootstrap modal dialog from `bar-template.html`
 *
 * @param title Content of the header
 * @param body Content of the body
 */
function showModal(title, body) {
  const modal = $('#person-modal');
  modal.find('.modal-title').text(title);
  modal.find('.modal-body').html(body);
  modal.modal();
}

function updateUrlParameter(uri, key, value) {
  // remove the hash part before operating on the uri
  const i = uri.indexOf('#');
  const hash = i === -1 ? '' : uri.substr(i);
  uri = i === -1 ? uri : uri.substr(0, i);

  const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  const separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    uri = uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    uri = uri + separator + key + "=" + value;
  }
  return uri + hash;  // Finally, append the hash as well
}

/**
 * Compiles the passed html template, placed in `/templates`
 *
 * @param name Path + Name of the template
 */
Handlebars.getTemplate = function (name) {
  if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
    $.ajax({
      url: 'templates/' + name + '.html',
      success: function (data) {
        if (Handlebars.templates === undefined) {
          Handlebars.templates = {};
        }
        Handlebars.templates[name] = Handlebars.compile(data);
      },
      async: false
    });
  }
  return Handlebars.templates[name];
};
