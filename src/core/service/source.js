export function solidityCode(name) {
  const contractName = `${name.replace(/\s+/g, "")}`;
  return `
  // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; 

contract ${contractName} {
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowed;
    
    string public symbol;
    uint8 public decimals;
    string public name;
    uint256 private _totalSupply;
    address public owner; 

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    constructor(
        uint8 _decimals,
        string memory _symbol,
        string memory _name,
        uint256 _total_supply
    ) {
        decimals = _decimals;
        symbol = _symbol;
        name = _name;
        _totalSupply = _total_supply * (10 ** uint256(_decimals)); 
        balances[msg.sender] = _totalSupply;
        owner = msg.sender;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address tokenOwner) public view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        require(numTokens <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] -= numTokens;
        balances[receiver] += numTokens;
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address _owner, address delegate) public view returns (uint) {
        return allowed[_owner][delegate];
    }

    function transferFrom(address _owner, address buyer, uint numTokens) public returns (bool) {
        require(numTokens <= balances[_owner], "Insufficient balance");
        require(numTokens <= allowed[_owner][msg.sender], "Allowance exceeded");

        balances[_owner] -= numTokens;
        allowed[_owner][msg.sender] -= numTokens;
        balances[buyer] += numTokens;
        emit Transfer(_owner, buyer, numTokens);
        return true;
    }

    function mint(address to, uint256 value) public onlyOwner {
        require(to != address(0), "Cannot mint to the zero address");
        _totalSupply += value;
        balances[to] += value;
        emit Transfer(address(0), to, value);
    }

    function burn(uint256 value) public {
        require(balances[msg.sender] >= value, "Insufficient balance to burn");
        _totalSupply -= value;
        balances[msg.sender] -= value;
        emit Transfer(msg.sender, address(0), value);
    }
}

  `;
}
