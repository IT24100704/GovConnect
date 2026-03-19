'use client';

import { useState, useEffect } from 'react';
import { generateSLATrackers } from '@/data/mockDataGovernance';
import { calculateSLABreachRate, calculateSLAWarningRate, getBottleneckStages, getOldestOverdueItems } from '@/lib/governanceAnalytics';
import { SLATracker } from '@/lib/types';
import styles from './sla-monitor.module.css';

export default function SLAMonitorPage() {
  const [trackers, setTrackers] = useState<SLATracker[]>([]);
  const [filteredTrackers, setFilteredTrackers] = useState<SLATracker[]>([]);
  const [filter, setFilter] = useState<'all' | 'on_track' | 'warning' | 'breached'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'daysOverdue'>('dueDate');

  useEffect(() => {
    const data = generateSLATrackers(20);
    setTrackers(data);
  }, []);

  useEffect(() => {
    let filtered = trackers;
    if (filter !== 'all') {
      filtered = trackers.filter(t => t.status === filter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        return a.dueDate.getTime() - b.dueDate.getTime();
      } else {
        return b.daysOverdue - a.daysOverdue;
      }
    });

    setFilteredTrackers(filtered);
  }, [trackers, filter, sortBy]);

  const breachRate = calculateSLABreachRate(trackers);
  const warningRate = calculateSLAWarningRate(trackers);
  const bottlenecks = getBottleneckStages(trackers);
  const oldestOverdue = getOldestOverdueItems(trackers, 5);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>SLA & Delay Monitor</h1>
        <p>Track pending items by deadline, breached SLAs, and bottleneck stages</p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${breachRate > 20 ? styles.critical : ''}`}>
          <div className={styles.label}>SLA Breach Rate</div>
          <div className={styles.value}>{breachRate}%</div>
          <div className={styles.subtitle}>{trackers.filter(t => t.breached).length} breached</div>
        </div>
        <div className={`${styles.kpiCard} ${warningRate > 15 ? styles.warning : ''}`}>
          <div className={styles.label}>Warning Status</div>
          <div className={styles.value}>{warningRate}%</div>
          <div className={styles.subtitle}>{trackers.filter(t => t.status === 'warning').length} approaching deadline</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>On Track</div>
          <div className={styles.value}>{trackers.filter(t => t.status === 'on_track').length}</div>
          <div className={styles.subtitle}>{trackers.length} total tracked</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Avg Days Overdue</div>
          <div className={styles.value}>
            {trackers.length > 0
              ? Math.round(trackers.reduce((sum, t) => sum + t.daysOverdue, 0) / trackers.length)
              : 0}
          </div>
          <div className={styles.subtitle}>Breached items</div>
        </div>
      </div>

      {/* Bottleneck Analysis */}
      {Object.keys(bottlenecks).length > 0 && (
        <div className={styles.section}>
          <h2>Bottleneck Stages</h2>
          <div className={styles.bottleneckList}>
            {Object.entries(bottlenecks).map(([stage, count]) => (
              <div key={stage} className={styles.bottleneckItem}>
                <span className={styles.stageName}>{stage}</span>
                <span className={styles.stageCount}>{count} items stuck</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Oldest Overdue Items */}
      {oldestOverdue.length > 0 && (
        <div className={styles.section}>
          <h2>Oldest Overdue Items</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Days Overdue</th>
                <th>Department</th>
                <th>Due Date</th>
                <th>Bottleneck</th>
              </tr>
            </thead>
            <tbody>
              {oldestOverdue.map(tracker => (
                <tr key={tracker.complaintId} className={styles.criticalRow}>
                  <td>{tracker.complaintId}</td>
                  <td className={styles.daysOverdue}>{tracker.daysOverdue} days</td>
                  <td>{tracker.slaPolicy.department}</td>
                  <td>{tracker.dueDate.toLocaleDateString()}</td>
                  <td>{tracker.bottleneckStage || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filter Controls */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Filter by Status:</label>
          <select value={filter} onChange={e => setFilter(e.target.value as any)}>
            <option value="all">All Items</option>
            <option value="on_track">On Track</option>
            <option value="warning">Warning</option>
            <option value="breached">Breached</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="dueDate">Due Date</option>
            <option value="daysOverdue">Days Overdue</option>
          </select>
        </div>
      </div>

      {/* Full Table */}
      <div className={styles.section}>
        <h2>All Tracked Items ({filteredTrackers.length})</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Status</th>
              <th>Department</th>
              <th>Target Days</th>
              <th>Due Date</th>
              <th>Days Overdue</th>
              <th>Complexity</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrackers.map(tracker => (
              <tr
                key={tracker.complaintId}
                className={
                  tracker.status === 'breached'
                    ? styles.breachedRow
                    : tracker.status === 'warning'
                    ? styles.warningRow
                    : ''
                }
              >
                <td>{tracker.complaintId}</td>
                <td>
                  <span className={`${styles.badge} ${styles[tracker.status]}`}>
                    {tracker.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>{tracker.slaPolicy.department}</td>
                <td>{tracker.slaPolicy.targetDays}</td>
                <td>{tracker.dueDate.toLocaleDateString()}</td>
                <td>{tracker.daysOverdue > 0 ? `+${tracker.daysOverdue}` : 'On time'}</td>
                <td>{tracker.slaPolicy.complexityLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
