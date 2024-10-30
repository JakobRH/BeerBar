Addresses
---------------------------
TODO - Write here on which addresses you have deployed the contracts on the LVA-Chain:

BeerToken: 0xC0A20523126EE6E016a34F05736C6b97543735D7

BeerBar/SongVotingBar: 0x25b613BE84C14F27357961D9712faE3eeae3Ae22


Implementation
---------------------------
For the BeerToken I chose the ERC223 Standard, since this standard fully supports all
the requirements that were asked for the BeerToken. I basically just copied the
ERC223 Token code from Tuwel. 

For the BeerBar most things were straightforward. I dont think its necessary to explain you the code.
For AccessControl in the BeerBar I used the struct Roles.Role from OpenZeppelin.
I copied the code into my repo, because somehow it could not be loaded. 

SongVotingBar:
I again used Roles.Role for djs. For the voting I used a one array and two mappings.
The array keeps track af all songs that were ever pushed. One mapping that maps the
song_name to the index of the array (this is necessary to check if the song already
exists in the array without iterating through it, when a customer votes for a song) and
one mapping that maps the song_name to the number of votes the song has received.
The votes of all songs in the array will be set to 0 when a voting starts, so that
multiple votings can take place. When the DJ plays the next song, the votes of that
song will be set to zero. I am aware that I have two functions that iterate over a possible
big array on chain, which is expensive, but I could not figure a smarter way and sadly I had
not too much time for the exercise. When the bar gets closed the voting will automatically be ended.

Access control of SongVotingBar was tested. The correct order of multiple songs with different votings
were tested. Also with multiple votings. -> Test should cover all the intended functionalities of the contract.

Difficulties
---------------------------
Setting up truffle. Win10 didnt make my life easy. Exercise was fun and in my opinion not too easy or too hard.


Proposal for future changes
---------------------------


