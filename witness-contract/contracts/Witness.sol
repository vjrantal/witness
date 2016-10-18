pragma solidity ^0.4.2;

contract Witness {

  mapping(bytes32 => bytes32) hashes;

  event Stored(bytes32 id);
  event Retrieved(bytes32 hash);

  function store(bytes32 hash) returns (bytes32) {
    bytes32 id = sha256(msg.sender, block.timestamp);
    hashes[id] = hash;
    Stored(id);
    return id;
  }

  function retrieve(bytes32 id) returns (bytes32) {
    bytes32 hash = hashes[id];
    Retrieved(hash);
    return hash;
  }

}
