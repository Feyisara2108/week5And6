// SPDX-License-Identifier:MIT
pragma solidity ^0.8.30;

contract Mutmahinat {
    uint256 public totalSupply;

    mapping(address _owner => uint256 balance) public balanceOf;
    mapping(address _owner => mapping(address _spender => uint256 _amount)) public allowance;

    string public constant name = "Mutmahinat";
    string public constant symbol = "MUT";
    uint8 public constant decimals = 18;

    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 indexed _amount);
    event Approval(address indexed owner, address indexed spender, uint256 indexed _amount);

    error NotOwner(address caller);
    error ZeroAddress();
    error InsufficientBalance(uint256 available, uint256 required);
    error InsufficientAllowance(uint256 available, uint256 required);

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(msg.sender);
        _;
    }

    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        _mint(msg.sender, _initialSupply);
    }

    function transfer(address recipient, uint256 _amount) external returns (bool) {
        if (recipient == address(0)) revert ZeroAddress();
        if (balanceOf[msg.sender] < _amount) revert InsufficientBalance(balanceOf[msg.sender], _amount);

        balanceOf[msg.sender] -= _amount;
        balanceOf[recipient] += _amount;

        emit Transfer(msg.sender, recipient, _amount);
        return true;
    }

    function approve(address spender, uint256 _amount) external returns (bool) {
        if (spender == address(0)) revert ZeroAddress();

        allowance[msg.sender][spender] = _amount;

        emit Approval(msg.sender, spender, _amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 _amount) external returns (bool) {
        if (recipient == address(0)) revert ZeroAddress();
        if (allowance[sender][msg.sender] < _amount) {
            revert InsufficientAllowance(allowance[sender][msg.sender], _amount);
        }
        if (balanceOf[sender] < _amount) revert InsufficientBalance(balanceOf[sender], _amount);

        allowance[sender][msg.sender] -= _amount;
        balanceOf[sender] -= _amount;
        balanceOf[recipient] += _amount;

        emit Transfer(sender, recipient, _amount);
        return true;
    }

    function mint(uint256 _amount) external onlyOwner {
        _mint(msg.sender, _amount);
    }

    function burn(uint256 _amount) external {
        if (balanceOf[msg.sender] < _amount) revert InsufficientBalance(balanceOf[msg.sender], _amount);

        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;

        emit Transfer(msg.sender, address(0), _amount);
    }

    function _mint(address _to, uint256 _amount) internal {
        if (_to == address(0)) revert ZeroAddress();

        balanceOf[_to] += _amount;
        totalSupply += _amount;

        emit Transfer(address(0), _to, _amount);
    }
}
