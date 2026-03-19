'use client';

import { useState, useEffect } from 'react';
import { generateEscalations } from '@/data/mockDataGovernance';
import {
  calculateEscalationRate,
  getEscalationTrend,
  getPendingEscalations,
  getOverdueEscalationResponses
} from '@/lib/governanceAnalytics';
import { Escalation } from '@/lib/types';
import styles from './escalation-workflow.module.css';

export default function EscalationWorkflowPage() {
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [filteredEscalations, setFilteredEscalations] = useState<Escalation[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'acknowledged' | 'resolved'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'level' | 'date'>('deadline');

  useEffect(() => {
    const data = generateEscalations(15);
    setEscalations(data);
  }, []);

  useEffect(() => {
    let filtered = escalations;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'deadline') {
        return a.responseDeadline.getTime() - b.responseDeadline.getTime();
      } else if (sortBy === 'level') {
        return b.escalationLevel - a.escalationLevel;
      } else {
        return b.escalatedDate.getTime() - a.escalatedDate.getTime();
      }
    });

    setFilteredEscalations(filtered);
  }, [escalations, filterStatus, sortBy]);

  const pending = getPendingEscalations(escalations);
  const overdue = getOverdueEscalationResponses(escalations);
  const trend = getEscalationTrend(escalations, 30);

  const levelDistribution = {
    1: escalations.filter(e => e.escalationLevel === 1).length,
    2: escalations.filter(e => e.escalationLevel === 2).length,
    3: escalations.filter(e => e.escalationLevel === 3).length,
    4: escalations.filter(e => e.escalationLevel === 4).length,
  };

  const reasonDistribution = escalations.reduce((acc, e) => {
    acc[e.reason] = (acc[e.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Escalation Workflow Engine</h1>
        <p>Auto-escalate stuck/high-risk items with escalation history and response timers</p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${overdue.length > 0 ? styles.critical : ''}`}>
          <div className={styles.label}>Pending Escalations</div>
          <div className={styles.value}>{pending.length}</div>
          <div className={styles.subtitle}>Awaiting response</div>
        </div>
        <div className={`${styles.kpiCard} ${overdue.length > 3 ? styles.warning : ''}`}>
          <div className={styles.label}>Overdue Responses</div>
          <div className={styles.value}>{overdue.length}</div>
          <div className={styles.subtitle}>Past deadline</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Total Escalations</div>
          <div className={styles.value}>{escalations.length}</div>
          <div className={styles.subtitle}>This period</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Avg Response Time</div>
          <div className={styles.value}>
            {Math.round(
              escalations
                .filter(e => e.respondedDate)
                .reduce((sum, e) => sum + (e.respondedDate!.getTime() - e.escalatedDate.getTime()) / (1000 * 60 * 60), 0) /
              (escalations.filter(e => e.respondedDate).length || 1)
            )}h
          </div>
          <div className={styles.subtitle}>Average hours</div>
        </div>
      </div>

      {/* Escalation Level Breakdown */}
      <div className={styles.section}>
        <h2>Escalation Levels</h2>
        <div className={styles.levelBreakdown}>
          <div className={styles.levelItem}>
            <span className={`${styles.levelBadge} ${styles.level1}`}>L1</span>
            <span className={styles.levelName}>Team Lead</span>
            <span className={styles.levelCount}>{levelDistribution[1]}</span>
          </div>
          <div className={styles.levelItem}>
            <span className={`${styles.levelBadge} ${styles.level2}`}>L2</span>
            <span className={styles.levelName}>Manager</span>
            <span className={styles.levelCount}>{levelDistribution[2]}</span>
          </div>
          <div className={styles.levelItem}>
            <span className={`${styles.levelBadge} ${styles.level3}`}>L3</span>
            <span className={styles.levelName}>Director</span>
            <span className={styles.levelCount}>{levelDistribution[3]}</span>
          </div>
          <div className={styles.levelItem}>
            <span className={`${styles.levelBadge} ${styles.level4}`}>L4</span>
            <span className={styles.levelName}>Executive</span>
            <span className={styles.levelCount}>{levelDistribution[4]}</span>
          </div>
        </div>
      </div>

      {/* Critical Overdue */}
      {overdue.length > 0 && (
        <div className={styles.section}>
          <h2>⚠️ Overdue Escalation Responses</h2>
          <div className={styles.overdueList}>
            {overdue.map(esc => {
              const hoursOverdue = Math.floor((new Date().getTime() - esc.responseDeadline.getTime()) / (1000 * 60 * 60));
              return (
                <div key={esc.id} className={`${styles.overdueItem} ${styles.critical}`}>
                  <div className={styles.escalationId}>{esc.id}</div>
                  <div className={styles.escalationInfo}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Case:</span>
                      <span className={styles.value}>{esc.complaintId}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Reason:</span>
                      <span className={styles.value}>{esc.reason.replace(/_/g, ' ')}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>Level:</span>
                      <span className={`${styles.levelBadge} ${styles[`level${esc.escalationLevel}`]}`}>
                        L{esc.escalationLevel}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.overdueWarning}`}>
                    {hoursOverdue}h overdue
                  </div>
                  <button className={styles.actionBtn}>Escalate Further</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reason Distribution */}
      <div className={styles.section}>
        <h2>Escalation Reasons</h2>
        <div className={styles.reasonList}>
          {Object.entries(reasonDistribution)
            .sort((a, b) => b[1] - a[1])
            .map(([reason, count]) => (
              <div key={reason} className={styles.reasonItem}>
                <span className={styles.reasonName}>{reason.replace(/_/g, ' ')}</span>
                <div className={styles.reasonBar}>
                  <div
                    className={styles.reasonFill}
                    style={{ width: `${(count / escalations.length) * 100}%` }}
                  />
                </div>
                <span className={styles.reasonCount}>{count}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="deadline">Deadline</option>
            <option value="level">Escalation Level</option>
            <option value="date">Date</option>
          </select>
        </div>
      </div>

      {/* Full Table */}
      <div className={styles.section}>
        <h2>All Escalations ({filteredEscalations.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Case</th>
                <th>Reason</th>
                <th>Level</th>
                <th>Status</th>
                <th>Escalated</th>
                <th>Deadline</th>
                <th>Response</th>
                <th>Days Pending</th>
              </tr>
            </thead>
            <tbody>
              {filteredEscalations.map(esc => {
                const daysPending = Math.floor(
                  (new Date().getTime() - esc.escalatedDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                const isOverdue = new Date() > esc.responseDeadline && !esc.respondedDate;

                return (
                  <tr key={esc.id} className={isOverdue ? styles.overdueRow : ''}>
                    <td className={styles.idCell}>{esc.id}</td>
                    <td>{esc.complaintId}</td>
                    <td>{esc.reason.replace(/_/g, ' ')}</td>
                    <td className={styles.levelCell}>
                      <span className={`${styles.levelBadge} ${styles[`level${esc.escalationLevel}`]}`}>
                        L{esc.escalationLevel}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[esc.status]}`}>
                        {esc.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{esc.escalatedDate.toLocaleDateString()}</td>
                    <td className={isOverdue ? styles.overdueCell : ''}>
                      {esc.responseDeadline.toLocaleDateString()}
                    </td>
                    <td>{esc.respondedDate ? esc.respondedDate.toLocaleDateString() : 'Pending'}</td>
                    <td className={daysPending > 7 ? styles.highDays : ''}>{daysPending}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
