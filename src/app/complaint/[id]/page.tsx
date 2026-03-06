'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  mockComplaints, 
  mockInternalNotes, 
  mockResponses, 
  mockAuditTrail,
  governmentDepartments
} from '@/data/mockData';

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    const complaintId = params.id;
    const found = mockComplaints.find(c => c.id === complaintId);
    if (found) {
      setComplaint(found);
      setSelectedDepartment(found.department || '');
    }
    setInternalNotes(mockInternalNotes.filter(n => n.complaintId === complaintId));
    setResponses(mockResponses.filter(r => r.complaintId === complaintId));
    setAuditTrail(mockAuditTrail.filter(a => a.complaintId === complaintId));
  }, [params.id]);

  const handleUpdateStatus = () => {
    if (!newStatus) return;
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
    setMessage('Status updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
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
    if (!newResponse.trim()) return;
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

  const handleForwardDepartment = () => {
    if (!selectedDepartment) return;
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
    setComplaint({ ...complaint, department: selectedDepartment });
    setShowForwardModal(false);
    setMessage(`Complaint forwarded to ${selectedDepartment}`);
    setTimeout(() => setMessage(''), 3000);
  };

  if (!complaint || !user) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)), url("/sl-admin-bg.jpg")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    }}>
      {/* Sidebar - Same as Dashboard */}
      <div style={{ width: '260px', backgroundColor: '#8d153a', color: 'white', padding: '25px 0', position: 'fixed', height: '100vh', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '0 25px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '22px', margin: 0, color: '#ffbe29' }}>GovConnect</h2>
          <p style={{ fontSize: '12px', margin: '5px 0 0', opacity: 0.8, color: '#eb7400', fontWeight: 'bold' }}>AUTHORITY PORTAL</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <div onClick={() => router.push('/dashboard')} style={{ padding: '12px 25px', cursor: 'pointer', transition: '0.2s' }}>
            Dashboard Overview
          </div>
          <div style={{ padding: '12px 25px', backgroundColor: '#00534e', borderLeft: '4px solid #ffbe29', cursor: 'pointer' }}>
            Case Investigation
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '20px', width: '260px', padding: '0 25px' }}>
          <button 
            onClick={() => { localStorage.removeItem('user'); router.push('/login'); }}
            style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <button 
              onClick={() => router.push('/dashboard')}
              style={{ background: 'none', border: 'none', color: '#8d153a', fontWeight: '700', cursor: 'pointer', marginBottom: '10px', padding: 0 }}
            >
              ← BACK TO CASE LIST
            </button>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#8d153a', fontWeight: '800' }}>CASE ID: {complaint.id}</h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ 
              backgroundColor: complaint.status === 'pending' ? '#eb740015' : complaint.status === 'resolved' ? '#4caf50' : '#00534e',
              color: complaint.status === 'resolved' ? 'white' : complaint.status === 'pending' ? '#eb7400' : 'white',
              padding: '8px 20px',
              borderRadius: '8px',
              fontWeight: '800',
              fontSize: '14px',
              textTransform: 'uppercase'
            }}>
              {complaint.status}
            </span>
          </div>
        </header>

        {message && (
          <div style={{ backgroundColor: '#00534e', color: 'white', padding: '15px 25px', borderRadius: '12px', marginBottom: '25px', fontWeight: '600', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            ✓ {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px' }}>
          {/* Main Content */}
          <div>
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #ffbe29', marginBottom: '30px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#8d153a', fontSize: '16px', fontWeight: '800', borderBottom: '2px solid #fdf4f6', paddingBottom: '10px' }}>
                COMPLAINT DESCRIPTION
              </h3>
              <p style={{ lineHeight: '1.8', color: '#1e293b', fontSize: '16px', margin: 0 }}>{complaint.description}</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #00534e', marginBottom: '30px' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#00534e', fontSize: '16px', fontWeight: '800', borderBottom: '2px solid #f0f8f7', paddingBottom: '10px' }}>
                LOGISTICS & LOCATION
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800' }}>PROVINCE</div>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>Western Province</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800' }}>DISTRICT</div>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>Colombo District</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '800' }}>DIVISION</div>
                  <div style={{ fontWeight: '700', color: '#1e293b' }}>Kaduwela - 122C</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #eb7400' }}>
              <div style={{ display: 'flex', borderBottom: '2px solid #f1f5f9' }}>
                <button 
                  onClick={() => setActiveTab('notes')}
                  style={{ padding: '15px 25px', cursor: 'pointer', background: 'none', border: 'none', borderBottom: activeTab === 'notes' ? '3px solid #8d153a' : 'none', color: activeTab === 'notes' ? '#8d153a' : '#64748b', fontWeight: '800', fontSize: '14px' }}
                >
                  INTERNAL NOTES ({internalNotes.length})
                </button>
                <button 
                  onClick={() => setActiveTab('responses')}
                  style={{ padding: '15px 25px', cursor: 'pointer', background: 'none', border: 'none', borderBottom: activeTab === 'responses' ? '3px solid #8d153a' : 'none', color: activeTab === 'responses' ? '#8d153a' : '#64748b', fontWeight: '800', fontSize: '14px' }}
                >
                  CITIZEN RESPONSES ({responses.length})
                </button>
                <button 
                  onClick={() => setActiveTab('audit')}
                  style={{ padding: '15px 25px', cursor: 'pointer', background: 'none', border: 'none', borderBottom: activeTab === 'audit' ? '3px solid #8d153a' : 'none', color: activeTab === 'audit' ? '#8d153a' : '#64748b', fontWeight: '800', fontSize: '14px' }}
                >
                  AUDIT LOG
                </button>
              </div>

              <div style={{ paddingTop: '20px' }}>
                {activeTab === 'notes' && (
                  <div>
                    <button onClick={() => setShowNoteModal(true)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '2px dashed #8d153a', background: '#fdf4f6', color: '#8d153a', fontWeight: '700', cursor: 'pointer' }}>
                      + APPEND NEW CASE NOTE
                    </button>
                    {internalNotes.map(note => (
                      <div key={note.id} style={{ padding: '18px', backgroundColor: '#f8fafc', borderRadius: '12px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '800', fontSize: '13px', color: '#8d153a' }}>{note.createdByName}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{note.note}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'responses' && (
                  <div>
                    <button onClick={() => setShowResponseModal(true)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '2px dashed #00534e', background: '#f0f8f7', color: '#00534e', fontWeight: '700', cursor: 'pointer' }}>
                      + SEND RESPONSE TO CITIZEN
                    </button>
                    {responses.map(res => (
                      <div key={res.id} style={{ padding: '18px', backgroundColor: res.isFromCitizen ? '#fff' : '#f0f8f7', borderRadius: '12px', marginBottom: '12px', border: res.isFromCitizen ? '1px solid #e2e8f0' : '1px solid #00534e30' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '800', fontSize: '13px', color: res.isFromCitizen ? '#eb7400' : '#00534e' }}>{res.isFromCitizen ? '👤 CITIZEN' : '👮 OFFICIAL RESPONSE'}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(res.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{res.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div>
                    {auditTrail.map(entry => (
                      <div key={entry.id} style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ minWidth: '80px', fontSize: '11px', color: '#94a3b8', fontWeight: '700', paddingTop: '4px' }}>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div style={{ flex: 1, padding: '10px 15px', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #8d153a' }}>
                          <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{entry.action.replace('_', ' ')}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>BY: {entry.performedByName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <div style={{ backgroundColor: '#8d153a', padding: '25px', borderRadius: '16px', color: 'white', marginBottom: '25px', boxShadow: '0 8px 16px rgba(141, 21, 58, 0.2)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', letterSpacing: '1px', opacity: 0.8 }}>CASE STATUS CONTROL</h4>
              <button 
                onClick={() => setShowStatusModal(true)}
                style={{ width: '100%', padding: '12px', backgroundColor: 'white', color: '#8d153a', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', marginBottom: '12px' }}
              >
                UPDATE CURRENT STATUS
              </button>
              <button 
                onClick={() => { setShowStatusModal(true); setNewStatus('resolved'); }}
                style={{ width: '100%', padding: '12px', backgroundColor: '#ffbe29', color: '#8d153a', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
              >
                RESOLVE & CLOSE CASE
              </button>
            </div>

            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', border: '1px solid #eb7400', marginBottom: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <h4 style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '13px', fontWeight: '800' }}>CASE TRANSFERS</h4>
              <button 
                onClick={() => setShowForwardModal(true)}
                style={{ width: '100%', padding: '12px', backgroundColor: '#eb7400', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
              >
                FORWARD TO DEPT
              </button>
            </div>

            <div style={{ backgroundColor: '#00534e', padding: '25px', borderRadius: '16px', color: 'white', boxShadow: '0 8px 16px rgba(0, 83, 78, 0.2)' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', letterSpacing: '1px', opacity: 0.8 }}>INFORMATION REQUEST</h4>
              <p style={{ fontSize: '12px', marginBottom: '15px', lineHeight: '1.5' }}>Send a formal request for more evidence or clarification from the citizen.</p>
              <button 
                onClick={() => { setShowResponseModal(true); setNewResponse('We need more information regarding your complaint...'); }}
                style={{ width: '100%', padding: '12px', backgroundColor: 'white', color: '#00534e', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
              >
                REQUEST MORE INFO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Modal Styling */}
      {(showStatusModal || showNoteModal || showResponseModal || showForwardModal) && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '16px', width: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', borderTop: '8px solid #8d153a' }}>
            {showStatusModal && (
              <>
                <h2 style={{ color: '#8d153a', marginBottom: '20px' }}>UPDATE STATUS</h2>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
                  <option value="">Select Target Status...</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowStatusModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>CANCEL</button>
                  <button onClick={handleUpdateStatus} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#8d153a', color: 'white', fontWeight: '700' }}>UPDATE</button>
                </div>
              </>
            )}
            {showForwardModal && (
              <>
                <h2 style={{ color: '#8d153a', marginBottom: '20px' }}>FORWARD CASE</h2>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
                  <option value="">Select Destination Ministry...</option>
                  {governmentDepartments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowForwardModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>CANCEL</button>
                  <button onClick={handleForwardDepartment} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#8d153a', color: 'white', fontWeight: '700' }}>TRANSFER</button>
                </div>
              </>
            )}
            {showNoteModal && (
              <>
                <h2 style={{ color: '#8d153a', marginBottom: '20px' }}>ADD CASE NOTE</h2>
                <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '120px', marginBottom: '20px' }} placeholder="Enter internal note details..." />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowNoteModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>CANCEL</button>
                  <button onClick={handleAddNote} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#8d153a', color: 'white', fontWeight: '700' }}>SAVE NOTE</button>
                </div>
              </>
            )}
            {showResponseModal && (
              <>
                <h2 style={{ color: '#00534e', marginBottom: '20px' }}>SEND RESPONSE</h2>
                <textarea value={newResponse} onChange={(e) => setNewResponse(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', height: '120px', marginBottom: '20px' }} placeholder="Message to citizen..." />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowResponseModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>CANCEL</button>
                  <button onClick={handleAddResponse} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#00534e', color: 'white', fontWeight: '700' }}>SEND MESSAGE</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}