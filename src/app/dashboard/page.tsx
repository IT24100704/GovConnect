'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockComplaints } from '@/data/mockData';
import { readDecisionLedger, type DecisionLedgerEntry } from '@/lib/decisionLedger';

export default function AuthorityDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [filteredComplaints, setFilteredComplaints] = useState(mockComplaints);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'assignments', 'resolved'
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [decisionLedger, setDecisionLedger] = useState<DecisionLedgerEntry[]>([]);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
  }, [router]);

  useEffect(() => {
    setDecisionLedger(readDecisionLedger());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter complaints by department, status, and side-tab
  useEffect(() => {
    if (!user) return;
    
    let filtered = complaints.filter(c => c.departmentId === user.departmentId);
    
    // Side tab primary filtering
    if (activeTab === 'assignments') {
      filtered = filtered.filter(c => c.status !== 'resolved' && c.status !== 'rejected');
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(c => c.status === 'resolved');
    }
    
    // Status filter overlay (from dropdown)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const query = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(c =>
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredComplaints(filtered);
  }, [statusFilter, searchTerm, complaints, user, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getSlaHours = (priority: string) => {
    if (priority === 'urgent') return 24;
    if (priority === 'high') return 48;
    return 72;
  };

  const dashboardReferenceTime = new Date('2024-02-18T00:00:00Z').getTime();

  const getElapsedHours = (createdAt: string) => {
    return Math.floor((dashboardReferenceTime - new Date(createdAt).getTime()) / (1000 * 60 * 60));
  };

  const getSlaMeta = (complaint: { priority: string; createdAt: string; status: string }) => {
    const targetHours = getSlaHours(complaint.priority);
    const elapsedHours = getElapsedHours(complaint.createdAt);
    const remainingHours = targetHours - elapsedHours;

    if (complaint.status === 'resolved' || complaint.status === 'rejected') {
      return { label: 'Closed', color: '#4caf50', bg: '#e8f5e9', overdue: false };
    }

    if (remainingHours < 0) {
      const overdueHours = Math.abs(remainingHours);
      return {
        label: `Overdue ${overdueHours >= 24 ? `${Math.floor(overdueHours / 24)}d` : `${overdueHours}h`}`,
        color: '#d32f2f',
        bg: '#ffebee',
        overdue: true,
      };
    }

    return {
      label: `Due in ${remainingHours >= 24 ? `${Math.floor(remainingHours / 24)}d` : `${remainingHours}h`}`,
      color: '#00534e',
      bg: '#e6f4f3',
      overdue: false,
    };
  };

  const getLastUpdateLabel = (createdAt: string) => {
    const elapsedHours = getElapsedHours(createdAt);
    if (elapsedHours < 24) return `${elapsedHours}h ago`;
    return `${Math.floor(elapsedHours / 24)}d ago`;
  };

  if (!user) return <div style={{ padding: '20px' }}>Loading...</div>;

  const departmentDecisionLogs = decisionLedger.filter((entry) => (
    entry.departmentId === user.departmentId || entry.department === user.department
  ));
  const recentDecisions = departmentDecisionLogs.slice(0, 5);
  const approvals = departmentDecisionLogs.filter((entry) => entry.action === 'APPROVE').length;
  const rejections = departmentDecisionLogs.filter((entry) => entry.action === 'REJECT').length;
  const edits = departmentDecisionLogs.filter((entry) => entry.action === 'STATUS_EDIT' || entry.action === 'FIELD_EDIT').length;

  const stats = [
    { label: 'Pending', count: complaints.filter(c => c.departmentId === user.departmentId && c.status === 'pending').length, color: '#eb7400', icon: '⏳' },
    { label: 'In Progress', count: complaints.filter(c => c.departmentId === user.departmentId && c.status === 'in-progress').length, color: '#00534e', icon: '⚙️' },
    { label: 'Resolved', count: complaints.filter(c => c.departmentId === user.departmentId && c.status === 'resolved').length, color: '#4caf50', icon: '✅' },
    { label: 'Total Assigned', count: complaints.filter(c => c.departmentId === user.departmentId).length, color: '#8d153a', icon: '📂' },
  ];

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
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: '#8d153a', color: 'white', padding: '25px 0', position: 'fixed', height: '100vh', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '0 25px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '22px', margin: 0, color: '#ffbe29' }}>GovConnect</h2>
          <p style={{ fontSize: '12px', margin: '5px 0 0', opacity: 0.8, color: '#eb7400', fontWeight: 'bold' }}>AUTHORITY PORTAL</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <div 
            onClick={() => setActiveTab('overview')}
            style={{ 
              padding: '12px 25px', 
              cursor: 'pointer', 
              backgroundColor: activeTab === 'overview' ? '#00534e' : 'transparent',
              borderLeft: activeTab === 'overview' ? '4px solid #ffbe29' : 'none'
            }}
          >
            Dashboard Overview
          </div>
          <div 
            onClick={() => setActiveTab('assignments')}
            style={{ 
              padding: '12px 25px', 
              cursor: 'pointer', 
              transition: '0.2s',
              backgroundColor: activeTab === 'assignments' ? '#00534e' : 'transparent',
              borderLeft: activeTab === 'assignments' ? '4px solid #ffbe29' : 'none'
            }}
            onMouseOver={(e) => activeTab !== 'assignments' && (e.currentTarget.style.backgroundColor = '#00534e50')}
            onMouseOut={(e) => activeTab !== 'assignments' && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            My Assignments
          </div>
          <div 
            onClick={() => setActiveTab('resolved')}
            style={{ 
              padding: '12px 25px', 
              cursor: 'pointer', 
              transition: '0.2s',
              backgroundColor: activeTab === 'resolved' ? '#00534e' : 'transparent',
              borderLeft: activeTab === 'resolved' ? '4px solid #ffbe29' : 'none'
            }}
            onMouseOver={(e) => activeTab !== 'resolved' && (e.currentTarget.style.backgroundColor = '#00534e50')}
            onMouseOut={(e) => activeTab !== 'resolved' && (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Resolved Cases
          </div>
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div style={{ padding: '0 25px 10px', fontSize: '11px', color: '#ffbe29', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
            Tools & Analysis
          </div>
          <a 
            href="/communication-hub"
            style={{ 
              display: 'block',
              padding: '12px 25px', 
              cursor: 'pointer', 
              transition: '0.2s',
              textDecoration: 'none',
              color: 'white',
              fontSize: '14px'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00534e50')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            💬 Communication Hub
          </a>
          <a 
            href="/analytics-dashboard"
            style={{ 
              display: 'block',
              padding: '12px 25px', 
              cursor: 'pointer', 
              transition: '0.2s',
              textDecoration: 'none',
              color: 'white',
              fontSize: '14px'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00534e50')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            📈 Analytics
          </a>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', width: '260px', padding: '0 25px' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#8d153a', fontWeight: '800' }}>
              {activeTab === 'overview' ? 'Officer Dashboard' : 
               activeTab === 'assignments' ? 'Active Case Assignments' : 'Resolved Case Archive'}
            </h1>
            <p style={{ color: '#00534e', margin: '5px 0 0', fontWeight: '600' }}>{user.department} | {user.role}</p>
          </div>
          <div ref={profileMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              style={{
                backgroundColor: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                border: '2px solid #ffbe29',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: '35px', height: '35px', backgroundColor: '#eb7400', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                {user.name.charAt(0)}
              </div>
              <span style={{ fontWeight: '700', color: '#8d153a' }}>{user.name}</span>
            </button>

            {showProfileMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 10px)',
                  width: '280px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #ffbe29',
                  overflow: 'hidden',
                  zIndex: 100,
                }}
              >
                <div style={{ padding: '14px 16px', backgroundColor: '#fdf4f6', borderBottom: '1px solid #fde7ec' }}>
                  <div style={{ color: '#8d153a', fontWeight: '800', fontSize: '14px' }}>{user.name}</div>
                  <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{user.email}</div>
                </div>

                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>DEPARTMENT</div>
                  <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '700', marginTop: '2px' }}>{user.department}</div>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>ROLE</div>
                  <div style={{ fontSize: '13px', color: '#1e293b', fontWeight: '700', marginTop: '2px' }}>{user.role}</div>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#8d153a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '700',
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #ffbe29', padding: '16px 18px', marginBottom: '22px', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by case ID, title, or description..."
              style={{
                flex: '1 1 280px',
                minWidth: '220px',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: '14px',
              }}
            />
            <button
              onClick={() => {
                setStatusFilter('all');
                setSearchTerm('');
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '12px',
              }}
            >
              Clear Filters
            </button>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'In Progress', value: 'in-progress' },
              { label: 'Resolved', value: 'resolved' },
            ].map((chip) => (
              <button
                key={chip.value}
                onClick={() => setStatusFilter(chip.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '999px',
                  border: statusFilter === chip.value ? '1px solid #8d153a' : '1px solid #dbe2ea',
                  backgroundColor: statusFilter === chip.value ? '#fdf4f6' : 'white',
                  color: statusFilter === chip.value ? '#8d153a' : '#475569',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {stats.map((stat, i) => (
            <div 
              key={i} 
              onClick={() => {
                if (stat.label === 'Resolved') setActiveTab('resolved');
                else if (stat.label === 'Total Assigned') setActiveTab('overview');
                else {
                  setActiveTab('assignments');
                  setStatusFilter(stat.label.toLowerCase().replace(' ', '-'));
                }
              }}
              style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: `4px solid ${stat.color}`, cursor: 'pointer', transition: '0.2s' }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ fontSize: '24px', backgroundColor: `${stat.color}15`, padding: '12px', borderRadius: '10px' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600' }}>{stat.label}</p>
                <h3 style={{ margin: '3px 0 0', fontSize: '22px', color: stat.color }}>{stat.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <a 
            href="/communication-hub"
            style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              borderBottom: '4px solid #00bcd4',
              cursor: 'pointer', 
              transition: '0.2s',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,188,212,0.15)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: '24px', backgroundColor: '#00bcd415', padding: '12px', borderRadius: '10px' }}>
              💬
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Communication</p>
              <h3 style={{ margin: '3px 0 0', fontSize: '16px', color: '#00bcd4', fontWeight: '700' }}>Live Chat Hub</h3>
            </div>
          </a>

          <a 
            href="/analytics-dashboard"
            style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '15px', 
              borderBottom: '4px solid #8bc34a',
              cursor: 'pointer', 
              transition: '0.2s',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(139,194,74,0.15)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
            }}
          >
            <div style={{ fontSize: '24px', backgroundColor: '#8bc34a15', padding: '12px', borderRadius: '10px' }}>
              📈
            </div>
            <div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', fontWeight: '600' }}>Insights & Metrics</p>
              <h3 style={{ margin: '3px 0 0', fontSize: '16px', color: '#8bc34a', fontWeight: '700' }}>Analytics Dashboard</h3>
            </div>
          </a>
        </div>

        {/* Complaints Table Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #ffbe29', overflow: 'hidden' }}>
          <div style={{ padding: '20px 25px', borderBottom: '2px solid #ffbe29', backgroundColor: '#fdf4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#8d153a', fontSize: '18px', fontWeight: '800' }}>INCOMING COMPLAINTS</h3>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#8d153a', fontWeight: '700', outline: 'none' }}
            >
              <option value="all">View All Status</option>
              <option value="pending">Pending Only</option>
              <option value="in-progress">Under Investigation</option>
              <option value="resolved">Resolved Cases</option>
            </select>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>CASE DETAILS</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>STATUS</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>PRIORITY</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>SLA</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px' }}>LAST UPDATE</th>
                  <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '700', fontSize: '13px', textAlign: 'center' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                      No complaints found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map(complaint => {
                    const sla = getSlaMeta(complaint);
                    return (
                    <tr key={complaint.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: sla.overdue ? '#fff8f8' : 'white' }}>
                      <td style={{ padding: '18px 25px' }}>
                        <div style={{ fontWeight: '700', color: '#1e293b' }}>{complaint.title}</div>
                        <div style={{ fontSize: '13px', color: '#8d153a', fontWeight: '600' }}>ID: {complaint.id}</div>
                      </td>
                      <td style={{ padding: '18px 25px' }}>
                        <span style={{ 
                          backgroundColor: complaint.status === 'pending' ? '#eb740015' : complaint.status === 'resolved' ? '#4caf5015' : '#00534e15',
                          color: complaint.status === 'pending' ? '#eb7400' : complaint.status === 'resolved' ? '#4caf50' : '#00534e',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '800',
                          textTransform: 'uppercase'
                        }}>
                          {complaint.status}
                        </span>
                      </td>
                      <td style={{ padding: '18px 25px' }}>
                        <span style={{ 
                          color: complaint.priority === 'urgent' ? '#d32f2f' : complaint.priority === 'high' ? '#eb7400' : '#475569',
                          fontWeight: '700',
                          fontSize: '13px'
                        }}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '18px 25px' }}>
                        <span
                          style={{
                            backgroundColor: sla.bg,
                            color: sla.color,
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '800',
                          }}
                        >
                          {sla.label}
                        </span>
                      </td>
                      <td style={{ padding: '18px 25px' }}>
                        <div style={{ color: '#475569', fontWeight: '700', fontSize: '13px' }}>{getLastUpdateLabel(complaint.createdAt)}</div>
                        <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                          Submitted {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td style={{ padding: '18px 25px', textAlign: 'center' }}>
                        <button
                          onClick={() => router.push(`/complaint/${complaint.id}`)}
                          style={{ backgroundColor: '#8d153a', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}
                        >
                          PROCESS CASE
                        </button>
                      </td>
                    </tr>
                  )})
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '28px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #00534e', overflow: 'hidden' }}>
          <div style={{ padding: '20px 25px', borderBottom: '2px solid #d1e9e7', backgroundColor: '#f0f8f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#00534e', fontSize: '18px', fontWeight: '800' }}>DECISION LEDGER</h3>
            <div style={{ color: '#334155', fontWeight: '700', fontSize: '12px' }}>Append-only accountability trail</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>TOTAL DECISIONS</div>
              <div style={{ fontSize: '20px', color: '#0f172a', fontWeight: '800' }}>{departmentDecisionLogs.length}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #d9f2df', backgroundColor: '#f2fbf4' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>APPROVALS</div>
              <div style={{ fontSize: '20px', color: '#166534', fontWeight: '800' }}>{approvals}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ffe5e5', backgroundColor: '#fff7f7' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>REJECTIONS</div>
              <div style={{ fontSize: '20px', color: '#b91c1c', fontWeight: '800' }}>{rejections}</div>
            </div>
            <div style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ffefcf', backgroundColor: '#fffaf0' }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>STATUS/FIELD EDITS</div>
              <div style={{ fontSize: '20px', color: '#92400e', fontWeight: '800' }}>{edits}</div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: '700', fontSize: '12px' }}>WHEN</th>
                  <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: '700', fontSize: '12px' }}>OFFICER</th>
                  <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: '700', fontSize: '12px' }}>CASE</th>
                  <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: '700', fontSize: '12px' }}>ACTION</th>
                  <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: '700', fontSize: '12px' }}>CHANGE</th>
                  <th style={{ padding: '14px 20px', color: '#64748b', fontWeight: '700', fontSize: '12px' }}>REASON</th>
                </tr>
              </thead>
              <tbody>
                {recentDecisions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '24px 20px', textAlign: 'center', color: '#64748b' }}>
                      No decision entries available for your department yet.
                    </td>
                  </tr>
                ) : recentDecisions.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: '600', fontSize: '12px' }}>
                      {new Date(entry.performedAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: '700', fontSize: '12px' }}>{entry.performedByName}</td>
                    <td style={{ padding: '14px 20px', color: '#8d153a', fontWeight: '700', fontSize: '12px' }}>{entry.complaintId}</td>
                    <td style={{ padding: '14px 20px', color: '#00534e', fontWeight: '700', fontSize: '12px' }}>{entry.action.replace('_', ' ')}</td>
                    <td style={{ padding: '14px 20px', color: '#334155', fontWeight: '600', fontSize: '12px' }}>{entry.field}: {entry.beforeValue} → {entry.afterValue}</td>
                    <td style={{ padding: '14px 20px', color: '#475569', fontSize: '12px' }}>{entry.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
