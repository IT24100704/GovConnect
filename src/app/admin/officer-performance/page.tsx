'use client';

import { useState, useEffect } from 'react';
import { mockOfficers } from '@/data/mockDataGovernance';
import { generateOfficerPerformanceData } from '@/data/mockDataGovernance';
import {
  calculateTeamAverageClosureTime,
  calculateTeamQualityScore,
  getTopPerformers,
  getUnderperformers,
  calculateWorkloadImbalance
} from '@/lib/governanceAnalytics';
import { OfficerPerformance } from '@/lib/types';
import styles from './officer-performance.module.css';

export default function OfficerPerformancePage() {
  const [performances, setPerformances] = useState<OfficerPerformance[]>([]);
  const [filteredPerformances, setFilteredPerformances] = useState<OfficerPerformance[]>([]);
  const [filterDept, setFilterDept] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'quality' | 'caseload' | 'closure' | 'escalation'>('quality');

  useEffect(() => {
    const data = generateOfficerPerformanceData(mockOfficers);
    setPerformances(data);
  }, []);

  useEffect(() => {
    let filtered = performances;

    if (filterDept !== 'all') {
      filtered = filtered.filter(p => p.officer.department === filterDept);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'quality':
          return b.qualityScore - a.qualityScore;
        case 'caseload':
          return b.caseloadSize - a.caseloadSize;
        case 'closure':
          return a.averageClosureTime - b.averageClosureTime;
        case 'escalation':
          return a.escalationRate - b.escalationRate;
        default:
          return 0;
      }
    });

    setFilteredPerformances(filtered);
  }, [performances, filterDept, sortBy]);

  const avgClosureTime = calculateTeamAverageClosureTime(performances);
  const avgQualityScore = calculateTeamQualityScore(performances);
  const topPerformers = getTopPerformers(performances, 3);
  const underperformers = getUnderperformers(performances, 3);
  const workloadImbalance = calculateWorkloadImbalance(performances);

  const departments = Array.from(new Set(mockOfficers.map(o => o.department)));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Officer Performance & Workload Panel</h1>
        <p>Caseload, closure time, escalation rate, and quality score per officer/team</p>
      </div>

      {/* Team KPIs */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Team Average Closure Time</div>
          <div className={styles.value}>{avgClosureTime} days</div>
          <div className={styles.subtitle}>Target: 7 days</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Average Quality Score</div>
          <div className={styles.value}>{avgQualityScore}</div>
          <div className={styles.subtitle}>Out of 100</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Active Officers</div>
          <div className={styles.value}>{performances.length}</div>
          <div className={styles.subtitle}>{performances.length} under review</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Top Performer</div>
          <div className={styles.value}>{topPerformers[0]?.officer.name.split(' ')[1] || 'N/A'}</div>
          <div className={styles.subtitle}>Excellence rating</div>
        </div>
      </div>

      {/* Top Performers */}
      {topPerformers.length > 0 && (
        <div className={styles.section}>
          <h2>⭐ Top Performers</h2>
          <div className={styles.performerGrid}>
            {topPerformers.map(perf => (
              <div key={perf.officerId} className={`${styles.performerCard} ${styles.excellent}`}>
                <div className={styles.name}>{perf.officer.name}</div>
                <div className={styles.title}>{perf.officer.role}</div>
                <div className={styles.dept}>{perf.officer.department}</div>
                <div className={styles.scoreBox}>
                  <div className={styles.scoreItem}>
                    <span>Quality</span>
                    <strong>{perf.qualityScore}</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span>Satisfaction</span>
                    <strong>{perf.customerSatisfactionScore}</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span>Compliance</span>
                    <strong>{perf.complianceScore}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Underperformers */}
      {underperformers.length > 0 && (
        <div className={styles.section}>
          <h2>⚠️ Attention Required</h2>
          <div className={styles.performerGrid}>
            {underperformers.map(perf => (
              <div key={perf.officerId} className={`${styles.performerCard} ${styles.poor}`}>
                <div className={styles.name}>{perf.officer.name}</div>
                <div className={styles.title}>{perf.officer.role}</div>
                <div className={styles.dept}>{perf.officer.department}</div>
                <div className={styles.scoreBox}>
                  <div className={styles.scoreItem}>
                    <span>Quality</span>
                    <strong>{perf.qualityScore}</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span>Escalation Rate</span>
                    <strong>{perf.escalationRate}%</strong>
                  </div>
                  <div className={styles.scoreItem}>
                    <span>Compliance</span>
                    <strong>{perf.complianceScore}</strong>
                  </div>
                </div>
                <button className={styles.trainingBtn}>Training Required</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workload Imbalance */}
      {workloadImbalance.length > 0 && workloadImbalance[0].imbalance > 5 && (
        <div className={styles.section}>
          <h2>⚙️ Workload Imbalance</h2>
          <div className={styles.imbalanceList}>
            {workloadImbalance.slice(0, 5).map((item, idx) => (
              <div key={item.officer.officerId} className={styles.imbalanceItem}>
                <span className={styles.rank}>#{idx + 1}</span>
                <span className={styles.name}>{item.officer.officer.name}</span>
                <span className={styles.caseload}>{item.officer.caseloadSize} cases</span>
                <span className={styles.imbalanceValue}>
                  {item.imbalance > 0 ? '+' : ''}{item.imbalance.toFixed(1)} above average
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Department:</label>
          <select value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="quality">Quality Score</option>
            <option value="caseload">Caseload</option>
            <option value="closure">Closure Time</option>
            <option value="escalation">Escalation Rate</option>
          </select>
        </div>
      </div>

      {/* Full Table */}
      <div className={styles.section}>
        <h2>All Officers ({filteredPerformances.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Officer</th>
                <th>Department</th>
                <th>Caseload</th>
                <th>Resolved</th>
                <th>Avg Closure</th>
                <th>Quality</th>
                <th>Satisfaction</th>
                <th>Compliance</th>
                <th>Escalation%</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredPerformances.map(perf => (
                <tr
                  key={perf.officerId}
                  className={
                    perf.overallPerformanceRating === 'excellent' ? styles.excellentRow :
                    perf.overallPerformanceRating === 'poor' ? styles.poorRow :
                    ''
                  }
                >
                  <td className={styles.nameCell}>{perf.officer.name}</td>
                  <td>{perf.officer.department}</td>
                  <td className={styles.boldCell}>{perf.caseloadSize}</td>
                  <td>{perf.casesResolved}</td>
                  <td>{perf.averageClosureTime} days</td>
                  <td className={styles.scoreCell}>{perf.qualityScore}</td>
                  <td className={styles.scoreCell}>{perf.customerSatisfactionScore}</td>
                  <td className={styles.scoreCell}>{perf.complianceScore}</td>
                  <td className={perf.escalationRate > 30 ? styles.highEscalation : ''}>
                    {perf.escalationRate}%
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[perf.overallPerformanceRating]}`}>
                      {perf.overallPerformanceRating.toUpperCase()}
                    </span>
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
