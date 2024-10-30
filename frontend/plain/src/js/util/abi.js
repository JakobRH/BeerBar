/**
 * Use Fetch API to query ABIs from compiled json files
 *
 * The files are fetched relative to the domain-root
 */

const getSongVotingABI = async () =>
  fetch(`${window.location.pathname}abi/SongVotingBar.json`)
    .then(response => response.json())
    .then(result => result.abi);

const getBeerTokenABI = async () =>
  fetch(`${window.location.pathname}abi/BeerToken.json`)
    .then(response => response.json())
    .then(result => result.abi);
