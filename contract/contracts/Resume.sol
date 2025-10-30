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
    event EducationAdded(uint256 indexed id, address indexed owner, string institution);
    event SkillAdded(uint256 indexed id, address indexed owner, string name);
    event ProjectAdded(uint256 indexed id, address indexed owner, string title);
    event SkillEndorsed(uint256 indexed skillId, address indexed endorser);

    constructor() {
        owner = msg.sender;
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
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_company).length > 0, "Company required");
        require(bytes(_position).length > 0, "Position required");

        uint256 id = workCounter++;

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

    // Education Functions
    function addEducation(
        string memory _institution,
        string memory _degree,
        string memory _field,
        uint256 _graduationYear
    ) public payable {
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_institution).length > 0, "Institution required");

        uint256 id = educationCounter++;

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

    // Skill Functions
    function addSkill(string memory _name) public payable {
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_name).length > 0, "Skill name required");

        uint256 id = skillCounter++;

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
        require(skills[_skillId].exists, "Skill does not exist");
        require(!skillEndorsements[_skillId][msg.sender], "Already endorsed");
        require(skills[_skillId].owner != msg.sender, "Cannot endorse own skill");

        skills[_skillId].endorsements++;
        skillEndorsements[_skillId][msg.sender] = true;
        emit SkillEndorsed(_skillId, msg.sender);
    }

    // Project Functions
    function addProject(
        string memory _title,
        string memory _description,
        string memory _link
    ) public payable {
        require(msg.value >= entryFee, "Insufficient fee");
        require(bytes(_title).length > 0, "Title required");

        uint256 id = projectCounter++;

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

    // View Functions
    function getUserWorkExperiences(address _user) public view returns (WorkExperience[] memory) {
        uint256[] memory ids = userWorkIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (workExperiences[ids[i]].exists) activeCount++;
        }

        WorkExperience[] memory result = new WorkExperience[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (workExperiences[ids[i]].exists) {
                result[index] = workExperiences[ids[i]];
                index++;
            }
        }

        return result;
    }

    function getUserEducations(address _user) public view returns (Education[] memory) {
        uint256[] memory ids = userEducationIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (educations[ids[i]].exists) activeCount++;
        }

        Education[] memory result = new Education[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (educations[ids[i]].exists) {
                result[index] = educations[ids[i]];
                index++;
            }
        }

        return result;
    }

    function getUserSkills(address _user) public view returns (Skill[] memory) {
        uint256[] memory ids = userSkillIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (skills[ids[i]].exists) activeCount++;
        }

        Skill[] memory result = new Skill[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (skills[ids[i]].exists) {
                result[index] = skills[ids[i]];
                index++;
            }
        }

        return result;
    }

    function getUserProjects(address _user) public view returns (Project[] memory) {
        uint256[] memory ids = userProjectIds[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (projects[ids[i]].exists) activeCount++;
        }

        Project[] memory result = new Project[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < ids.length; i++) {
            if (projects[ids[i]].exists) {
                result[index] = projects[ids[i]];
                index++;
            }
        }

        return result;
    }

    // Owner Functions
    function updateFee(uint256 _newFee) public {
        require(msg.sender == owner, "Only owner");
        entryFee = _newFee;
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner");
        payable(owner).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
