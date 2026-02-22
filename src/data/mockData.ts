// This is fake data that mimics what you'll get from the backend later

// Mock user (logged-in authority)
export const mockCurrentUser = {
  id: "auth_001",
  name: "Mr. Kamal Perera",
  email: "kamal@gov.lk",
  userType: "authority",
  department: "Municipal Council",
  jurisdiction: "Colombo North",
  role: "officer",
  token: "fake-jwt-token"
};

// Mock complaints list
export const mockComplaints = [
  {
    id: "CMP001",
    title: "Illegal garbage dumping in public area",
    description: "There is a large pile of garbage dumped near the bus stop. It's been there for 3 days causing bad smell.",
    category: "Environmental",
    subCategory: "Waste Management",
    status: "pending",
    priority: "high",
    createdAt: "2024-02-15T09:30:00Z",
    updatedAt: "2024-02-15T09:30:00Z",
    citizenId: "cit_001",
    citizenName: "Nimal Silva",
    citizenContact: "0771234567",
    assignedTo: null,
    assignedToName: null,
    departmentId: "dept_001",
    jurisdiction: "Colombo North",
    location: "Main Street, Colombo",
    attachments: [
      {
        id: "att_001",
        fileName: "garbage_photo.jpg",
        fileUrl: "/mock-images/garbage.jpg",
        uploadedAt: "2024-02-15T09:30:00Z"
      }
    ]
  },
  {
    id: "CMP002",
    title: "Street light not working for 2 weeks",
    description: "The street light in front of house no. 123 has been broken for 2 weeks. Area is dark at night.",
    category: "Infrastructure",
    subCategory: "Street Lighting",
    status: "assigned",
    priority: "medium",
    createdAt: "2024-02-14T14:20:00Z",
    updatedAt: "2024-02-15T10:00:00Z",
    citizenId: "cit_002",
    citizenName: "Sunil Fernando",
    citizenContact: "0789876543",
    assignedTo: "auth_001",
    assignedToName: "Mr. Kamal Perera",
    departmentId: "dept_001",
    jurisdiction: "Colombo North",
    location: "123, Temple Road, Colombo",
    attachments: []
  },
  {
    id: "CMP003",
    title: "Corruption at land registry office",
    description: "Officer asking for bribe to process my land deed. I have recording as evidence.",
    category: "Corruption",
    subCategory: "Bribery",
    status: "in-progress",
    priority: "urgent",
    createdAt: "2024-02-13T11:00:00Z",
    updatedAt: "2024-02-16T09:15:00Z",
    citizenId: "cit_003",
    citizenName: "Priyani Jayawardena",
    citizenContact: "0715556667",
    assignedTo: "auth_001",
    assignedToName: "Mr. Kamal Perera",
    departmentId: "dept_002",
    jurisdiction: "Colombo North",
    location: "Land Registry, Colombo",
    attachments: [
      {
        id: "att_002",
        fileName: "recording.mp3",
        fileUrl: "/mock-images/recording.mp3",
        uploadedAt: "2024-02-13T11:00:00Z"
      }
    ]
  },
  {
    id: "CMP004",
    title: "Water leakage from main pipe",
    description: "Water pipe burst near the junction. Water wastage for 2 days.",
    category: "Utilities",
    subCategory: "Water Supply",
    status: "resolved",
    priority: "high",
    createdAt: "2024-02-10T08:00:00Z",
    updatedAt: "2024-02-15T16:30:00Z",
    citizenId: "cit_004",
    citizenName: "Mohamed Rizvi",
    citizenContact: "0763334445",
    assignedTo: "auth_005",
    assignedToName: "Mr. Pathirana",
    departmentId: "dept_003",
    jurisdiction: "Colombo North",
    location: "Kandy Road, Colombo",
    attachments: []
  }
];

// Mock internal notes
export const mockInternalNotes = [
  {
    id: "note_001",
    complaintId: "CMP003",
    note: "This is a serious corruption case. Need to handle carefully. Contacted ACU.",
    createdBy: "auth_001",
    createdByName: "Mr. Kamal Perera",
    createdAt: "2024-02-14T10:30:00Z",
    isPrivate: true
  },
  {
    id: "note_002",
    complaintId: "CMP003",
    note: "Requested additional evidence from citizen. Waiting for response.",
    createdBy: "auth_001",
    createdByName: "Mr. Kamal Perera",
    createdAt: "2024-02-15T14:20:00Z",
    isPrivate: true
  },
  {
    id: "note_003",
    complaintId: "CMP002",
    note: "Contacted electricity board. They will send a team tomorrow.",
    createdBy: "auth_001",
    createdByName: "Mr. Kamal Perera",
    createdAt: "2024-02-15T09:00:00Z",
    isPrivate: false
  }
];

// Mock responses (communication with citizen)
export const mockResponses = [
  {
    id: "res_001",
    complaintId: "CMP002",
    message: "We have informed the electricity board. They will fix it within 2 days. Thank you for your patience.",
    createdBy: "auth_001",
    createdByName: "Mr. Kamal Perera",
    createdAt: "2024-02-15T10:00:00Z",
    isFromCitizen: false
  },
  {
    id: "res_002",
    complaintId: "CMP002",
    message: "Thank you for the quick response. I appreciate your help.",
    createdBy: "cit_002",
    createdByName: "Sunil Fernando",
    createdAt: "2024-02-15T11:30:00Z",
    isFromCitizen: true
  },
  {
    id: "res_003",
    complaintId: "CMP003",
    message: "We take corruption cases very seriously. Can you provide more details about the officer?",
    createdBy: "auth_001",
    createdByName: "Mr. Kamal Perera",
    createdAt: "2024-02-14T10:30:00Z",
    isFromCitizen: false
  }
];

// Mock audit trail
export const mockAuditTrail = [
  {
    id: "audit_001",
    complaintId: "CMP003",
    action: "STATUS_CHANGED",
    performedBy: "auth_001",
    performedByName: "Mr. Kamal Perera",
    timestamp: "2024-02-14T09:00:00Z",
    details: { oldStatus: "pending", newStatus: "assigned" }
  },
  {
    id: "audit_002",
    complaintId: "CMP003",
    action: "ASSIGNED",
    performedBy: "auth_001",
    performedByName: "Mr. Kamal Perera",
    timestamp: "2024-02-14T09:00:00Z",
    details: { assignedTo: "auth_001" }
  },
  {
    id: "audit_003",
    complaintId: "CMP003",
    action: "NOTE_ADDED",
    performedBy: "auth_001",
    performedByName: "Mr. Kamal Perera",
    timestamp: "2024-02-14T10:30:00Z",
    details: { noteId: "note_001" }
  }
];

// Mock officers list (for assignment)
export const mockOfficers = [
  { id: "auth_001", name: "Mr. Kamal Perera", role: "Senior Officer", department: "Municipal Council" },
  { id: "auth_002", name: "Ms. Nadeeka Silva", role: "Investigator", department: "Municipal Council" },
  { id: "auth_003", name: "Mr. Ruwan Wijesinghe", role: "Field Officer", department: "Municipal Council" },
  { id: "auth_004", name: "Ms. Malini Perera", role: "Complaint Officer", department: "Municipal Council" },
];