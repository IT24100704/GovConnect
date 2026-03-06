'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sriLankaGeography } from '@/data/mockData';

export default function GeographyManagement() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [geoData, setGeoData] = useState(sriLankaGeography);
  const [selectedProv, setSelectedProv] = useState<any>(null);
  const [selectedDist, setSelectedDist] = useState<any>(null);
  const [selectedDS, setSelectedDS] = useState<any>(null);

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
            onClick={() => router.push('/admin/departments')}
            style={{ padding: '12px 25px', cursor: 'pointer', transition: '0.2s' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#00534e')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Department Control
          </div>
          <div 
            style={{ padding: '12px 25px', backgroundColor: '#00534e', borderLeft: '4px solid #ffbe29', cursor: 'pointer' }}
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
            <h1 style={{ fontSize: '28px', margin: 0, color: '#8d153a', fontWeight: '800' }}>Geo-Location Mapping</h1>
            <p style={{ color: '#00534e', margin: '5px 0 0', fontWeight: '600' }}>Define administrative boundaries for Sri Lanka</p>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {/* Provinces */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #8d153a' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#8d153a', borderBottom: '2px solid #ffbe29', paddingBottom: '10px', fontWeight: '800' }}>PROVINCES</h3>
            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {geoData.map(prov => (
                <div 
                  key={prov.id}
                  onClick={() => { setSelectedProv(prov); setSelectedDist(null); setSelectedDS(null); }}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    marginBottom: '8px',
                    backgroundColor: selectedProv?.id === prov.id ? '#8d153a' : '#f8fafc',
                    color: selectedProv?.id === prov.id ? 'white' : '#1e293b',
                    fontWeight: '700',
                    fontSize: '14px',
                    transition: '0.2s',
                    border: '1px solid #eee'
                  }}
                >
                  {prov.name}
                </div>
              ))}
            </div>
          </div>

          {/* Districts */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #eb7400' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#eb7400', borderBottom: '2px solid #eb7400', paddingBottom: '10px', fontWeight: '800' }}>DISTRICTS</h3>
            {!selectedProv ? (
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>Select a province</p>
            ) : (
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {selectedProv.districts.map((dist: any) => (
                  <div 
                    key={dist.id}
                    onClick={() => { setSelectedDist(dist); setSelectedDS(null); }}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      marginBottom: '8px',
                      backgroundColor: selectedDist?.id === dist.id ? '#eb7400' : '#f8fafc',
                      color: selectedDist?.id === dist.id ? 'white' : '#1e293b',
                      fontWeight: '700',
                      fontSize: '14px',
                      border: '1px solid #eee'
                    }}
                  >
                    {dist.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DS Divisions */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #ffbe29' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#8d153a', borderBottom: '2px solid #ffbe29', paddingBottom: '10px', fontWeight: '800' }}>DS DIVISIONS</h3>
            {!selectedDist ? (
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>Select a district</p>
            ) : (
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {selectedDist.dsDivisions.map((ds: any) => (
                  <div 
                    key={ds.id}
                    onClick={() => setSelectedDS(ds)}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      cursor: 'pointer', 
                      marginBottom: '8px',
                      backgroundColor: selectedDS?.id === ds.id ? '#00534e' : '#f8fafc',
                      color: selectedDS?.id === ds.id ? 'white' : '#1e293b',
                      fontWeight: '700',
                      fontSize: '14px',
                      border: '1px solid #eee'
                    }}
                  >
                    {ds.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GS Divisions */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #00534e' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#00534e', borderBottom: '2px solid #00534e', paddingBottom: '10px', fontWeight: '800' }}>GS DIVISIONS</h3>
            {!selectedDS ? (
              <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>Select a DS division</p>
            ) : (
              <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {selectedDS.gsDivisions.map((gs: string) => (
                  <div 
                    key={gs}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '8px', 
                      marginBottom: '8px',
                      backgroundColor: '#f8fafc',
                      color: '#1e293b',
                      border: '1px solid #cbd5e1',
                      fontWeight: '600',
                      fontSize: '13px'
                    }}
                  >
                    {gs}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
