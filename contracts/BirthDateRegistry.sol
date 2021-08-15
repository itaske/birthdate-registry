pragma solidity ^0.5.0;

contract BirthDateRegistry{
    uint public birthDetailsCount = 0;

    struct BirthDetail{
        uint id;
        string nin;
        string dateTime;
        string fullName;
        string fatherNIN;
        string motherNIN;
        bool verified;
    }

    mapping(uint => BirthDetail) public birthDetails;

event BirthDetailCreated(
         uint id,
         string nin,
        string dateTime,
        string fullName,
        string fatherNIN,
        string motherNIN,
        bool verified
);

event BirthDetailVerified(
    uint id,
    bool verified
);
    constructor() public{
        createBirthDetail("12345678", "2021-05-03", "Udochukwu Chibuikem Patrick", "12345","65686");
    }
    function createBirthDetail(string memory _nin, string memory _dateTime,string memory _fullName, string memory _fatherNIN, string memory _motherNIN) public {
        birthDetailsCount++;
        birthDetails[birthDetailsCount] = BirthDetail(birthDetailsCount, _nin, _dateTime,_fullName, _fatherNIN, _motherNIN, false);
        emit BirthDetailCreated(birthDetailsCount, _nin, _dateTime,_fullName, _fatherNIN, _motherNIN, false);
    }

    function toggleVerification(uint _id)public{
        BirthDetail memory _birthDetail = birthDetails[_id];
        _birthDetail.verified = !_birthDetail.verified;
        birthDetails[_id] = _birthDetail;
        emit BirthDetailVerified(_id, _birthDetail.verified);
    }
}