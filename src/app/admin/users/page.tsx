'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers, governmentDepartments } from '@/data/mockData';

export default function UserManagement() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<any[]>(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    userType: 'authority'
  });

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

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        userType: user.userType
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', department: '', role: '', userType: 'authority' });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser = {
        ...formData,
        id: `auth_${Date.now()}`,
        password: 'password123'
      };
      setUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
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
            style={{ padding: '12px 25px', backgroundColor: '#00534e', borderLeft: '4px solid #ffbe29', cursor: 'pointer' }}
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
      <div style={{ flex: 1, padding: '40px', marginLeft: '260px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', margin: 0, color: '#8d153a', fontWeight: '800' }}>User Management</h1>
            <p style={{ color: '#00534e', margin: '5px 0 0', fontWeight: '600' }}>Manage system access for government officials</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            style={{ backgroundColor: '#8d153a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          >
            + Add New Official
          </button>
        </header>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #ffbe29' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #ffbe29' }}>
              <tr>
                <th style={{ padding: '18px 20px', color: '#8d153a', fontWeight: '700' }}>Official Details</th>
                <th style={{ padding: '18px 20px', color: '#8d153a', fontWeight: '700' }}>Department</th>
                <th style={{ padding: '18px 20px', color: '#8d153a', fontWeight: '700' }}>Designation</th>
                <th style={{ padding: '18px 20px', color: '#8d153a', fontWeight: '700', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '18px 20px' }}>
                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{user.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '18px 20px' }}>
                    <span style={{ backgroundColor: '#00534e15', color: '#00534e', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: '700' }}>
                      {user.department || 'All Access'}
                    </span>
                  </td>
                  <td style={{ padding: '18px 20px', color: '#64748b', fontWeight: '500' }}>{user.role}</td>
                  <td style={{ padding: '18px 20px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleOpenModal(user)}
                      style={{ marginRight: '15px', background: 'none', border: 'none', color: '#eb7400', cursor: 'pointer', fontWeight: '700' }}
                    >
                      EDIT
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      style={{ background: 'none', border: 'none', color: '#8d153a', cursor: 'pointer', fontWeight: '700' }}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '16px', width: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', borderTop: '8px solid #8d153a' }}>
            <h2 style={{ marginBottom: '25px', color: '#8d153a', fontSize: '22px' }}>{editingUser ? 'Update Official' : 'Register New Official'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#64748b' }}>FULL NAME</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#64748b' }}>OFFICIAL EMAIL</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#64748b' }}>DEPARTMENT</label>
                <select 
                  value={formData.department} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  required
                >
                  <option value="">Choose Department...</option>
                  {governmentDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '700', color: '#64748b' }}>ROLE / DESIGNATION</label>
                <input 
                  type="text" 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #8d153a', backgroundColor: 'transparent', color: '#8d153a', cursor: 'pointer', fontWeight: '700' }}
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#8d153a', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                >
                  SAVE OFFICIAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
