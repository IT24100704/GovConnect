'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './analytics-dashboard.module.css';

interface KPIData {
  label: string;
  value: string | number;
  trend: string;
  trendValue: number;
  trendDirection: 'up' | 'down' | 'neutral';
}

interface HotspotData {
  district: string;
  province: string;
  intensity: number;
  count: number;
}

interface DepartmentData {
  name: string;
  resolutionRate: number;
  trend: string;
}

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<KPIData[]>([]);
  const [hotspots, setHotspots] = useState<HotspotData[]>([]);
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'30days' | '90days' | 'annual'>('30days');
  const [hotspotView, setHotspotView] = useState<'District' | 'Province'>('District');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);

  useEffect(() => {
    // Mock KPI data
    setKpis([
      {
        label: 'Total Grievances',
        value: '124,502',
        trend: '+12.5%',
        trendValue: 12.5,
        trendDirection: 'up',
      },
      {
        label: 'Resolution Rate',
        value: '88.4%',
        trend: '+3.2%',
        trendValue: 3.2,
        trendDirection: 'up',
      },
      {
        label: 'Avg. Response Time',
        value: '2.4 Days',
        trend: '-0.5%',
        trendValue: -0.5,
        trendDirection: 'down',
      },
      {
        label: 'SLA Compliance',
        value: '94.1%',
        trend: '+8%',
        trendValue: 8,
        trendDirection: 'up',
      },
    ]);

    // Mock hotspot data
    setHotspots([
      { district: 'District 1', province: 'Western', intensity: 85, count: 450 },
      { district: 'District 2', province: 'Western', intensity: 60, count: 320 },
      { district: 'District 3', province: 'Central', intensity: 45, count: 210 },
      { district: 'District 4', province: 'Northern', intensity: 30, count: 120 },
    ]);

    // Mock department data
    setDepartments([
      { name: 'Health & Sanitation', resolutionRate: 92, trend: '+4%' },
      { name: 'Public Works', resolutionRate: 78, trend: '-2%' },
      { name: 'Education Dept', resolutionRate: 85, trend: '0%' },
      { name: 'Electricity Board', resolutionRate: 84, trend: '-8%' },
    ]);
  }, []);

  const handleExport = () => {
    const timestamp = new Date().toLocaleString();
    const reportData = {
      title: 'Advanced Performance Analytics Report',
      generatedAt: timestamp,
      kpis: kpis,
      departments: departments,
      hotspots: hotspots,
      timeFilter: selectedFilter,
    };
    
    // Create and download JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-report-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Report exported successfully!');
  };

  const handleViewDetails = (hotspot: HotspotData) => {
    setSelectedHotspot(hotspot);
    // Navigate to hotspot detail page with data as query params
    const queryParams = new URLSearchParams({
      district: hotspot.district,
      province: hotspot.province,
      intensity: hotspot.intensity.toString(),
      count: hotspot.count.toString(),
    });
    router.push(`/hotspot-detail?${queryParams.toString()}`);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={handleGoBack}>← Back</button>
          <div>
            <h1>Advanced Performance Analytics</h1>
            <p>Dashboard • Analytics</p>
          </div>
        </div>
        <button className={styles.exportBtn} onClick={handleExport}>📊 Export Report</button>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {kpis.map((kpi, idx) => (
          <div key={idx} className={styles.kpiCard}>
            <div className={styles.icon}>
              {idx === 0 && '📋'}
              {idx === 1 && '✓'}
              {idx === 2 && '⏱️'}
              {idx === 3 && '🛡️'}
            </div>
            <div className={styles.content}>
              <p className={styles.label}>{kpi.label}</p>
              <p className={styles.value}>{kpi.value}</p>
            </div>
            <div className={`${styles.trend} ${styles[kpi.trendDirection]}`}>
              {kpi.trendDirection === 'up' && '+'}
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        {/* Left Column - Heatmap */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Grievance Hotspots</h2>
            <p>Distribution by district/Province</p>
          </div>
          <div className={styles.filterTabs}>
            {(['District', 'Province'] as const).map((filter) => (
              <button 
                key={filter} 
                className={`${styles.filterBtn} ${hotspotView === filter ? styles.active : ''}`}
                onClick={() => setHotspotView(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className={styles.heatmapContainer}>
            <div className={styles.heatmapPlaceholder}>
              📊 Grievance Heat Map Visualization
              <br />
              (Geographic distribution of grievances)
            </div>
            <div className={styles.heatmapLegend}>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#ff4444' }} />
                <span>High (80+)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#ffaa44' }} />
                <span>Medium (40-80)</span>
              </div>
              <div className={styles.legendItem}>
                <div className={styles.legendColor} style={{ background: '#44aaff' }} />
                <span>Low (0-40)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - SLA Compliance */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>SLA Compliance</h2>
            <p>Performance against legal timeframes</p>
          </div>
          <div className={styles.complianceChart}>
            <div className={styles.circleChart}>
              <div className={styles.circle}>
                <span className={styles.circleValue}>94%</span>
                <span className={styles.circleLabel}>TARGET MET</span>
              </div>
            </div>
          </div>
          <div className={styles.complianceDetails}>
            <div className={styles.complianceBar}>
              <div className={styles.barLabel}>Within 24h</div>
              <div className={styles.barContainer}>
                <div className={styles.barFill} style={{ width: '68%' }} />
              </div>
              <div className={styles.barValue}>68%</div>
            </div>
            <div className={styles.complianceBar}>
              <div className={styles.barLabel}>Within 7 Days</div>
              <div className={styles.barContainer}>
                <div className={styles.barFill} style={{ width: '26%' }} />
              </div>
              <div className={styles.barValue}>26%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Resolution Rates */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Department Resolution Rates</h2>
          <p>Comparative analysis across core sectors</p>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
            className={styles.timeFilter}
          >
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="annual">Annual</option>
          </select>
        </div>

        <div className={styles.departmentList}>
          {departments.map((dept, idx) => (
            <div key={idx} className={styles.departmentRow}>
              <div className={styles.deptName}>{dept.name}</div>
              <div className={styles.deptBar}>
                <div className={styles.barContainer}>
                  <div className={styles.barFill} style={{ width: `${dept.resolutionRate}%` }} />
                </div>
                <div className={styles.deptStats}>
                  <span className={styles.percentage}>{dept.resolutionRate}% Resolved</span>
                  <span className={`${styles.trend} ${dept.trend.includes('-') ? styles.negative : styles.positive}`}>
                    {dept.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Hotspots Table */}
      <div className={styles.section}>
        <h2>High-Priority Hotspots</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>District</th>
                <th>Province</th>
                <th>Intensity</th>
                <th>Grievance Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hotspots.map((hotspot, idx) => (
                <tr key={idx}>
                  <td className={styles.tdName}>{hotspot.district}</td>
                  <td>{hotspot.province}</td>
                  <td>
                    <div className={styles.intensityBar}>
                      <div
                        className={styles.intensityFill}
                        style={{ width: `${hotspot.intensity}%` }}
                      />
                    </div>
                    {hotspot.intensity}%
                  </td>
                  <td className={styles.tdCount}>{hotspot.count}</td>
                  <td>
                    <button className={styles.actionLink} onClick={() => handleViewDetails(hotspot)}>View Details →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
