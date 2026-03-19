'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './complaint-detail.module.css';

interface Complaint {
  id: string;
  referenceNumber: string;
  title: string;
  description: string;
  status: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  citizenId: string;
  category: string;
  priority: string;
  createdDate: string;
  department: string;
  location: string;
  latitude: number;
  longitude: number;
  aiVerified: boolean;
  verificationScore: number;
  verificationNotes: string;
  duplicity: string;
  urgency: string;
  impact: string;
  sentiment: string;
  assignedOfficer?: string;
}

export default function ComplaintDetailPage() {
  const params = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'communication' | 'routing' | 'history'>('details');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    // Mock complaint data based on ID
    const mockComplaint: Complaint = {
      id: params.id as string,
      referenceNumber: 'GRV-8821',
      title: 'Water Supply Contamination',
      description: 'The water coming from the main line smells of chemical smell and dark tint since morning...',
      status: 'OPEN',
      citizenName: 'Rajesh Kumar',
      citizenEmail: 'rkumar92@email.com',
      citizenPhone: '+91 98XXXXXXXX',
      citizenId: 'Verified Citizen ID: B8291-XX',
      category: 'Water Supply',
      priority: 'HIGH PRIORITY',
      createdDate: 'Oct 24, 2023',
      department: 'Water Works Dept (DS)',
      location: 'Block C, Sector 4, Rohini Residential Complex',
      latitude: 28.7408,
      longitude: 77.1605,
      aiVerified: true,
      verificationScore: 94,
      verificationNotes:
        'AI has confirmed the complaint pattern aligns with current maintenance logs in Sector 4. Citizen-uploaded photos show evidence of rust-colored water, consistent with old piping corrosion.',
      duplicity: 'Unique (0)',
      urgency: 'Critical',
      impact: 'Community (50+)',
      sentiment: 'Frustrated',
      assignedOfficer: 'Water Works - District Surveyor (Current)',
    };
    setComplaint(mockComplaint);
    setPriority('HIGH');
  }, [params.id]);

  if (!complaint) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1>{complaint.title}</h1>
            <p className={styles.status} data-status={complaint.status}>
              {complaint.status}
            </p>
          </div>
          <button className={styles.resolveBtn}>✓ Mark as Resolved</button>
        </div>
        <div className={styles.headerInfo}>
          <p>Submitted on {complaint.createdDate} • Assigned to {complaint.department}</p>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Column */}
        <div className={styles.leftColumn}>
          {/* Citizen Details */}
          <section className={styles.section}>
            <h3>CITIZEN DETAILS</h3>
            <div className={styles.citizenInfo}>
              <div className={styles.infoRow}>
                <span className={styles.icon}>👤</span>
                <span className={styles.label}>{complaint.citizenName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.icon}>✓</span>
                <span className={styles.label}>{complaint.citizenId}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.icon}>✉️</span>
                <span className={styles.label}>{complaint.citizenEmail}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.icon}>📱</span>
                <span className={styles.label}>{complaint.citizenPhone}</span>
              </div>
            </div>
          </section>

          {/* Incident Location */}
          <section className={styles.section}>
            <h3>INCIDENT LOCATION</h3>
            <div className={styles.location}>
              <div className={styles.map}>
                📍 {complaint.location}
              </div>
              <p>{complaint.location}</p>
              <p className={styles.landmark}>Landmark: Near Community Center</p>
            </div>
          </section>

          {/* AI Verification */}
          <section className={styles.section}>
            <h3>AI VERIFICATION SUMMARY</h3>
            <div className={styles.aiVerificationBox}>
              <div className={styles.verificationHeader}>
                <span className={styles.aiIcon}>✓</span>
                <span className={styles.aiLabel}>AI Verification Summary</span>
              </div>
              <div className={styles.confidenceScore}>
                CONFIDENCE SCORE: <strong>{complaint.verificationScore}%</strong>
              </div>
              <p>{complaint.verificationNotes}</p>
              <div className={styles.verificationGrid}>
                <div className={styles.verificationItem}>
                  <div className={styles.label}>DUPLICITY</div>
                  <div className={styles.value}>{complaint.duplicity}</div>
                </div>
                <div className={styles.verificationItem}>
                  <div className={styles.label}>URGENCY</div>
                  <div className={styles.value} style={{ color: '#dc3545' }}>
                    {complaint.urgency}
                  </div>
                </div>
                <div className={styles.verificationItem}>
                  <div className={styles.label}>IMPACT</div>
                  <div className={styles.value} style={{ color: '#ff6b35' }}>
                    {complaint.impact}
                  </div>
                </div>
                <div className={styles.verificationItem}>
                  <div className={styles.label}>SENTIMENT</div>
                  <div className={styles.value}>{complaint.sentiment}</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className={styles.rightColumn}>
          {/* Routing & Escalation */}
          <section className={styles.section}>
            <h3>ROUTING & ESCALATION</h3>
            <div className={styles.routingForm}>
              <div className={styles.formGroup}>
                <label>CHANGE DEPARTMENT / OFFICIAL</label>
                <select defaultValue={complaint.department}>
                  <option>Water Works - District Surveyor (Current)</option>
                  <option>Health Department</option>
                  <option>Municipal Council</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>PRIORITY LEVEL OVERRIDE</label>
                <div className={styles.priorityButtons}>
                  <button className={priority === 'LOW' ? styles.active : ''}>LOW</button>
                  <button className={priority === 'MEDIUM' ? styles.active : ''}>MEDIUM</button>
                  <button className={`${styles.active}`}>HIGH</button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>ADD INTERNAL NOTE FOR THE NEXT OFFICIAL:</label>
                <textarea placeholder="Add internal note for the next official..." />
              </div>
            </div>

            {/* Response Options */}
            <div className={styles.responseOptions}>
              <button className={styles.responseBtnPrimary}>Send Response to Citizen</button>
              <button className={styles.responseBtnSecondary}>Forward to Dept</button>
            </div>
          </section>

          {/* Complaint Overview */}
          <section className={styles.section}>
            <h3>COMPLAINT OVERVIEW</h3>
            <div className={styles.overviewTag}>
              <span className={styles.tagLabel}>COMPLAINT ID</span>
              <span className={styles.tagValue}>#{complaint.referenceNumber}-2024</span>
            </div>
            <div className={styles.overviewTag}>
              <span className={styles.tagLabel}>CURRENT STATUS</span>
              <span className={styles.tagValue} style={{ background: '#fff3cd' }}>
                Verification Pending
              </span>
            </div>
            <div className={styles.overviewTag}>
              <span className={styles.tagLabel}>CATEGORY</span>
              <span className={styles.tagValue}>{complaint.category}</span>
            </div>
            <div className={styles.overviewTag}>
              <span className={styles.tagLabel}>PRIORITY</span>
              <span className={styles.tagValue} style={{ background: '#f8d7da' }}>
                {complaint.priority}
              </span>
            </div>
            <div className={styles.overviewTag}>
              <span className={styles.tagLabel}>TIMELINE</span>
              <div className={styles.timelineItems}>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineMarker}>●</span> Assigned to Officer
                </div>
                <div className={styles.timelineItem}>
                  <span className={styles.timelineMarker}>○</span> Complaint Lodged
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
