'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { governmentDepartments } from '@/data/mockData';

export default function DepartmentManagement() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [departments, setDepartments] = useState(governmentDepartments);
  const [newDept, setNewDept] = useState('');

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDept.trim()) {
      setDepartments([newDept.trim(), ...departments]);
      setNewDept('');
    }
  };

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setDepartments(departments.filter(d => d !== name));
    }
  };

  if (!admin) return null;

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
          <p style={{ fontSize: '12px', margin: '5px 0 0', opacity: 0.8, color: '#eb7400', fontWeight: 'bold' }}>ADMIN CONTROL PANEL</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <div 
            onClick={() => router.push('/admin/dashboard')}
            style={{ padding: '12px 25px', cursor: 'pointer', transition: '0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00534e')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
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
            style={{ padding: '12px 25px', backgroundColor: '#00534e', borderLeft: '4px solid #ffbe29', cursor: 'pointer' }}
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
      <div style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#8d153a', fontWeight: '800' }}>Department Control</h1>
            <p style={{ color: '#00534e', margin: '5px 0 0', fontWeight: '600' }}>Manage the structure of ministries and departments</p>
          </div>
        </header>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '30px', border: '1px solid #ffbe29' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#8d153a', fontSize: '18px', fontWeight: '700' }}>ADD NEW GOVERNMENT BODY</h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Enter Ministry or Department Name"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              style={{ flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '15px' }}
              required
            />
            <button 
              type="submit"
              style={{ backgroundColor: '#8d153a', color: 'white', padding: '12px 30px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' }}
            >
              REGISTER
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #00534e' }}>
          <div style={{ padding: '20px 25px', borderBottom: '2px solid #00534e', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: '#00534e', fontSize: '16px' }}>ACTIVE ENTITIES ({departments.length})</span>
          </div>
          <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {departments.map((dept, index) => (
              <div key={index} style={{ padding: '15px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }} onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fdf4f6')} onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}>
                <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '15px' }}>{dept}</span>
                <button 
                  onClick={() => handleDelete(dept)}
                  style={{ color: '#8d153a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
                >
                  REMOVE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
