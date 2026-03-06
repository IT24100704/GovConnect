// Government Departments List (from your image)
export const governmentDepartments = [
  "Central Bank of Sri Lanka",
  "Ceylon Electricity Board",
  "Colombo Municipal Council",
  "Colombo Stock Exchange",
  "Commission to Investigate Allegations of Bribe",
  "Department of Animal Production and Health",
  "Department of Archives",
  "Department of Buddhist Affairs",
  "Department of Commerce",
  "Department of Examinations",
  "Department of Export Agriculture",
  "Department of Fisheries and Aquatic Resources",
  "Department of Government Factory",
  "Department of Government Printing (Gazzettes)",
  "Department of Hindu Affairs",
  "Department of Immigration and Emigration",
  "Department of Land Settlement",
  "Department of Meteorology",
  "Department of Motor Traffic",
  "Department of National Botanic Gardens",
  "Department of Official Languages",
  "Department of Public Trustee",
  "Department of Railways",
  "Department of Samurdhi Development",
  "Department of Social Services",
  "Department of Technical Education and Training",
  "Department of Valuation",
  "Department of Wildlife Conservation",
  "Disaster Management Centre",
  "Epidemiology Unit",
  "eProcurement",
  "Geological Survey and Mines Bureau",
  "Health Promotion Bureau",
  "Hector Kobbekaduwa Agrarian Research and Training Institute",
  "Information and Communication Technology Agency of Sri Lanka",
  "Lanka Electricity Company (Pvt) Ltd",
  "Mahaweli Authority of Sri Lanka",
  "Ministry of Agriculture",
  "Ministry of Child Development and Women`s Affairs",
  "Ministry of Culture and Art Affairs",
  "Ministry of Defence and Urban Development",
  "Ministry of Digital Economy",
  "Ministry of Disaster Management",
  "Ministry of Education",
  "Ministry of Enterprise Development and Investment Promotion",
  "Ministry of Finance and Planning",
  "Ministry of Fisheries and Aquatic Resource Development",
  "Ministry of Foreign Affairs",
  "Ministry of Health",
  "Ministry of Higher Education",
  "Ministry of Highways",
  "Ministry of Highways and Road Development – Maga Naguma Division",
  "Ministry of Highways, Ports Shipping",
  "Ministry of Housing and Common Amenities",
  "Ministry of Indigenous Medicine",
  "Ministry of Industries",
  "Ministry of Irrigation & Water Resources Management",
  "Ministry of Justice",
  "Ministry of Justice and Law Reforms",
  "Ministry of Labour and Labour Relations",
  "Ministry of Land and Land Development",
  "Ministry of Livestock and Rural Community Development",
  "Ministry of Local Government and Provincial Councils",
  "Ministry of Mass Media and Information",
  "Ministry of Nation Building and State Infrastructure Development",
  "Ministry of National Heritage Cultural Affairs",
  "Ministry of Parliamentary Affairs",
  "Ministry of Petroleum Industries",
  "Ministry of Plan Implementation",
  "Ministry of Plantation Industries",
  "Ministry of Postal Services",
  "Ministry of Power and Energy",
  "Ministry of Public Administration and Home Affairs",
  "Ministry of Public Administration, Home Affairs, Provincial Councils and Local Government",
  "Ministry of Religious Affairs and Moral Upliftment",
  "Ministry of Resettlement",
  "Ministry of Sport",
  "Ministry of State Resources and Enterprise Development",
  "Ministry of Technology, Research and Atomic Energy",
  "Ministry of Textile Industry Development",
  "Ministry of Tourism",
  "Ministry of Trade, Commerce, Food security and Co-operative Development",
  "Ministry of Traditional Industries Small Enterprises Development",
  "Ministry of Transport",
  "Ministry of Urban Development and Housing – Housing & Construction Division",
  "Ministry of Urban Development and Sacred Area Development",
  "Ministry of Vocational and Technical Training",
  "Ministry of Water Supply and Drainage",
  "Ministry of Women, Child Affairs & Social Empowerment",
  "Ministry of Youth Affairs Skills Development",
  "National Secretariat for Non-governmental Organizations",
  "National Water Supply & Drainage Board",
  "Public Service Commission",
  "Registrar General's Department",
  "Registrar of Companies",
  "Road Development Authority",
  "Sri Lanka Air force",
  "Sri Lanka Army",
  "Sri Lanka Ayurvedic Drugs Corporation",
  "Sri Lanka Export Development Board",
  "Sri Lanka Land Reclamation and Development Corporation",
  "Sri Lanka Planetarium",
  "Sri Lanka Police",
  "Sri Lanka Post",
  "Sri Lanka Railways",
  "Sri Lanka Standards Institute",
  "Sri Lanka Tea Board",
  "Sri Lanka Tourism",
  "Sri Lanka Tourism Development Authority",
  "Survey Department",
  "Tea Small Holdings Development Authority",
  "Telecommunications Regulatory Commission of Sri Lanka",
  "The Parliament",
  "Tower Hall Theater Foundation",
  "Water Resources Board",
  "Welfare Benefits Board"
];
// Mock users for different departments
export const mockUsers = [
  {
    id: "auth_001",
    name: "Mr. Kamal Perera",
    email: "kamal@municipal.gov.lk",
    password: "password123",
    userType: "authority",
    department: "Municipal Council",
    departmentId: "dept_001",
    role: "Senior Officer"
  },
  {
    id: "auth_002",
    name: "Ms. Nadeeka Silva",
    email: "nadeeka@police.gov.lk",
    password: "password123",
    userType: "authority",
    department: "Police Department",
    departmentId: "dept_002",
    role: "Investigator"
  },
  {
    id: "auth_003",
    name: "Mr. Ruwan Wijesinghe",
    email: "ruwan@waterboard.gov.lk",
    password: "password123",
    userType: "authority",
    department: "Water Board",
    departmentId: "dept_003",
    role: "Field Officer"
  },
  {
    id: "auth_004",
    name: "Mrs. Malini Perera",
    email: "malini@ceb.gov.lk",
    password: "password123",
    userType: "authority",
    department: "Electricity Board",
    departmentId: "dept_004",
    role: "Complaint Officer"
  },
  {
    id: "admin_001",
    name: "System Administrator",
    email: "admin@govconnect.lk",
    password: "adminpassword",
    userType: "admin",
    role: "Super Admin"
  }
];

export const sriLankaGeography = [
  {
    id: "prov_1",
    name: "Western Province",
    districts: [
      {
        id: "dist_1",
        name: "Colombo",
        dsDivisions: [
          {
            id: "ds_1",
            name: "Kaduwela",
            gsDivisions: ["Kaduwela South", "Kaduwela North", "Weliwita", "Hewagama"]
          },
          {
            id: "ds_2",
            name: "Maharagama",
            gsDivisions: ["Maharagama Town", "Nawinna", "Watthegedara", "Egodawatta"]
          }
        ]
      },
      {
        id: "dist_2",
        name: "Gampaha",
        dsDivisions: [
          {
            id: "ds_3",
            name: "Negombo",
            gsDivisions: ["Negombo Town", "Daluwakotuwa", "Katuwapitiya"]
          }
        ]
      }
    ]
  },
  {
    id: "prov_2",
    name: "Central Province",
    districts: [
      {
        id: "dist_3",
        name: "Kandy",
        dsDivisions: [
          {
            id: "ds_4",
            name: "Kandy Five Gravets",
            gsDivisions: ["Kandy Town", "Peradeniya", "Katugastota"]
          }
        ]
      }
    ]
  }
];

// Mock complaints with department assignments
export const mockComplaints = [
  // Municipal Council Complaints (dept_001)
  {
    id: "CMP001",
    title: "Illegal garbage dumping on main street",
    description: "Large pile of garbage dumped near the bus stop. Has been there for 3 days.",
    category: "Waste Management",
    status: "pending",
    priority: "high",
    createdAt: "2024-02-15T09:30:00Z",
    citizenId: "cit_001",
    citizenName: "Nimal Silva",
    citizenContact: "0771234567",
    departmentId: "dept_001",
    department: "Municipal Council",
    location: "Main Street, Colombo",
    attachments: []
  },
  {
    id: "CMP010",
    title: "Old building wall collapsed",
    description: "Safety hazard near the bus stand. Resolved by clearing debris.",
    category: "Safety",
    status: "resolved",
    priority: "high",
    createdAt: "2024-02-10T11:00:00Z",
    citizenId: "cit_001",
    citizenName: "Nimal Silva",
    citizenContact: "0771234567",
    departmentId: "dept_001",
    department: "Municipal Council",
    location: "Pettah, Colombo",
    attachments: []
  },
  {
    id: "CMP011",
    title: "Broken manhole cover",
    description: "Successfully replaced near the public park.",
    category: "Infrastructure",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-02-12T09:30:00Z",
    citizenId: "cit_004",
    citizenName: "Sunil Fernando",
    citizenContact: "0789876543",
    departmentId: "dept_001",
    department: "Municipal Council",
    location: "Viharamahadevi Park",
    attachments: []
  },
  {
    id: "CMP004",
    title: "Road pothole causing accidents",
    description: "Large pothole on school road needs immediate repair",
    category: "Infrastructure",
    status: "in-progress",
    priority: "urgent",
    createdAt: "2024-02-16T10:00:00Z",
    citizenId: "cit_004",
    citizenName: "Sunil Fernando",
    citizenContact: "0789876543",
    departmentId: "dept_001",
    department: "Municipal Council",
    location: "School Road, Colombo",
    attachments: []
  },

  // Police Department Complaints (dept_002)
  {
    id: "CMP002",
    title: "Corruption at land registry",
    description: "Officer asking for bribe to process document",
    category: "Corruption",
    status: "in-progress",
    priority: "urgent",
    createdAt: "2024-02-14T14:20:00Z",
    citizenId: "cit_002",
    citizenName: "Priyani Jayawardena",
    citizenContact: "0715556667",
    departmentId: "dept_002",
    department: "Police Department",
    location: "Land Registry, Colombo",
    attachments: []
  },
  {
    id: "CMP005",
    title: "Theft in neighborhood",
    description: "Suspicious activities reported in our area",
    category: "Crime",
    status: "pending",
    priority: "high",
    createdAt: "2024-02-17T09:00:00Z",
    citizenId: "cit_005",
    citizenName: "Mohamed Rizvi",
    citizenContact: "0763334445",
    departmentId: "dept_002",
    department: "Police Department",
    location: "Park Road, Colombo",
    attachments: []
  },

  // Water Board Complaints (dept_003)
  {
    id: "CMP003",
    title: "Water pipe burst",
    description: "Main water pipe burst near junction, water wastage for 2 days",
    category: "Utilities",
    status: "assigned",
    priority: "high",
    createdAt: "2024-02-13T11:00:00Z",
    citizenId: "cit_003",
    citizenName: "Kamal Perera",
    citizenContact: "0715556667",
    departmentId: "dept_003",
    department: "Water Board",
    location: "Kandy Road, Colombo",
    attachments: []
  },

  // Electricity Board Complaints (dept_004)
  {
    id: "CMP006",
    title: "Street light not working",
    description: "Street light broken for 2 weeks, area dark at night",
    category: "Infrastructure",
    status: "pending",
    priority: "medium",
    createdAt: "2024-02-15T14:20:00Z",
    citizenId: "cit_006",
    citizenName: "Dinesh Silva",
    citizenContact: "0789876543",
    departmentId: "dept_004",
    department: "Electricity Board",
    location: "Temple Road, Colombo",
    attachments: []
  }
];

// Mock internal notes
export const mockInternalNotes = [
  {
    id: "note_001",
    complaintId: "CMP002",
    note: "This is a serious corruption case. Need to gather evidence first.",
    createdBy: "auth_002",
    createdByName: "Ms. Nadeeka Silva",
    createdAt: "2024-02-14T10:30:00Z",
    isPrivate: true
  }
];

// Mock responses
export const mockResponses = [
  {
    id: "res_001",
    complaintId: "CMP003",
    message: "Our team has been dispatched to fix the water pipe. Expected completion today.",
    createdBy: "auth_003",
    createdByName: "Mr. Ruwan Wijesinghe",
    createdAt: "2024-02-13T14:30:00Z",
    isFromCitizen: false
  },
  {
    id: "res_002",
    complaintId: "CMP003",
    message: "Thank you for the quick response. Water supply is back now.",
    createdBy: "cit_003",
    createdByName: "Kamal Perera",
    createdAt: "2024-02-13T16:30:00Z",
    isFromCitizen: true
  }
];

// Mock audit trail
export const mockAuditTrail = [
  {
    id: "audit_001",
    complaintId: "CMP002",
    action: "STATUS_CHANGED",
    performedBy: "auth_002",
    performedByName: "Ms. Nadeeka Silva",
    timestamp: "2024-02-14T09:00:00Z",
    details: { oldStatus: "pending", newStatus: "in-progress" }
  }
];