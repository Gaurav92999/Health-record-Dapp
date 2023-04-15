// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract HealthRecord {
struct Patient {
string name;
uint age;
string sex;
uint weight;
uint height;
string bloodGroup;
string[] symptoms;
string disease;
string doctor;
uint lastAppointmentDate;
string hospitalName;
}
mapping(address => Patient) public records;

event RecordUpdated(address indexed patient);
event RecordDeleted(address indexed patient);

// Verifier contract address
address public verifier;

constructor(address _verifier) {
    verifier = _verifier;
}

modifier onlyVerifier() {
    require(msg.sender == verifier, "Only verifier can perform this action");
    _;
}

function setRecord(
    string memory _name,
    uint _age,
    string memory _sex,
    uint _weight,
    uint _height,
    string memory _bloodGroup,
    string[] memory _symptoms,
    string memory _disease,
    string memory _doctor,
    uint _lastAppointmentDate,
    string memory _hospitalName
) public onlyVerifier {
    require(_weight > 0 && _weight <= 300, "Invalid weight");
    require(_height > 0 && _height <= 300, "Invalid height");

    Patient memory newPatient = Patient({
        name: _name,
        age: _age,
        sex: _sex,
        weight: _weight,
        height: _height,
        bloodGroup: _bloodGroup,
        symptoms: _symptoms,
        disease: _disease,
        doctor: _doctor,
        lastAppointmentDate: _lastAppointmentDate,
        hospitalName: _hospitalName
    });

    records[msg.sender] = newPatient;

    emit RecordUpdated(msg.sender);
}



function getRecommendations(address _patient) public view onlyVerifier returns (string[] memory) {
    string[] memory symptoms = records[_patient].symptoms;

    uint numSymptoms = symptoms.length;
    string[] memory recommendations = new string[](3);

    if (numSymptoms == 1) {
        recommendations[0] = "Drink plenty of fluids and get enough rest.";
        recommendations[1] = "";
        recommendations[2] = "";
    } else if (numSymptoms == 2) {
        recommendations[0] = "";
        recommendations[1] = "Take medication as prescribed by your doctor";
        recommendations[2] = "";
    } else if (numSymptoms == 3) {
        recommendations[0] = "";
        recommendations[1] = "";
        recommendations[2] = "Seek medical attention immediately";
    } else {
        recommendations[0] = "Take rest";
        recommendations[1] = "";
        recommendations[2] = "";
    }

    return recommendations;
}
}
