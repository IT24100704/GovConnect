"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">GovConnect</h1>
        <p className="text-xs text-gray-500 mt-1">Authority Portal</p>
      </div>
      
      <nav className="mt-6">
        <Link
          href="/dashboard"
          className={`flex items-center px-6 py-3 text-sm ${
            pathname === '/dashboard'
              ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">📊</span>
          Dashboard
        </Link>

        <Link
          href="/communication-hub"
          className={`flex items-center px-6 py-3 text-sm ${
            pathname === '/communication-hub'
              ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">💬</span>
          Communication Hub
        </Link>

        <Link
          href="/analytics-dashboard"
          className={`flex items-center px-6 py-3 text-sm ${
            pathname === '/analytics-dashboard'
              ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">📈</span>
          Analytics
        </Link>

        <div style={{ height: '1px', background: '#e5e7eb', margin: '12px 0' }} />

        <Link
          href="/complaint-detail/GRV-8821"
          className={`flex items-center px-6 py-3 text-sm ${
            pathname.startsWith('/complaint-detail')
              ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">🔍</span>
          View Complaints
        </Link>

        {user && (
          <div className="px-6 py-4 mt-4 bg-gray-50">
            <p className="text-xs text-gray-500">Logged in as:</p>
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-600 mt-1">{user.department}</p>
          </div>
        )}
      </nav>
    </div>
  );
}