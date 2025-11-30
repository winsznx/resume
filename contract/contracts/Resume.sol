// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Resume {
    struct WorkExperience {
        uint256 id;
        address owner;
        string company;
        string position;
        string description;
        uint256 startDate;
        uint256 endDate;
        bool current;
        uint256 timestamp;
        bool exists;
    }

    struct Education {
        uint256 id;
        address owner;
        string institution;
        string degree;
        string field;
        uint256 graduationYear;
        uint256 timestamp;
        bool exists;
    }

    struct Skill {
        uint256 id;
        address owner;
        string name;
        uint256 endorsements;
        uint256 timestamp;
        bool exists;
    }

    struct Project {
        uint256 id;
        address owner;
        string title;
        string description;
        string link;
        uint256 timestamp;
        bool exists;
    }

    // State variables
    uint256 public entryFee = 0.0000001 ether;
    address public owner;

    // Counters
    uint256 public workCounter;
    uint256 public educationCounter;
    uint256 public skillCounter;
    uint256 public projectCounter;

    // Mappings
    mapping(uint256 => WorkExperience) public workExperiences;
    mapping(uint256 => Education) public educations;
    mapping(uint256 => Skill) public skills;
    mapping(uint256 => Project) public projects;

    mapping(address => uint256[]) public userWorkIds;
    mapping(address => uint256[]) public userEducationIds;
    mapping(address => uint256[]) public userSkillIds;
    mapping(address => uint256[]) public userProjectIds;

    mapping(uint256 => mapping(address => bool)) public skillEndorsements;

    // Events
    event WorkAdded(uint256 indexed id, address indexed owner, string company);
    event WorkDeleted(uint256 indexed id, address indexed owner);
    event EducationAdded(uint256 indexed id, address indexed owner, string institution);
    event EducationDeleted(uint256 indexed id, address indexed owner);
    event SkillAdded(uint256 indexed id, address indexed owner, string name);
    event SkillDeleted(uint256 indexed id, address indexed owner);
    event ProjectAdded(uint256 indexed id, address indexed owner, string title);
    event ProjectDeleted(uint256 indexed id, address indexed owner);
    event SkillEndorsed(uint256 indexed skillId, address indexed endorser);
    event FeeUpdated(uint256 oldFee, uint256 newFee);

    // Custom errors (more gas efficient than require strings)
    error InsufficientFee();
    error InvalidDate();
    error OnlyOwner();
    error EntryNotFound();
    error NotEntryOwner();
    error AlreadyEndorsed();
    error CannotEndorseOwnSkill();
    error InvalidGraduationYear();
    error EmptyField(string fieldName);

    constructor() {
        owner = msg.sender;
    }

    // Modifiers
    modifier onlyEntryOwner(uint256 _id, mapping(uint256 => WorkExperience) storage entries) {
        if (!entries[_id].exists) revert EntryNotFound();
        if (entries[_id].owner != msg.sender) revert NotEntryOwner();
        _;
    }

    // Work Experience Functions
    function addWorkExperience(
        string memory _company,
        string memory _position,
        string memory _description,
        uint256 _startDate,
        uint256 _endDate,
        bool _current
    ) public payable {
        if (msg.value < entryFee) revert InsufficientFee();
        if (bytes(_company).length == 0) revert EmptyField("company");
        if (bytes(_position).length == 0) revert EmptyField("position");
        if (_startDate > block.timestamp) revert InvalidDate();
        if (!_current && _endDate != 0 && _endDate < _startDate) revert InvalidDate();

        uint256 id;
        unchecked {
            id = workCounter++;
        }

        workExperiences[id] = WorkExperience({
            id: id,
            owner: msg.sender,
            company: _company,
            position: _position,
            description: _description,
            startDate: _startDate,
            endDate: _endDate,
            current: _current,
            timestamp: block.timestamp,
            exists: true
        });

        userWorkIds[msg.sender].push(id);
        emit WorkAdded(id, msg.sender, _company);
    }

    function deleteWorkExperience(uint256 _id) public {
        if (!workExperiences[_id].exists) revert EntryNotFound();
        if (workExperiences[_id].owner != msg.sender) revert NotEntryOwner();
        
        workExperiences[_id].exists = false;
        emit WorkDeleted(_id, msg.sender);
    }

    // Education Functions
    function addEducation(
        string memory _institution,
        string memory _degree,
        string memory _field,
        uint256 _graduationYear
    ) public payable {
        if (msg.value < entryFee) revert InsufficientFee();
        if (bytes(_institution).length == 0) revert EmptyField("institution");
        if (_graduationYear > 0 && (_graduationYear < 1900 || _graduationYear > block.timestamp / 365 days + 1970 + 10)) {
            revert InvalidGraduationYear();
        }

        uint256 id;
        unchecked {
            id = educationCounter++;
        }

        educations[id] = Education({
            id: id,
            owner: msg.sender,
            institution: _institution,
            degree: _degree,
            field: _field,
            graduationYear: _graduationYear,
            timestamp: block.timestamp,
            exists: true
        });

        userEducationIds[msg.sender].push(id);
        emit EducationAdded(id, msg.sender, _institution);
    }

    function deleteEducation(uint256 _id) public {
        if (!educations[_id].exists) revert EntryNotFound();
        if (educations[_id].owner != msg.sender) revert NotEntryOwner();
        
        educations[_id].exists = false;
        emit EducationDeleted(_id, msg.sender);
    }

    // Skill Functions
    function addSkill(string memory _name) public payable {
        if (msg.value < entryFee) revert InsufficientFee();
        if (bytes(_name).length == 0) revert EmptyField("skill name");

        uint256 id;
        unchecked {
            id = skillCounter++;
        }

        skills[id] = Skill({
            id: id,
            owner: msg.sender,
            name: _name,
            endorsements: 0,
            timestamp: block.timestamp,
            exists: true
        });

        userSkillIds[msg.sender].push(id);
        emit SkillAdded(id, msg.sender, _name);
    }

    function endorseSkill(uint256 _skillId) public {
        if (!skills[_skillId].exists) revert EntryNotFound();
        if (skillEndorsements[_skillId][msg.sender]) revert AlreadyEndorsed();
        if (skills[_skillId].owner == msg.sender) revert CannotEndorseOwnSkill();

        unchecked {
            skills[_skillId].endorsements++;
        }
        skillEndorsements[_skillId][msg.sender] = true;
        emit SkillEndorsed(_skillId, msg.sender);
    }

    function deleteSkill(uint256 _id) public {
        if (!skills[_id].exists) revert EntryNotFound();
        if (skills[_id].owner != msg.sender) revert NotEntryOwner();
        
        skills[_id].exists = false;
        emit SkillDeleted(_id, msg.sender);
    }

    // Project Functions
    function addProject(
        string memory _title,
        string memory _description,
        string memory _link
    ) public payable {
        if (msg.value < entryFee) revert InsufficientFee();
        if (bytes(_title).length == 0) revert EmptyField("title");

        uint256 id;
        unchecked {
            id = projectCounter++;
        }

        projects[id] = Project({
            id: id,
            owner: msg.sender,
            title: _title,
            description: _description,
            link: _link,
            timestamp: block.timestamp,
            exists: true
        });

        userProjectIds[msg.sender].push(id);
        emit ProjectAdded(id, msg.sender, _title);
    }

    function deleteProject(uint256 _id) public {
        if (!projects[_id].exists) revert EntryNotFound();
        if (projects[_id].owner != msg.sender) revert NotEntryOwner();
        
        projects[_id].exists = false;
        emit ProjectDeleted(_id, msg.sender);
    }

    // View Functions
    function getUserWorkExperiences(address _user) public view returns (WorkExperience[] memory) {
        uint256[] memory ids = userWorkIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (workExperiences[ids[i]].exists) {
                unchecked {
                    activeCount++;
                }
            }
        }

        WorkExperience[] memory result = new WorkExperience[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (workExperiences[ids[i]].exists) {
                result[index] = workExperiences[ids[i]];
                unchecked {
                    index++;
                }
            }
        }

        return result;
    }

    function getUserEducations(address _user) public view returns (Education[] memory) {
        uint256[] memory ids = userEducationIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (educations[ids[i]].exists) {
                unchecked {
                    activeCount++;
                }
            }
        }

        Education[] memory result = new Education[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (educations[ids[i]].exists) {
                result[index] = educations[ids[i]];
                unchecked {
                    index++;
                }
            }
        }

        return result;
    }

    function getUserSkills(address _user) public view returns (Skill[] memory) {
        uint256[] memory ids = userSkillIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (skills[ids[i]].exists) {
                unchecked {
                    activeCount++;
                }
            }
        }

        Skill[] memory result = new Skill[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (skills[ids[i]].exists) {
                result[index] = skills[ids[i]];
                unchecked {
                    index++;
                }
            }
        }

        return result;
    }

    function getUserProjects(address _user) public view returns (Project[] memory) {
        uint256[] memory ids = userProjectIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (projects[ids[i]].exists) {
                unchecked {
                    activeCount++;
                }
            }
        }

        Project[] memory result = new Project[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (projects[ids[i]].exists) {
                result[index] = projects[ids[i]];
                unchecked {
                    index++;
                }
            }
        }

        return result;
    }

    // Owner Functions
    function updateFee(uint256 _newFee) public {
        if (msg.sender != owner) revert OnlyOwner();
        uint256 oldFee = entryFee;
        entryFee = _newFee;
        emit FeeUpdated(oldFee, _newFee);
    }

    function withdraw() public {
        if (msg.sender != owner) revert OnlyOwner();
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
