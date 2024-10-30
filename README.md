TU Vienna's Virtual Beer Bar
==========================

<ins>**Deadline: Thu, 28 April 2022, 24:00**

For this assignment, we combine the most favorite hobby of students - going out and drinking some beer - with the second
favorite pastime - coding.

After this exercise, you'll know how to deliver (or, in this case, mint)
beer and run your own bar. But don't worry, you don't have to get your hands dirty - everything will run in the safe
environment of a decentralized app.

So let's get started with the smart contract!

Installation and Project Setup
===========================
This project requires NPM - [Install Node.js & NPM](https://nodejs.org/en/).

Furthermore, this project uses the truffle framework and follows the common truffle directory structure as presented in
the workshop. Install all required dependencies locally by running the command `npm install` in the root directory.

Optionally, you can install truffle also globally with the command `npm install -g truffle`.

For more information see the [Truffle Quickstart Tutorial](https://www.trufflesuite.com/docs/truffle/quickstart).

In `package.json` you can find useful scripts for running truffle commands locally.  
The scripts can be executed with `npm run <script-name>`.   
E.g.   
`npm run truffle` for running truffle locally installed in `/node_modules`   
or   
`npm run dev` for starting the truffle development chain.

You can also interact with your contracts directly via the truffle console (slightly different API than with your geth
console!) or e.g. use Remix to connect to the truffle development blockchain via its `Web3 Provider` Environment option
and the correct `Web3 Provider Endpoint` `(default: http://127.0.0.1:9545)`.

A complete frontend is provided under `/frontend`. There you can find another `README.md` with further information.

<ins>Hints for deployment and testing:</ins>  
With the command `truffle develop`, truffle starts a local development blockchain. Within the truffle dev console, you
can omit `truffle` when running other commands like `test` or `migrate`. You can deploy your contracts directly via the
command `migrate`.  
However `migrate` deploys only contracts that have changed. If you want to redeploy all contracts, use `migrate --reset`
. Run the tests via `test [<path-to-test-file>]`.

Have a look at your `truffle-config.js` file for further network/deployment options.

For an easier debugging of your solidity contracts, you can add an error message to the `require` statement
like `require(x == y, 'condition is not satisfied')`, which will then be shown in the revert exception.

You can find multiple `TODO` throughout the project to mark important configurations or tasks to implement.

Project Tasks
===========================

Task 1: BeerToken (1 Point)
===========================

For starters, you'll make your very own token. And - in contrast to many ICOs - it even has an important utility: Your
users will be able to exchange this BeerToken for beer later on.

An interface `IBeerToken` is already provided.
It lays out the following requirements:

- 1 beer token is equivalent to 1 glass of beer. It is not divisible.
- New beer tokens can be minted on demand by the owner of the token contract.
  (Think of a beer delivery to the bar. The same amount of beer tokens have to be minted and sent to the bar by the
  owner of the bar).
- Beer tokens can be burned (as real beer is served to the customers and therefore "destroyed").
- In the past, many tokens got lost because they were sent to contracts that didn't support the receiving of tokens.
  Beer is valuable, so make sure this can't happen by accident.

Choose a token standard that fully supports these requirements, and use it for your token.

Implementation:
---------------

* Implement your BeerToken contract in file `contracts/BeerToken.sol`.
* Your token should be standard-compliant (i.e. should include all constant information describing the token contract).
* The file `test/BeerToken.js` implements test cases for this contract. You can run them
  using `truffle test test/BeerToken.js`, or automatically via commits to the Git repository on the server (by opening
  your project in Gitlab, and then clicking on CI/CD -> Jobs -> and then clicking on the status of the `test` stage).

Task 2: BeerBar (4 Points)
==========================

Now for the fun part: We get to spend those tokens!

An interface `IBeerBar` is already provided. This contract allows bar owners to run their bar using their own beer
token. It lays out the basic functionality as follows:

Roles:

- There is a `owner` role for administrative functions of this contract.
- Furthermore, there is also a `barkeeper` role defined in this contract.

Hint: You can implement role modelling by yourself using a mapping or just use one of OpenZeppelin's standards, e.g.
Version 2.0 of [Access-Control](https://docs.openzeppelin.com/contracts/2.x/access-control#using-roles)

> Remember: You can generate as many Ethereum accounts as you like.
> In the CLI, this is possible with `personal.newAccount("logic")`.
> When using logic as your password, they will be automatically
> unlocked with the `unlock()` command.

Organisational tasks:

- The OWNER has to set the beer price.
- The BARKEEPER opens and closes the bar.
- The OWNER can transfer parts of the bar's ether to a specified address.

Beer tokens:

- The OWNER specifies which type of beer token the bar is going to accept.
- Beer tokens can be sent to the bar, i.e. the contract is a receiver of ERC tokens.
- The contract only accepts your specified beer token, and no other type of token sent to it.
- When beer is delivered to the bar, an equal amount of beer tokens has to be sent to the bar marked "supply".
- CUSTOMERS can buy the bar's beer token for ether.

Beer orders:

- When a CUSTOMER sends an amount of tokens to the bar, it means an order of the same amount of glasses of beer. This
  can be done only during opening hours.
- During opening hours, BARKEEPERS check the order (to make sure the guest is not already too drunk, or underage - this
  process happens offline/offchain). When BARKEEPERS decide to accept the order, they serve (deliver) the beer to the
  CUSTOMER. If the order is declined, the barkeeper ignores it.
- CUSTOMERS can check their open/pending orders of beer.
- CUSTOMERS can cancel their orders before an order is accepted. This allows them to get their tokens back (e.g. if
  their order is declined or they no longer want to have the beer)

Implementation:
---------------

* Implement your BeerBar contract in file `contracts/BeerBar.sol`.
* Inherit your contract from the `IBeerBar` interface and implement all functions.
* The file `test/BeerBar.js` implements test cases for this contract. You can run them
  using `truffle test test/BeerBar.js`, or automatically via commits on the server.
* A web UI for the BeerBar is provided in the folder `/frontend` for your convenience. You can use this UI for managing
  your bar. Either run this UI via a local webserver OR via our public webserver. You can open it via the
  URL <https://bar.pages.sc.logic.at/e11734084>. For more infos on frontend setup see `/frontend/README.md`, Making
  changes to the UI is not needed for this task.

Task 3: SongVotingBar
=====================

The days were dreadful music in bars gets played, is now over - customers can vote which songs get added to the
playlist!  
Let's extend our awesome BeerBar to become a much more famous SongVotingBar!

DJs:

- The bar needs DJs for playing music.
- DJs start the voting (during opening hours).
- DJs end the voting (before or at bar closing time).
- DJs play the next song according to the voting (songs get played offline/offchain).

Voting:

- While the voting period is open, customers push their favorite song in or up the playlist by sending ether to the bar
  together with the title of their song. This means, that the playlist has to consider the total amount of votes a song
  has received so far! It is not allowed to just show a chronological list of received votes.
- For this voting, customers receive beer tokens. The number of tokens is equivalent to the amount of ether divided by
  the beer price. Any remainder is kept as tip.

Voting / Selection of the next song played:

- Feel free to define how this is done - you have to consider the votes, though.
- Furthermore, you have to decide, which parts of this selection you like to implement in the web interface and which
  parts you provide in the contract.

3.1 Smart Contract (2.5 Points)
-----------------------------

Write your `SongVotingBar` in `contracts/SongVotingBar.sol`.

3.2 Test cases (1.5 Points)
-------------------------

Write test cases for your `SongVotingBar` in `test/SongVotingBar.js`. Those test cases should cover all your added
functionality.

3.3 Web UI (1 Point)
--------------------

Choose one of the given JavaScript Frontends and extend it, so that it also works with your SongVotingBar. You will
notice that we deliberately did not specify the API for getting the current vote list - feel free to implement that to
your liking.


Task 4: Profit!
===============

You are now a proud bar owner, sit back, relax, and enjoy a nice cold BeerToken!

- Please also write some short notes about your implementation of this exercise in
  `NOTES.md`. It should cover on which addresses you deployed the contracts, how you solved the exercise and which
  issues you faced.

- Also, make us - the person at `addresses.getPublic(94)` - an OWNER of the bar. We promise, we won't mismanage it...

- Copy your frontend build files into `/public`, which is served by your GitLab Pages instance and works properly. Do
  not forget to change back the port of the WebsocketProvider for your UI to `8546`. (see corresponding
  frontend `README.md` - # Connecting the frontend to your blockchain client)

- Make sure you have committed all your changes to your Git-Repository!
