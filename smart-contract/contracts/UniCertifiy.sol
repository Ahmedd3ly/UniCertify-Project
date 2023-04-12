// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// The constructor() function is the contract constructor that is executed when the contract is deployed.
// It sets the owner variable to the address of the contract deployer.
contract UniCertify {
    constructor() {
        owner = msg.sender;
    }

    address public owner; // Public variable that stores the address of the contract owner.
    uint16 public countAdmins = 0; // Public variable that keep track of the number of admins.
    uint16 public countCertificates = 0; // Public variable that keep track of the number of certificates.

    // Defines the admin structure that contains the block number, admin name, admin email and university.
    struct Admin {
        uint blockNumber;
        string name;
        string uni;
        string email;
    }
    // Defines the certificate structure that contains the student id, student name,
    // the student image, university, the certificate IPFS hash and the certificate creator.
    struct Certificate {
        uint id;
        uint issueDate;
        string name;
        string uni;
        string image;
        string ipfsHash;
        string adminName;
        string adminEmail;
        address creator;
    }

    // Mappings that associate the admins (University authorities) structure with their address,
    // certificates structure with the number of certificates respectively.
    mapping(address => Admin) private Admins;
    mapping(uint16 => Certificate) private Certificates;

    // Mapping that keeps track of IPFS hashes that have already been uploaded.
    mapping(string => bool) private uploadedCertificates;

    //----------------------------------Modifiers-----------------------------------------------//

    // Modifier that checks if the caller is the owner of the contract.
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this action"
        );
        _;
    }

    // Modifier that checks if the address is valid (i.e address != 0).
    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    // Modifier that checks if the caller is an authorized admin (i.e same university as the student).
    modifier authorisedAdmin(string calldata _uni) {
        require(
            keccak256(bytes(Admins[msg.sender].uni)) ==
                keccak256(bytes(_uni)),
            "Caller is not authorized to edit this document"
        );
        _;
    }

    // Modifier that checks if the caller is an assigned admin to upload certificates.
    modifier assignedAdmin(address _address) {
        require(
            Admins[_address].blockNumber != 0,
            "Caller is not assigned to upload certificates"
        );
        _;
    }

    // Modifier that checks if the caller is a new admin.
    modifier newAdmin(address _address) {
        require(
            Admins[_address].blockNumber == 0,
            "Caller is already an assigned admin"
        );
        _;
    }

    //-----------------------------------Functions-----------------------------------------------//

    // Adds a new admin with the given address, name, id, and University. This function can only be called by the owner of the contract.
    function addAdmin(
        address _address,
        string calldata _name,
        string calldata _uni,
        string calldata _email
    ) public onlyOwner newAdmin(_address) {
        Admins[_address].blockNumber = block.number;
        Admins[_address].name = _name;
        Admins[_address].uni = _uni;
        Admins[_address].email = _email;
        ++countAdmins;
    }

    // Deletes the admin with the given address. This function can only be called by the owner of the contract.
    function deleteAdmin(
        address _address
    ) public onlyOwner assignedAdmin(_address) {
        Admins[_address].blockNumber = 0;
        Admins[_address].name = "";
        Admins[_address].uni = "";
        Admins[_address].email = "";
        --countAdmins;
    }

    // Uploads a new certificate with the given IPFS hash and links it to the student information.
    // This function can only be called by an authorized admin and can only be called once per document hash.
    function uploadCertificate(
        uint _id,
        uint _issueDate,
        string calldata _name,
        string calldata _uni,
        string calldata _image,
        string calldata _ipfsHash
    ) public authorisedAdmin(_uni) assignedAdmin(msg.sender) {
        require(
            !uploadedCertificates[_ipfsHash],
            "Certificate is already uploaded"
        );
        Certificate memory newCertificate = Certificate(
            _id,
            _issueDate,
            _name,
            _uni,
            _image,
            _ipfsHash,
            Admins[msg.sender].name,
            Admins[msg.sender].email,
            msg.sender
        );
        Certificates[countCertificates] = newCertificate;
        uploadedCertificates[_ipfsHash] = true;

        ++countCertificates;
    }

    // Returns all the uploaded certificates. This function can be called for free (i.e., without paying gas fees).
    function getCertificates() public view returns (Certificate[] memory) {
        Certificate[] memory allCertificates = new Certificate[](
            countCertificates
        );

        for (uint16 i = 0; i < countCertificates; i++) {
            allCertificates[i] = Certificates[i];
        }

        return allCertificates;
    }

    // Checks if the hash of the given certificate exists and returns a boolean. This function can be called by anyone for free (i.e., without paying gas fees).
    function verifyCertificate(string calldata _ipfsHash) public view returns (bool) {
       return(uploadedCertificates[_ipfsHash]);
    }
}
