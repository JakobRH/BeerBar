// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IBeerToken.sol";

interface IERC223Recipient {
    function tokenFallback(
        address _from,
        uint256 _value,
        bytes calldata _data
    ) external;
}

library Address {
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}

contract BeerToken is IBeerToken {
    string private _name;
    string private _symbol;
    uint8 private _decimals;
    uint256 private _totalSupply;
    address public _owner;
    bytes constant _empty = hex"00000000";
    mapping(address => uint256) public balances;

    constructor() {
        _name = 'BeerToken';
        _symbol = 'BEER';
        _decimals = 0;
        _owner = msg.sender;
    }

    modifier isOwner(){
        require(tx.origin == _owner);
        _;
    }

    function standard() public pure returns (string memory) {
        return "erc223";
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function balanceOf(address owner) public view override returns (uint256) {
        return balances[owner];
    }

    function transfer(address _to, uint256 _value, bytes calldata _data) public override returns (bool success) {
        balances[msg.sender] = balances[msg.sender] - _value;
        balances[_to] = balances[_to] + _value;
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _data);
        }
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transfer(address _to, uint256 _value) public override returns (bool success){
        balances[msg.sender] = balances[msg.sender] - _value;
        balances[_to] = balances[_to] + _value;
        if (Address.isContract(_to)) {
            IERC223Recipient(_to).tokenFallback(msg.sender, _value, _empty);
        }
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function mint(address account, uint256 value) public isOwner returns (bool success) {
        require(account != address(0));
        _totalSupply = _totalSupply + (value);
        balances[account] = balances[account] + (value);
        emit Transfer(address(0), account, value);
        return true;
    }

    function burn(uint256 value) public {
        _totalSupply = _totalSupply - (value);
        balances[msg.sender] = balances[msg.sender] - (value);
        emit Transfer(msg.sender, address(0), value);
    }
}
