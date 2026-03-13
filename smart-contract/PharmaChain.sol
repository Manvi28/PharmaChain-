// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PharmaChain {

    enum Status { Manufactured, InTransit, Delivered }

    struct Batch {
        string batchId;
        string medicineName;
        uint expiryDate;
        string location;
        address manufacturer;
        address currentOwner;
        Status status;
    }

    mapping(string => Batch) public batches;

    function createBatch(
        string memory _batchId,
        string memory _medicineName,
        uint _expiryDate,
        string memory _location
    ) public {

        batches[_batchId] = Batch(
            _batchId,
            _medicineName,
            _expiryDate,
            _location,
            msg.sender,
            msg.sender,
            Status.Manufactured
        );
    }

    function transferOwnership(
        string memory _batchId,
        address _newOwner
    ) public {

        Batch storage batch = batches[_batchId];

        require(msg.sender == batch.currentOwner);

        batch.currentOwner = _newOwner;
        batch.status = Status.InTransit;
    }

    function getBatch(string memory _batchId)
        public
        view
        returns (Batch memory)
    {
        return batches[_batchId];
    }
}