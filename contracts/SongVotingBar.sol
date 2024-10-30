// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Roles.sol";
import "./BeerBar.sol";

contract SongVotingBar is BeerBar {
    using Roles for Roles.Role;

    Roles.Role private djs;
    bool private votingActive;
    string [] private songs;
    mapping(string => uint256) private votes;
    mapping(string => uint256) private indexes;

    event DJAdded(address account);
    event DJRemoved(address account);
    event VotingStarted();
    event VotingEnded();

    constructor () BeerBar() {
        votingActive = false;
        //so that index 0 does not exist for songs
        songs.push("");
    }

    modifier isDJModifier(){
        require(djs.has(tx.origin), "IS_NOT_AN_DJ");
        _;
    }

    modifier votingStarted(){
        require(votingActive, "NO_ACTIVE_VOTING");
        _;
    }

    function isDJ(address account) external view returns (bool) {
       if(djs.has(account)){
           return true;
       }
        return false;
    }

    function addDJ(address account) external isBarOwner {
        djs.add(account);
        emit DJAdded(account);
    }

    function renounceDJ() external isDJModifier {
        djs.remove(tx.origin);
        emit DJRemoved(tx.origin);
    }

     //votes form before will be set to 0
    function startVoting() external isDJModifier isBarOpen {
        for (uint i=1; i<songs.length; i++){
            votes[songs[i]] = 0;
        }
        votingActive = true;
        emit VotingStarted();
    }

    function endVoting() external isDJModifier isBarOpen {
        votingActive = false;
        emit VotingEnded();
    }

    function votingIsActive() external view returns (bool) {
        return votingActive;
    }

    function closeBar() override external isBarKeeperModifier {
        isOpen = false;
        emit BarClosed();
        votingActive = false;
        emit VotingEnded();
    }

    //if song are in playlist, plays songs with most vote, if all votes are 0, takes first song that was pushed
    function playNextSong() external isDJModifier isBarOpen returns (string memory) {
        require(songs.length > 1, "NO_SONG_IN_PLAYLIST");
        uint256 maxVote = 0;
        uint256 maxVotedIndex = 1;
        for (uint i=1; i<songs.length; i++){
            if(votes[songs[i]] > maxVote){
                maxVote = votes[songs[i]];
                maxVotedIndex = i;
            }
        }
        votes[songs[maxVotedIndex]] = 0;
        return songs[maxVotedIndex];
    }

    function voteSong(string memory song) external payable votingStarted {
        require(beerPrice != 0, "NO_BEER_PRICE");
        if(indexes[song] == 0){
            songs.push(song);
            indexes[song] = songs.length - 1;
            votes[song] = 1;
        } else {
            votes[song] += 1;
        }
        uint tip = msg.value%beerPrice;
        beerTokenContract.transfer(msg.sender, (msg.value-tip)/beerPrice);
    }


}
