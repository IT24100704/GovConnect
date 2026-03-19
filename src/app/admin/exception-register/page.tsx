'use client';

import { useState, useEffect } from 'react';
import { generateOverrideRecords } from '@/data/mockDataGovernance';
import { OverrideRecord } from '@/lib/types';
import styles from './exception-register.module.css';

export default function ExceptionRegisterPage() {
  const [overrides, setOverrides] = useState<OverrideRecord[]>([]);
  const [filteredOverrides, setFilteredOverrides] = useState<OverrideRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending_approval' | 'approved' | 'under_review'>('all');
  const [filterType, setFilterType] = useState<'all' | 'policy_exception' | 'deadline_extension' | 'approval_bypass'>('all');

  useEffect(() => {
    const data = generateOverrideRecords(12);
    setOverrides(data);
  }, []);

  useEffect(() => {
    let filtered = overrides;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(o => o.overrideType === filterType);
    }

    setFilteredOverrides(filtered);
  }, [overrides, filterStatus, filterType]);

  const pendingApproval = overrides.filter(o => o.status === 'pending_approval').length;
  const approved = overrides.filter(o => o.status === 'approved').length;
  const underReview = overrides.filter(o => o.status === 'under_review').length;

  const typeDistribution = overrides.reduce((acc, o) => {
    acc[o.overrideType] = (acc[o.overrideType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Exception & Override Register</h1>
        <p>Force reason capture for manual overrides, with senior approval and periodic review</p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${pendingApproval > 3 ? styles.critical : ''}`}>
          <div className={styles.label}>Pending Approval</div>
          <div className={styles.value}>{pendingApproval}</div>
          <div className={styles.subtitle}>Awaiting senior review</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Approved Overrides</div>
          <div className={styles.value}>{approved}</div>
          <div className={styles.subtitle}>Authorized exceptions</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Under Review</div>
          <div className={styles.value}>{underReview}</div>
          <div className={styles.subtitle}>Periodic audit</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Total Overrides</div>
          <div className={styles.value}>{overrides.length}</div>
          <div className={styles.subtitle}>This quarter</div>
        </div>
      </div>

      {/* Override Types Distribution */}
      <div className={styles.section}>
        <h2>Override Types Distribution</h2>
        <div className={styles.typeGrid}>
          {Object.entries(typeDistribution).map(([type, count]) => (
            <div key={type} className={styles.typeCard}>
              <div className={styles.typeLabel}>{type.replace(/_/g, ' ')}</div>
              <div className={styles.typeValue}>{count}</div>
              <div className={styles.typePercent}>
                {Math.round((count / overrides.length) * 100)}% of all overrides
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApproval > 0 && (
        <div className={styles.section}>
          <h2>⚠️ Pending Senior Approval</h2>
          <div className={styles.pendingList}>
            {overrides
              .filter(o => o.status === 'pending_approval')
              .map(override => (
                <div key={override.id} className={styles.pendingCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.overrideId}>{override.id}</span>
                    <span className={`${styles.typeBadge} ${styles[override.overrideType.split('_')[0]]}`}>
                      {override.overrideType.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.field}>
                      <span className={styles.label}>Case:</span>
                      <span className={styles.value}>{override.complaintId}</span>
                    </div>
                    <div className={styles.field}>
                      <span className={styles.label}>Reason:</span>
                      <span className={styles.value}>{override.reason}</span>
                    </div>
                    <div className={styles.field}>
                      <span className={styles.label}>Overridden By:</span>
                      <span className={styles.value}>{override.overriddenBy.split('_')[1]}</span>
                    </div>
                    <div className={styles.field}>
                      <span className={styles.label}>Risk Assessment:</span>
                      <span className={styles.value}>{override.riskAssessment}</span>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.approveBtn}>Approve</button>
                    <button className={styles.rejectBtn}>Request Changes</button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Under Review */}
      {underReview > 0 && (
        <div className={styles.section}>
          <h2>Under Periodic Review</h2>
          <div className={styles.reviewList}>
            {overrides
              .filter(o => o.status === 'under_review')
              .map(override => (
                <div key={override.id} className={styles.reviewItem}>
                  <div className={styles.itemHeader}>
                    <span className={styles.id}>{override.id}</span>
                    <span className={styles.case}>{override.complaintId}</span>
                    <span className={styles.type}>{override.overrideType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className={styles.itemDetails}>
                    <div>Approved by: {override.approverName}</div>
                    <div>Review scheduled: {override.reviewScheduledDate?.toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="all">All</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="under_review">Under Review</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Type:</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value as any)}>
            <option value="all">All Types</option>
            <option value="policy_exception">Policy Exception</option>
            <option value="deadline_extension">Deadline Extension</option>
            <option value="approval_bypass">Approval Bypass</option>
          </select>
        </div>
      </div>

      {/* Full Table */}
      <div className={styles.section}>
        <h2>All Exceptions & Overrides ({filteredOverrides.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Override ID</th>
                <th>Case</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Overridden By</th>
                <th>Date</th>
                <th>Status</th>
                <th>Approver</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredOverrides.map(override => {
                const statusColor =
                  override.status === 'pending_approval' ? styles.pending :
                  override.status === 'approved' ? styles.approved :
                  styles.review;

                return (
                  <tr key={override.id} className={statusColor}>
                    <td className={styles.idCell}>{override.id}</td>
                    <td>{override.complaintId}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[override.overrideType.split('_')[0]]}`}>
                        {override.overrideType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{override.reason.substring(0, 40)}...</td>
                    <td>{override.overriddenBy.split('_')[1]}</td>
                    <td>{override.overrideDate.toLocaleDateString()}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[override.status]}`}>
                        {override.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>{override.approverName || 'Pending'}</td>
                    <td className={styles.riskCell}>
                      {override.riskAssessment.includes('Low') ? '🟢' : 
                       override.riskAssessment.includes('Medium') ? '🟡' : '🔴'}
                      Low
                    </td>
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
