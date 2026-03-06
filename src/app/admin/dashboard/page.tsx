'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers, governmentDepartments, sriLankaGeography } from '@/data/mockData';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.userType !== 'admin') {
      router.push('/dashboard');
      return;
    }
    setAdmin(user);
  }, [router]);

  if (!admin) return <div style={{ padding: '20px' }}>Loading...</div>;

  const stats = [
    { label: 'Total Officers', count: mockUsers.length, color: '#1976d2', icon: '👥' },
    { label: 'Departments', count: governmentDepartments.length, color: '#4caf50', icon: '🏛️' },
    { label: 'Provinces Covered', count: sriLankaGeography.length, color: '#ff9800', icon: '🗺️' },
    { label: 'Active Complaints', count: 124, color: '#f44336', icon: '📄' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("/sl-admin-bg.jpg")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundPosition: 'center'
    }}>
      {/* Sidebar */}
      <div style={{ width: '260px', backgroundColor: '#8d153a', color: 'white', padding: '25px 0', boxShadow: '4px 0 10px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '0 25px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '22px', margin: 0, color: '#ffbe29' }}>GovConnect</h2>
          <p style={{ fontSize: '12px', margin: '5px 0 0', opacity: 0.8, color: '#eb7400', fontWeight: 'bold' }}>ADMIN CONTROL PANEL</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <div style={{ padding: '12px 25px', backgroundColor: '#00534e', borderLeft: '4px solid #ffbe29', cursor: 'pointer' }}>
            Dashboard Overview
          </div>
          <div 
            onClick={() => router.push('/admin/users')}
            style={{ padding: '12px 25px', cursor: 'pointer', transition: '0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00534e')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            User Management
          </div>
          <div 
            onClick={() => router.push('/admin/departments')}
            style={{ padding: '12px 25px', cursor: 'pointer', transition: '0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00534e')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Department Control
          </div>
          <div 
            onClick={() => router.push('/admin/geography')}
            style={{ padding: '12px 25px', cursor: 'pointer', transition: '0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00534e')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Geo-Location Mapping
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '20px', width: '260px', padding: '0 25px' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#8d153a', fontWeight: '800' }}>Administrator Dashboard</h1>
            <p style={{ color: '#00534e', margin: '5px 0 0', fontWeight: '600' }}>Welcome back, {admin.name}</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '10px', border: '2px solid #ffbe29' }}>
            <div style={{ width: '35px', height: '35px', backgroundColor: '#eb7400', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              SA
            </div>
            <span style={{ fontWeight: '700', color: '#8d153a' }}>System Admin</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
          {[
            { label: 'Total Officers', count: mockUsers.length, color: '#8d153a', icon: '👥' },
            { label: 'Departments', count: governmentDepartments.length, color: '#00534e', icon: '🏛️' },
            { label: 'Map Zones', count: 9, color: '#eb7400', icon: '🗺️' },
            { label: 'Critical Cases', count: 12, color: '#ffbe29', icon: '🚨' },
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: `4px solid ${stat.color}` }}>
              <div style={{ fontSize: '30px', backgroundColor: `${stat.color}15`, padding: '15px', borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{stat.label}</p>
                <h3 style={{ margin: '5px 0 0', fontSize: '24px', color: stat.color }}>{stat.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <h2 style={{ fontSize: '20px', color: '#8d153a', marginBottom: '20px', fontWeight: '700' }}>Administrative Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #ffbe29' }}>
            <div style={{ fontSize: '24px', marginBottom: '15px' }}>👥</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#8d153a' }}>User Management</h3>
            <p style={{ color: '#00534e', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', fontWeight: '500' }}>
              Create and manage government officials across ministries. Control access levels for the authority portal.
            </p>
            <button 
              onClick={() => router.push('/admin/users')}
              style={{ padding: '10px 20px', backgroundColor: '#8d153a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
            >
              Manage Users
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #eb7400' }}>
            <div style={{ fontSize: '24px', marginBottom: '15px' }}>🗺️</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#8d153a' }}>Geo-Location Setup</h3>
            <p style={{ color: '#00534e', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', fontWeight: '500' }}>
              Define the geographical hierarchy: Province, District, DS Division, and GS Divisions for routing complaints.
            </p>
            <button 
              onClick={() => router.push('/admin/geography')}
              style={{ padding: '10px 20px', backgroundColor: '#eb7400', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
            >
              Setup Locations
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #00534e' }}>
            <div style={{ fontSize: '24px', marginBottom: '15px' }}>🏛️</div>
            <h3 style={{ margin: '0 0 10px 0', color: '#8d153a' }}>Department Control</h3>
            <p style={{ color: '#00534e', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px', fontWeight: '500' }}>
              Add or remove government entities and assign departmental heads. Monitor department-wise caseload.
            </p>
            <button 
              onClick={() => router.push('/admin/departments')}
              style={{ padding: '10px 20px', backgroundColor: '#00534e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
            >
              Manage Departments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
