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