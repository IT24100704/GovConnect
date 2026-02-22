'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  mockComplaints, 
  mockInternalNotes, 
  mockResponses, 
  mockAuditTrail,
  mockOfficers 
} from '@/data/mockData';

export default function ComplaintDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [complaint, setComplaint] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [internalNotes, setInternalNotes] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  
  // Modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [assignType, setAssignType] = useState('self');
  const [selectedOfficer, setSelectedOfficer] = useState('');
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
    }

    // Load related data
    setInternalNotes(mockInternalNotes.filter(n => n.complaintId === complaintId));
    setResponses(mockResponses.filter(r => r.complaintId === complaintId));
    setAuditTrail(mockAuditTrail.filter(a => a.complaintId === complaintId));
  }, [params.id]);

  // Action handlers
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

  const handleAssign = () => {
    let assignedTo = '';
    let assignedToName = '';

    if (assignType === 'self') {
      assignedTo = user?.id;
      assignedToName = user?.name;
    } else if (assignType === 'other') {
      if (!selectedOfficer) {
        setMessage('Please select an officer');
        return;
      }
      const officer = mockOfficers.find(o => o.id === selectedOfficer);
      assignedTo = officer?.id ?? '';
      assignedToName = officer?.name ?? '';
    } else if (assignType === 'office') {
      assignedTo = 'office';
      assignedToName = 'Office Pool';
    }

    // Create audit entry
    const newAudit = {
      id: `audit_${Date.now()}`,
      complaintId: complaint.id,
      action: 'ASSIGNED',
      performedBy: user?.id,
      performedByName: user?.name,
      timestamp: new Date().toISOString(),
      details: { assignedTo, assignedToName }
    };

    setAuditTrail([newAudit, ...auditTrail]);
    setComplaint({ ...complaint, assignedTo, assignedToName });
    setShowAssignModal(false);
    setMessage('Complaint assigned successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

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

  if (!complaint || !user) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-brand">GovConnect Authority Portal</div>
        <div className="navbar-user">
          <span>Welcome, {user.name}</span>
          <button onClick={() => router.push('/dashboard')} className="logout-btn">
            Back to Queue
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Message display */}
        {message && (
          <div className="card" style={{ backgroundColor: '#e8f5e8', color: '#2e7d32' }}>
            {message}
          </div>
        )}

        {/* Complaint Header */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2>{complaint.title}</h2>
              <p style={{ color: '#666' }}>
                Complaint ID: {complaint.id} | Submitted: {new Date(complaint.createdAt).toLocaleString()}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <span className={getStatusBadgeClass(complaint.status)}>
                  {complaint.status}
                </span>
                <span className={`badge badge-${complaint.priority}`}>
                  {complaint.priority}
                </span>
                {complaint.assignedToName && (
                  <span className="badge" style={{ backgroundColor: '#e0e0e0', color: '#333' }}>
                    Assigned to: {complaint.assignedToName}
                  </span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAssignModal(true)}
              >
                Assign
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setShowStatusModal(true)}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            <button
              style={{
                padding: '10px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'details' ? '2px solid #1976d2' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              style={{
                padding: '10px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'notes' ? '2px solid #1976d2' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('notes')}
            >
              Internal Notes ({internalNotes.length})
            </button>
            <button
              style={{
                padding: '10px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'responses' ? '2px solid #1976d2' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('responses')}
            >
              Responses ({responses.length})
            </button>
            <button
              style={{
                padding: '10px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === 'audit' ? '2px solid #1976d2' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab('audit')}
            >
              Audit Trail
            </button>
          </div>

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div>
              <div className="form-group">
                <label>Description</label>
                <p>{complaint.description}</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <p>{complaint.category}</p>
                </div>
                <div className="form-group">
                  <label>Sub-Category</label>
                  <p>{complaint.subCategory || 'N/A'}</p>
                </div>
                <div className="form-group">
                  <label>Jurisdiction</label>
                  <p>{complaint.jurisdiction}</p>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <p>{complaint.location}</p>
                </div>
                <div className="form-group">
                  <label>Citizen Name</label>
                  <p>{complaint.citizenName}</p>
                </div>
                <div className="form-group">
                  <label>Contact</label>
                  <p>{complaint.citizenContact}</p>
                </div>
              </div>

              {complaint.attachments.length > 0 && (
                <div className="form-group">
                  <label>Attachments</label>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {complaint.attachments.map((att: any) => (
                      <div key={att.id} className="card" style={{ padding: '10px' }}>
                        📎 {att.fileName}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Internal Notes Tab */}
          {activeTab === 'notes' && (
            <div>
              <button 
                className="btn btn-primary"
                style={{ marginBottom: '20px' }}
                onClick={() => setShowNoteModal(true)}
              >
                + Add Internal Note
              </button>
              
              {internalNotes.map(note => (
                <div key={note.id} className="card" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{note.createdByName}</strong>
                    <small>{new Date(note.createdAt).toLocaleString()}</small>
                  </div>
                  <p style={{ marginTop: '10px' }}>{note.note}</p>
                  {note.isPrivate && (
                    <span className="badge" style={{ backgroundColor: '#ffd700', color: '#333' }}>
                      🔒 Private
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Responses Tab */}
          {activeTab === 'responses' && (
            <div>
              <button 
                className="btn btn-primary"
                style={{ marginBottom: '20px' }}
                onClick={() => setShowResponseModal(true)}
              >
                + Respond to Citizen
              </button>
              
              {responses.map(response => (
                <div key={response.id} className="card" style={{ 
                  marginBottom: '10px',
                  backgroundColor: response.isFromCitizen ? '#f5f5f5' : 'white',
                  border: response.isFromCitizen ? 'none' : '1px solid #1976d2'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>
                      {response.isFromCitizen ? '👤 ' : '👮 '}
                      {response.createdByName}
                    </strong>
                    <small>{new Date(response.createdAt).toLocaleString()}</small>
                  </div>
                  <p style={{ marginTop: '10px' }}>{response.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div>
              {auditTrail.map(entry => (
                <div key={entry.id} className="card" style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{entry.action}</strong>
                    <small>{new Date(entry.timestamp).toLocaleString()}</small>
                  </div>
                  <p>By: {entry.performedByName}</p>
                  <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '10px' }}>
                    {JSON.stringify(entry.details, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
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
          justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '500px' }}>
            <h3>Update Complaint Status</h3>
            
            <div className="form-group">
              <label>New Status</label>
              <select 
                className="form-control"
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

            <div className="form-group">
              <label>Reason (optional)</label>
              <textarea
                className="form-control"
                rows={3}
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Why are you changing the status?"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdateStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '500px' }}>
            <h3>Assign Complaint</h3>
            
            <div className="form-group">
              <label>Assign to:</label>
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name="assignType"
                    value="self"
                    checked={assignType === 'self'}
                    onChange={(e) => setAssignType(e.target.value)}
                  /> Myself
                </label>
                
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name="assignType"
                    value="office"
                    checked={assignType === 'office'}
                    onChange={(e) => setAssignType(e.target.value)}
                  /> Office Pool
                </label>
                
                <label style={{ display: 'block', marginBottom: '10px' }}>
                  <input
                    type="radio"
                    name="assignType"
                    value="other"
                    checked={assignType === 'other'}
                    onChange={(e) => setAssignType(e.target.value)}
                  /> Another Officer
                </label>
              </div>
            </div>

            {assignType === 'other' && (
              <div className="form-group">
                <label>Select Officer</label>
                <select 
                  className="form-control"
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                >
                  <option value="">Select an officer</option>
                  {mockOfficers.map(officer => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} - {officer.role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAssign}
              >
                Assign
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
          justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '500px' }}>
            <h3>Add Internal Note</h3>
            
            <div className="form-group">
              <label>Note</label>
              <textarea
                className="form-control"
                rows={4}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                className="btn btn-secondary"
                onClick={() => setShowNoteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddNote}
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
          justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '500px' }}>
            <h3>Respond to Citizen</h3>
            
            <div className="form-group">
              <label>Your Response</label>
              <textarea
                className="form-control"
                rows={4}
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Type your response to the citizen..."
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowResponseModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAddResponse}
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