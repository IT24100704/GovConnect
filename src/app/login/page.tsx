'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/data/mockData';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (user) {
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        departmentId: user.departmentId,
        department: user.department,
        role: user.role,
        userType: user.userType,
        phone: user.phone,
        avatar: user.avatar,
      };
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      if (user.userType === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#f8fafc',
        fontFamily: 'Inter, system-ui, sans-serif',
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url("/sl-admin-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
          border: '1px solid #ffbe29',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: '#8d153a',
            color: 'white',
            padding: '28px 30px',
            borderBottom: '3px solid #ffbe29',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '30px', color: '#ffbe29', fontWeight: 800 }}>GovConnect</h1>
          <p style={{ margin: '8px 0 0', color: '#eb7400', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em' }}>
            AUTHORITY PORTAL
          </p>
        </div>

        <div style={{ padding: '28px 30px 24px' }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#8d153a', fontWeight: 700 }}>Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '15px',
                  outline: 'none',
                }}
                placeholder="Enter your work email"
                required
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#8d153a', fontWeight: 700 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '15px',
                  outline: 'none',
                }}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div
                style={{
                  marginBottom: '18px',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  border: '1px solid #ffcdd2',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#8d153a',
                color: 'white',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </form>
        </div>

        <div
          style={{
            margin: '0 20px 20px',
            padding: '14px 15px',
            backgroundColor: '#fff8e6',
            border: '1px solid #ffbe29',
            borderRadius: '10px',
            fontSize: '13px',
            color: '#334155',
          }}
        >
          <p style={{ margin: '0 0 8px', fontWeight: 800, color: '#8d153a' }}>Department Login Credentials</p>
          <p style={{ margin: '4px 0' }}>
            <strong>Municipal Council:</strong> kamal@municipal.gov.lk / password123
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Police Department:</strong> nadeeka@police.gov.lk / password123
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Water Board:</strong> ruwan@waterboard.gov.lk / password123
          </p>
          <p style={{ margin: '4px 0' }}>
            <strong>Electricity Board:</strong> malini@ceb.gov.lk / password123
          </p>
          <p style={{ margin: '8px 0 0', borderTop: '1px solid #f1d48a', paddingTop: '8px' }}>
            <strong>System Admin:</strong> admin@govconnect.lk / adminpassword
          </p>
        </div>
      </div>
    </div>
  );
}
