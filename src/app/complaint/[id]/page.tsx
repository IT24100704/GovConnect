'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  mockComplaints, 
  mockInternalNotes, 
  mockResponses, 
  mockAuditTrail 
} from '@/data/mockData';

// Government Departments List (from your image)
const governmentDepartments = [
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

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [complaint, setComplaint] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('notes');
  const [internalNotes, setInternalNotes] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(true);
  const [newResponse, setNewResponse] = useState('');
  const [message, setMessage] = useState('');

  // Check authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  // Load complaint data
  useEffect(() => {
    const complaintId = params.id;
    const found = mockComplaints.find(c => c.id === complaintId);
    if (found) {
      setComplaint(found);
      setSelectedDepartment(found.department || '');
    }

    // Load related data
    setInternalNotes(mockInternalNotes.filter(n => n.complaintId === complaintId));
    setResponses(mockResponses.filter(r => r.complaintId === complaintId));
    setAuditTrail(mockAuditTrail.filter(a => a.complaintId === complaintId));
  }, [params.id]);

  // Handle update status
  const handleUpdateStatus = () => {
    if (!newStatus) {
      setMessage('Please select a status');
      return;
    }

    // Create audit entry
    const newAudit = {
      id: `audit_${Date.now()}`,
      complaintId: complaint.id,
      action: 'STATUS_CHANGED',
      performedBy: user?.id,
      performedByName: user?.name,
      timestamp: new Date().toISOString(),
      details: { oldStatus: complaint.status, newStatus, reason: statusReason }
    };

    setAuditTrail([newAudit, ...auditTrail]);
    setComplaint({ ...complaint, status: newStatus });
    setShowStatusModal(false);
    setNewStatus('');
    setStatusReason('');
    setMessage('Status updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Handle add note
  const handleAddNote = () => {
    if (!newNote.trim()) {
      setMessage('Please enter a note');
      return;
    }

    const note = {
      id: `note_${Date.now()}`,
      complaintId: complaint.id,
      note: newNote,
      createdBy: user?.id,
      createdByName: user?.name,
      createdAt: new Date().toISOString(),
      isPrivate: isPrivateNote
    };

    setInternalNotes([note, ...internalNotes]);
    setShowNoteModal(false);
    setNewNote('');
    setMessage('Note added successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Handle add response
  const handleAddResponse = () => {
    if (!newResponse.trim()) {
      setMessage('Please enter a response');
      return;
    }

    const response = {
      id: `res_${Date.now()}`,
      complaintId: complaint.id,
      message: newResponse,
      createdBy: user?.id,
      createdByName: user?.name,
      createdAt: new Date().toISOString(),
      isFromCitizen: false
    };

    setResponses([response, ...responses]);
    setShowResponseModal(false);
    setNewResponse('');
    setMessage('Response sent to citizen!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Handle forward to another department
  const handleForwardDepartment = () => {
    if (!selectedDepartment) {
      setMessage('Please select a department');
      return;
    }

    // Create audit entry for forwarding
    const newAudit = {
      id: `audit_${Date.now()}`,
      complaintId: complaint.id,
      action: 'FORWARDED',
      performedBy: user?.id,
      performedByName: user?.name,
      timestamp: new Date().toISOString(),
      details: { fromDepartment: complaint.department, toDepartment: selectedDepartment }
    };

    setAuditTrail([newAudit, ...auditTrail]);
    setComplaint({ ...complaint, department: selectedDepartment, departmentId: `dept_${selectedDepartment.substring(0, 3)}` });
    setShowForwardModal(false);
    setMessage(`Complaint forwarded to ${selectedDepartment}`);
    setTimeout(() => setMessage(''), 3000);
  };

  // Handle request more info
  const handleRequestInfo = () => {
    setShowResponseModal(true);
    setNewResponse('We need more information to process this complaint. Please provide additional details.');
  };

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      'pending': 'badge-pending',
      'assigned': 'badge-assigned',
      'in-progress': 'badge-in-progress',
      'resolved': 'badge-resolved',
      'rejected': 'badge-rejected'
    };
    return `badge ${classes[status as keyof typeof classes] || ''}`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': '#ff9800',
      'assigned': '#2196f3',
      'in-progress': '#9c27b0',
      'resolved': '#4caf50',
      'rejected': '#f44336'
    };
    return colors[status as keyof typeof colors] || '#666';
  };

  if (!complaint || !user) {
    return <div className="container">Loading...</div>;
  }

  // Format date like "Oct 24, 2023 • 09:42 AM"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' • ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Simple Header */}
      <div style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, color: '#1976d2', fontSize: '20px' }}>GovConnect</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#555' }}>{user.name} | {user.department}</span>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Message display */}
        {message && (
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            color: '#2e7d32', 
            padding: '12px 20px',
            borderRadius: '4px',
            marginBottom: '20px',
            border: '1px solid #c8e6c9'
          }}>
            {message}
          </div>
        )}

        {/* Case ID and Date */}
        <div style={{ marginBottom: '25px' }}>
          <h1 style={{ fontSize: '28px', margin: '0 0 5px 0', color: '#333' }}>
            CASE ID: {complaint.id}
          </h1>
          <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>
            Filed: {formatDate(complaint.createdAt)}
          </p>
        </div>

        {/* Main Content Grid - 2 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '25px' }}>
          {/* Left Column - Main Content */}
          <div>
            {/* Complaint Description Card */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '25px',
              marginBottom: '25px'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                margin: '0 0 15px 0', 
                color: '#555',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px'
              }}>
                COMPLAINT DESCRIPTION
              </h2>
              <p style={{ lineHeight: '1.6', color: '#333', margin: 0 }}>
                {complaint.description}
              </p>
            </div>

            {/* Location Hierarchy Card */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '25px',
              marginBottom: '25px'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                margin: '0 0 15px 0', 
                color: '#555',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px'
              }}>
                LOCATION HIERARCHY
              </h2>
              <div style={{ marginLeft: '10px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>PROVINCE</div>
                  <div style={{ color: '#333' }}>Western Province</div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>DISTRICT</div>
                  <div style={{ color: '#333' }}>Colombo District</div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: 'bold', color: '#666', marginBottom: '5px' }}>DIVISION</div>
                  <div style={{ color: '#333' }}>Kaduwela - 122C</div>
                </div>
              </div>
            </div>

            {/* Targeted Authority Card */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '25px'
            }}>
              <h2 style={{ 
                fontSize: '18px', 
                margin: '0 0 15px 0', 
                color: '#555',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px'
              }}>
                TARGETED AUTHORITY
              </h2>
              <div style={{ fontSize: '16px', color: '#333' }}>
                <span style={{ fontWeight: 'bold' }}>Director S. Kumara</span>
                <br />
                <span style={{ color: '#666' }}>Municipal Waste Management Dept.</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Status Card */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#555' }}>CASE STATUS</h3>
              <div style={{ 
                backgroundColor: getStatusColor(complaint.status),
                color: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '14px',
                textAlign: 'center',
                marginBottom: '15px'
              }}>
                {complaint.status}
              </div>
              <button
                onClick={() => setShowStatusModal(true)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                UPDATE STATUS
              </button>
            </div>

            {/* Evidence Vault Card */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#555' }}>EVIDENCE VAULT</h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowForwardModal(true)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#333'
                  }}
                >
                  FORWARD
                </button>
                <button
                  onClick={handleRequestInfo}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    color: '#333'
                  }}
                >
                  REQUEST INFO
                </button>
              </div>
            </div>

            {/* Resolve & Close Card */}
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <button
                onClick={() => {
                  setNewStatus('resolved');
                  setShowStatusModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                RESOLVE & CLOSE CASE
              </button>
            </div>

            {/* Tabs for Notes and Responses */}
            <div style={{ marginTop: '25px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
                <button
                  style={{
                    padding: '10px 15px',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === 'notes' ? '2px solid #1976d2' : 'none',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'notes' ? 'bold' : 'normal'
                  }}
                  onClick={() => setActiveTab('notes')}
                >
                  Internal Notes ({internalNotes.length})
                </button>
                <button
                  style={{
                    padding: '10px 15px',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === 'responses' ? '2px solid #1976d2' : 'none',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'responses' ? 'bold' : 'normal'
                  }}
                  onClick={() => setActiveTab('responses')}
                >
                  Responses ({responses.length})
                </button>
                <button
                  style={{
                    padding: '10px 15px',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeTab === 'audit' ? '2px solid #1976d2' : 'none',
                    cursor: 'pointer',
                    fontWeight: activeTab === 'audit' ? 'bold' : 'normal'
                  }}
                  onClick={() => setActiveTab('audit')}
                >
                  Audit Trail
                </button>
              </div>

              <div style={{ marginTop: '15px' }}>
                {/* Notes Tab */}
                {activeTab === 'notes' && (
                  <div>
                    <button 
                      onClick={() => setShowNoteModal(true)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '15px'
                      }}
                    >
                      + Add Note
                    </button>
                    
                    {internalNotes.length === 0 ? (
                      <p style={{ color: '#666' }}>No internal notes yet.</p>
                    ) : (
                      internalNotes.map(note => (
                        <div key={note.id} style={{ 
                          padding: '12px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '4px',
                          marginBottom: '10px',
                          border: '1px solid #eee'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong>{note.createdByName}</strong>
                            <small style={{ color: '#888' }}>{new Date(note.createdAt).toLocaleString()}</small>
                          </div>
                          <p style={{ margin: 0 }}>{note.note}</p>
                          {note.isPrivate && (
                            <span style={{ 
                              backgroundColor: '#ffd700', 
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              marginTop: '8px',
                              display: 'inline-block'
                            }}>
                              🔒 Private
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Responses Tab */}
                {activeTab === 'responses' && (
                  <div>
                    <button 
                      onClick={() => setShowResponseModal(true)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '15px'
                      }}
                    >
                      + Respond
                    </button>
                    
                    {responses.length === 0 ? (
                      <p style={{ color: '#666' }}>No responses yet.</p>
                    ) : (
                      responses.map(response => (
                        <div key={response.id} style={{ 
                          padding: '12px',
                          backgroundColor: response.isFromCitizen ? '#f5f5f5' : '#e3f2fd',
                          borderRadius: '4px',
                          marginBottom: '10px',
                          border: response.isFromCitizen ? '1px solid #ddd' : '1px solid #bbdefb'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong>
                              {response.isFromCitizen ? '👤 Citizen' : '👮 ' + response.createdByName}
                            </strong>
                            <small style={{ color: '#888' }}>{new Date(response.createdAt).toLocaleString()}</small>
                          </div>
                          <p style={{ margin: 0 }}>{response.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Audit Trail Tab */}
                {activeTab === 'audit' && (
                  <div>
                    {auditTrail.length === 0 ? (
                      <p style={{ color: '#666' }}>No audit trail entries yet.</p>
                    ) : (
                      auditTrail.map(entry => (
                        <div key={entry.id} style={{ 
                          padding: '12px',
                          backgroundColor: '#f9f9f9',
                          borderRadius: '4px',
                          marginBottom: '10px',
                          border: '1px solid #eee'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <strong>{entry.action}</strong>
                            <small style={{ color: '#888' }}>{new Date(entry.timestamp).toLocaleString()}</small>
                          </div>
                          <p style={{ margin: '0 0 5px 0' }}>By: {entry.performedByName}</p>
                          <pre style={{ 
                            fontSize: '12px', 
                            backgroundColor: '#f0f0f0', 
                            padding: '8px', 
                            borderRadius: '4px',
                            margin: 0,
                            whiteSpace: 'pre-wrap'
                          }}>
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '8px',
            width: '450px',
            maxWidth: '90%'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Update Case Status</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Status</label>
              <select 
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reason (optional)</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '80px'
                }}
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Why are you changing the status?"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowStatusModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateStatus}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forward Modal with Department List */}
      {showForwardModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '8px',
            width: '600px',
            maxWidth: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Forward Case to Department</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>Select Department</label>
              <select
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                size={10}
              >
                {governmentDepartments.map(dept => (
                  <option key={dept} value={dept} style={{ padding: '5px' }}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowForwardModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleForwardDepartment}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Forward Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showNoteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '8px',
            width: '450px',
            maxWidth: '90%'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Add Internal Note</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Note</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '100px'
                }}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={isPrivateNote}
                  onChange={(e) => setIsPrivateNote(e.target.checked)}
                />
                Private note (visible only to authorities)
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowNoteModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddNote}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '25px', 
            borderRadius: '8px',
            width: '450px',
            maxWidth: '90%'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Respond to Citizen</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Your Response</label>
              <textarea
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '120px'
                }}
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Type your response to the citizen..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowResponseModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddResponse}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}