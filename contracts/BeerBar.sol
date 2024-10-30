// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Roles.sol";
import "./IBeerBar.sol";
import "./BeerToken.sol";

contract BeerBar is IBeerBar, IERC223Recipient {
    using Roles for Roles.Role;

    Roles.Role private owners;
    Roles.Role private barkeepers;
    BeerToken internal beerTokenContract;
    uint256 internal beerPrice;
    bool internal isOpen;
    mapping(address => uint256) public orders;

    constructor () {
        owners.add(msg.sender);
        isOpen = false;
    }

    modifier isBarOwner(){
        require(owners.has(tx.origin), "IS_NOT_AN_OWNER");
        _;
    }

    modifier isBarKeeperModifier(){
        require(barkeepers.has(tx.origin), "IS_NOT_A_BARKEEPER");
        _;
    }

    modifier isBarOpen(){
        require(isOpen, "BAR_IS_NOT_OPEN");
        _;
    }

    modifier isBarClosed(){
        require(!isOpen, "BAR_IS_OPEN");
        _;
    }

    function isOwner(address account) external view returns (bool) {
        if(owners.has(account)){
            return true;
        }
        return false;
    }

    function addOwner(address account) external isBarOwner {
        owners.add(account);
        emit OwnerAdded(account);
    }

    function renounceOwner() external isBarOwner {
        owners.remove(tx.origin);
        emit OwnerRemoved(tx.origin);
    }

    function isBarkeeper(address account) external view returns (bool) {
        if(barkeepers.has(account)){
            return true;
        }
        return false;
    }

    function addBarkeeper(address account) external isBarOwner {
        barkeepers.add(account);
        emit BarkeeperAdded(account);
    }

    function renounceBarkeeper() external isBarKeeperModifier {
        barkeepers.remove(tx.origin);
        emit BarkeeperRemoved(tx.origin);
    }

    function setBeerTokenContractAddress(address _address) external isBarOwner {
        beerTokenContract = BeerToken(_address);
    }

    function beerTokenContractAddress() external view returns(address) {
        return address(beerTokenContract);
    }

    function openBar() external isBarKeeperModifier {
        isOpen = true;
        emit BarOpened();
    }

    function closeBar() virtual external isBarKeeperModifier {
        isOpen = false;
        emit BarClosed();
    }

    function barIsOpen() external view returns (bool) {
        return isOpen;
    }

    function serveBeer(address customer, uint amount) external isBarOpen isBarKeeperModifier {
        orders[customer] -= amount;
        beerTokenContract.burn(amount);
    }

    function cancelOrder(uint amount) external{
        orders[msg.sender] -= amount;
        beerTokenContract.transfer(msg.sender, amount, hex"00000000");
        emit BeerCanceled(msg.sender, amount);
    }

    function pendingBeer(address _addr) external view returns (uint256){
        return orders[_addr];
    }

    function setBeerPrice(uint256 _price) external isBarOwner isBarClosed {
        beerPrice = _price;
    }

    function getBeerPrice() external view returns(uint256) {
        return beerPrice;
    }

    function buyToken() external payable{
        require(beerPrice != 0, "NO_BEER_PRICE");
        uint tip = msg.value%beerPrice;
        beerTokenContract.transfer(msg.sender, (msg.value-tip)/beerPrice);
    }

    function payout(address payable _receiver, uint256 _amount) external isBarOwner {
        require(address(this).balance-_amount >= 0);
        _receiver.transfer(_amount);
    }

    function tokenFallback(address _from, uint256 _value, bytes calldata _data) external {
        require(msg.sender == address(beerTokenContract), "WRONG_TOKEN_TYPE");
        if(keccak256(_data) == keccak256(abi.encodePacked("supply"))){
            require(owners.has(_from), "IS_NOT_AN_OWNER");
            emit BeerSupplied(_from, _value);
        }else{
            require(isOpen, "BAR_IS_NOT_OPEN");
            orders[_from] += _value;
            emit BeerOrdered(_from, _value);
        }
    }

}
