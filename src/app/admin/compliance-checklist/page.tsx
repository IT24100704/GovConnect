'use client';

import { useState, useEffect } from 'react';
import { generateComplianceRecords, mockComplianceCheckItems } from '@/data/mockDataGovernance';
import { calculateComplianceRate, getCommonNonComplianceReasons } from '@/lib/governanceAnalytics';
import { ComplianceCheckRecord } from '@/lib/types';
import styles from './compliance-checklist.module.css';

export default function ComplianceChecklistPage() {
  const [records, setRecords] = useState<ComplianceCheckRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ComplianceCheckRecord[]>([]);
  const [filterCompliance, setFilterCompliance] = useState<'all' | 'compliant' | 'non-compliant'>('all');

  useEffect(() => {
    const data = generateComplianceRecords(15);
    setRecords(data);
  }, []);

  useEffect(() => {
    let filtered = records;

    if (filterCompliance === 'compliant') {
      filtered = filtered.filter(r => r.overallCompliance);
    } else if (filterCompliance === 'non-compliant') {
      filtered = filtered.filter(r => !r.overallCompliance);
    }

    setFilteredRecords(filtered);
  }, [records, filterCompliance]);

  const complianceRate = calculateComplianceRate(records);
  const nonCompliantReasons = getCommonNonComplianceReasons(records);
  const pendingApprovals = records.filter(r => r.approvalRequired && !r.approvedBy).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Compliance Checklist & Policy Validation</h1>
        <p>Mandatory legal/policy checks before approval is allowed</p>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${complianceRate < 80 ? styles.warning : ''}`}>
          <div className={styles.label}>Overall Compliance Rate</div>
          <div className={styles.value}>{complianceRate}%</div>
          <div className={styles.subtitle}>Target: 95%</div>
        </div>
        <div className={`${styles.kpiCard} ${pendingApprovals > 5 ? styles.critical : ''}`}>
          <div className={styles.label}>Pending Approvals</div>
          <div className={styles.value}>{pendingApprovals}</div>
          <div className={styles.subtitle}>Non-compliant items awaiting approval</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Compliant Cases</div>
          <div className={styles.value}>{records.filter(r => r.overallCompliance).length}</div>
          <div className={styles.subtitle}>Out of {records.length}</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Required Checklist Items</div>
          <div className={styles.value}>{mockComplianceCheckItems.length}</div>
          <div className={styles.subtitle}>All mandatory policies</div>
        </div>
      </div>

      {/* Checklist Items Reference */}
      <div className={styles.section}>
        <h2>Mandatory Compliance Items</h2>
        <div className={styles.checklistReference}>
          {mockComplianceCheckItems.map(item => (
            <div key={item.id} className={`${styles.checkItem} ${styles[item.category]}`}>
              <div className={styles.checkItemHeader}>
                <span className={styles.checkName}>{item.name}</span>
                <span className={`${styles.categoryBadge} ${styles[item.category]}`}>
                  {item.category.toUpperCase()}
                </span>
              </div>
              <div className={styles.checkDesc}>{item.description}</div>
              <div className={styles.checkRef}>Policy: {item.policyReference}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Non-Compliance Reasons */}
      {Object.keys(nonCompliantReasons).length > 0 && (
        <div className={styles.section}>
          <h2>Common Non-Compliance Reasons</h2>
          <div className={styles.reasonsList}>
            {Object.entries(nonCompliantReasons).map(([reason, count]) => (
              <div key={reason} className={styles.reasonItem}>
                <span className={styles.reasonName}>{reason}</span>
                <div className={styles.reasonBar}>
                  <div
                    className={styles.reasonFill}
                    style={{ width: `${(count / Math.max(...Object.values(nonCompliantReasons))) * 100}%` }}
                  />
                </div>
                <span className={styles.reasonCount}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Filter:</label>
          <select value={filterCompliance} onChange={e => setFilterCompliance(e.target.value as any)}>
            <option value="all">All Records</option>
            <option value="compliant">Compliant</option>
            <option value="non-compliant">Non-Compliant</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className={styles.section}>
        <h2>Compliance Records ({filteredRecords.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Status</th>
                <th>Financial</th>
                <th>Legal</th>
                <th>Procedural</th>
                <th>Safety</th>
                <th>Overall</th>
                <th>Checked By</th>
                <th>Approval Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => {
                const checks = {
                  financial: record.checkResults.find(c => c.itemId === 'chk_001')?.passed,
                  legal: record.checkResults.find(c => c.itemId === 'chk_002')?.passed,
                  procedural: record.checkResults.find(c => c.itemId === 'chk_003')?.passed,
                  safety: record.checkResults.find(c => c.itemId === 'chk_004')?.passed,
                };

                return (
                  <tr key={record.id} className={!record.overallCompliance ? styles.nonCompliantRow : ''}>
                    <td className={styles.caseId}>{record.complaintId}</td>
                    <td>
                      <span className={`${styles.badge} ${record.overallCompliance ? styles.compliant : styles.nonCompliant}`}>
                        {record.overallCompliance ? 'COMPLIANT' : 'NON-COMPLIANT'}
                      </span>
                    </td>
                    <td className={styles.checkCell}>
                      {checks.financial ? '✓' : '✗'}
                    </td>
                    <td className={styles.checkCell}>
                      {checks.legal ? '✓' : '✗'}
                    </td>
                    <td className={styles.checkCell}>
                      {checks.procedural ? '✓' : '✗'}
                    </td>
                    <td className={styles.checkCell}>
                      {checks.safety !== undefined ? (checks.safety ? '✓' : '✗') : 'N/A'}
                    </td>
                    <td>
                      <span className={`${styles.badge} ${record.overallCompliance ? styles.passed : styles.failed}`}>
                        {record.overallCompliance ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                    <td>{record.checkResults[0]?.checkedBy.split('_')[1] || 'N/A'}</td>
                    <td>
                      {record.approvalRequired ? (
                        <span className={`${styles.approveBadge} ${record.approvedBy ? styles.approved : styles.pending}`}>
                          {record.approvedBy ? 'APPROVED' : 'PENDING'}
                        </span>
                      ) : (
                        <span className={styles.notRequired}>N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Approvals Detail */}
      {pendingApprovals > 0 && (
        <div className={styles.section}>
          <h2>Pending Approval Details</h2>
          <div className={styles.pendingList}>
            {records
              .filter(r => r.approvalRequired && !r.approvedBy)
              .map(record => (
                <div key={record.id} className={styles.pendingItem}>
                  <div className={styles.pendingHeader}>
                    <span className={styles.caseId}>{record.complaintId}</span>
                    <span className={styles.urgencyBadge}>REQUIRES SENIOR APPROVAL</span>
                  </div>
                  <div className={styles.pendingReasons}>
                    {record.nonComplianceReasons.map((reason, idx) => (
                      <div key={idx} className={styles.reason}>⚠️ {reason}</div>
                    ))}
                  </div>
                  <button className={styles.approveBtn}>Review & Approve</button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
