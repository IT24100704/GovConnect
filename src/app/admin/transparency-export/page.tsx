'use client';

import { useState, useEffect } from 'react';
import { TransparencyExport, DecisionLog, ComplianceCheckRecord, Escalation } from '@/lib/types';
import { generateTransparencyExport, generateDecisionLogs, generateComplianceRecords, generateEscalations } from '@/data/mockDataGovernance';
import styles from './transparency-export.module.css';

interface ExportRecord {
  month: string;
  date: Date;
  status: 'completed' | 'pending' | 'processing';
  format: 'PDF' | 'CSV' | 'JSON';
  decisionCount: number;
  complianceCount: number;
}

export default function TransparencyExportPage() {
  const [exportData, setExportData] = useState<TransparencyExport | null>(null);
  const [exportHistoryList, setExportHistoryList] = useState<ExportRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'decisions' | 'compliance' | 'escalations' | 'kpis'>('decisions');
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'CSV' | 'JSON'>('PDF');
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' });
  const [includeCompliance, setIncludeCompliance] = useState(true);
  const [includeDecisions, setIncludeDecisions] = useState(true);
  const [includeEscalations, setIncludeEscalations] = useState(true);
  const [includeKPIs, setIncludeKPIs] = useState(true);

  useEffect(() => {
    const generated = generateTransparencyExport();
    setExportData(generated);

    // Generate export history
    const history: ExportRecord[] = [
      {
        month: 'November 2024',
        date: new Date('2024-11-30'),
        status: 'completed',
        format: 'PDF',
        decisionCount: 28,
        complianceCount: 18,
      },
      {
        month: 'October 2024',
        date: new Date('2024-10-31'),
        status: 'completed',
        format: 'CSV',
        decisionCount: 24,
        complianceCount: 16,
      },
      {
        month: 'September 2024',
        date: new Date('2024-09-30'),
        status: 'completed',
        format: 'JSON',
        decisionCount: 26,
        complianceCount: 14,
      },
      {
        month: 'August 2024',
        date: new Date('2024-08-31'),
        status: 'pending',
        format: 'PDF',
        decisionCount: 22,
        complianceCount: 12,
      },
    ];
    setExportHistoryList(history);
  }, []);

  const handleExport = () => {
    if (!exportData) return;

    // Simulate export generation
    const timestamp = new Date().toLocaleString();
    const fileName = `governance-export-${new Date().toISOString()}.${selectedFormat.toLowerCase()}`;

    const content = {
      exportDate: timestamp,
      dateRange,
      format: selectedFormat,
      data: {
        ...(includeDecisions && { decisions: exportData.decisionLogs.length }),
        ...(includeCompliance && { compliance: exportData.complianceChecks.length }),
        ...(includeEscalations && { escalations: exportData.escalations.length }),
        ...(includeKPIs && { kpis: exportData.kpiSnapshots.length }),
      },
    };

    // In a real application, this would generate and download the file
    console.log('Exporting:', fileName, content);
    alert(`Export ready: ${fileName}\nFormat: ${selectedFormat}\nTimestamp: ${timestamp}`);
  };

  if (!exportData) return <div>Loading...</div>;

  const decisionCount = exportData.decisionLogs.length;
  const complianceCount = exportData.complianceChecks.length;
  const escalationCount = exportData.escalations.length;
  const totalRecords = decisionCount + complianceCount + escalationCount;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Transparency Export Center</h1>
        <p>One-click export for audits: monthly reports, decision logs, KPI snapshots, compliance evidence</p>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Decision Logs</div>
          <div className={styles.value}>{decisionCount}</div>
          <div className={styles.subtitle}>Audit-ready records</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.label}>Compliance Records</div>
          <div className={styles.value}>{complianceCount}</div>
          <div className={styles.subtitle}>Check evidence</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.label}>Escalations</div>
          <div className={styles.value}>{escalationCount}</div>
          <div className={styles.subtitle}>Tracking data</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.label}>Total Records</div>
          <div className={styles.value}>{totalRecords}</div>
          <div className={styles.subtitle}>Available for export</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Export Configuration</h2>
        <div className={styles.exportConfig}>
          <div className={styles.configGroup}>
            <label htmlFor="format">Export Format:</label>
            <select id="format" value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value as any)}>
              <option value="PDF">PDF (Print-Ready)</option>
              <option value="CSV">CSV (Spreadsheet)</option>
              <option value="JSON">JSON (Data Integration)</option>
            </select>
          </div>

          <div className={styles.configGroup}>
            <label htmlFor="startDate">Date Range:</label>
            <div className={styles.dateRange}>
              <input
                type="date"
                id="startDate"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <span>to</span>
              <input
                type="date"
                id="endDate"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          <div className={styles.configGroup}>
            <label>Include in Export:</label>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={includeDecisions}
                  onChange={(e) => setIncludeDecisions(e.target.checked)}
                />
                Decision Logs ({decisionCount} records)
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={includeCompliance}
                  onChange={(e) => setIncludeCompliance(e.target.checked)}
                />
                Compliance Records ({complianceCount} records)
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={includeEscalations}
                  onChange={(e) => setIncludeEscalations(e.target.checked)}
                />
                Escalations ({escalationCount} records)
              </label>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={includeKPIs}
                  onChange={(e) => setIncludeKPIs(e.target.checked)}
                />
                KPI Snapshots ({exportData.kpiSnapshots.length} records)
              </label>
            </div>
          </div>

          <button className={styles.exportButton} onClick={handleExport}>
            📥 Generate & Download Export
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Preview Data</h2>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'decisions' ? styles.active : ''}`}
            onClick={() => setActiveTab('decisions')}
          >
            Decision Logs ({decisionCount})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'compliance' ? styles.active : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            Compliance ({complianceCount})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'escalations' ? styles.active : ''}`}
            onClick={() => setActiveTab('escalations')}
          >
            Escalations ({escalationCount})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'kpis' ? styles.active : ''}`}
            onClick={() => setActiveTab('kpis')}
          >
            KPIs ({exportData.kpiSnapshots.length})
          </button>
        </div>

        <div className={styles.previewContent}>
          {activeTab === 'decisions' && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Decision ID</th>
                    <th>Complaint ID</th>
                    <th>Officer</th>
                    <th>Decision</th>
                    <th>Timestamp</th>
                    <th>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  {exportData.decisionLogs.slice(0, 10).map((log) => (
                    <tr key={log.id}>
                      <td className={styles.idCell}>{log.id}</td>
                      <td>{log.complaintId}</td>
                      <td>{log.officerId}</td>
                      <td>{log.decision.substring(0, 30)}...</td>
                      <td>{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td>
                        <span className={log.complianceStatus ? styles.compliant : styles.nonCompliant}>
                          {log.complianceStatus ? 'Compliant' : 'Non-Compliant'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.showMore}>Showing 10 of {decisionCount} records</div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Compliance ID</th>
                    <th>Complaint ID</th>
                    <th>Check Items</th>
                    <th>Overall Status</th>
                    <th>Approved</th>
                    <th>Approval Date</th>
                  </tr>
                </thead>
                <tbody>
                  {exportData.complianceChecks.slice(0, 10).map((comp) => (
                    <tr key={comp.id}>
                      <td className={styles.idCell}>{comp.id}</td>
                      <td>{comp.complaintId}</td>
                      <td>{comp.complaintCheckItems.length} items</td>
                      <td>
                        <span className={comp.overallCompliance ? styles.compliant : styles.nonCompliant}>
                          {comp.overallCompliance ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className={styles.statusCell}>{comp.approvedBy ? 'Yes' : 'No'}</td>
                      <td>{comp.approvalDate ? new Date(comp.approvalDate).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.showMore}>Showing 10 of {complianceCount} records</div>
            </div>
          )}

          {activeTab === 'escalations' && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Escalation ID</th>
                    <th>Complaint ID</th>
                    <th>Level</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {exportData.escalations.slice(0, 10).map((esc) => (
                    <tr key={esc.id}>
                      <td className={styles.idCell}>{esc.id}</td>
                      <td>{esc.complaintId}</td>
                      <td>
                        <span className={styles.levelBadge}>L{esc.escalationLevel}</span>
                      </td>
                      <td>{esc.reason.replace(/_/g, ' ')}</td>
                      <td>
                        <span className={esc.status === 'resolved' ? styles.compliant : styles.nonCompliant}>
                          {esc.status}
                        </span>
                      </td>
                      <td>{new Date(esc.escalatedDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.showMore}>Showing 10 of {escalationCount} records</div>
            </div>
          )}

          {activeTab === 'kpis' && (
            <div className={styles.kpiContent}>
              <div className={styles.kpiSnapshot}>
                <h3>30-Day KPI Summary</h3>
                <div className={styles.metricsGrid}>
                  {exportData.kpiSnapshots.slice(0, 5).map((kpi, idx) => (
                    <div key={idx} className={styles.kpiMetric}>
                      <div className={styles.metricDate}>{new Date(kpi.date).toLocaleDateString()}</div>
                      <div className={styles.metricItem}>
                        <span>SLA Breach Rate:</span>
                        <span className={styles.value}>{kpi.slaBreachRate.toFixed(1)}%</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>Risk Backlog:</span>
                        <span className={styles.value}>{kpi.riskyItemsBacklog}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>Compliance Score:</span>
                        <span className={styles.value}>{kpi.overallComplianceScore}</span>
                      </div>
                      <div className={styles.metricItem}>
                        <span>Closure Time (days):</span>
                        <span className={styles.value}>{kpi.averageClosureTime.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Export History</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Export Date</th>
                <th>Status</th>
                <th>Format</th>
                <th>Records</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {exportHistoryList.map((record, idx) => (
                <tr key={idx}>
                  <td className={styles.monthCell}>{record.month}</td>
                  <td>{record.date.toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[record.status]}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.format}</td>
                  <td>
                    {record.decisionCount} decisions, {record.complianceCount} compliance
                  </td>
                  <td>
                    <button className={styles.actionBtn}>
                      {record.status === 'completed' ? '↓ Download' : '⏳ Generating...'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Audit Requirements Checklist</h2>
        <div className={styles.checklistGrid}>
          <div className={styles.checklistItem}>
            <input type="checkbox" id="check1" defaultChecked />
            <label htmlFor="check1">✓ Decision logs with timestamps and signatures</label>
          </div>
          <div className={styles.checklistItem}>
            <input type="checkbox" id="check2" defaultChecked />
            <label htmlFor="check2">✓ Compliance evidence and check records</label>
          </div>
          <div className={styles.checklistItem}>
            <input type="checkbox" id="check3" defaultChecked />
            <label htmlFor="check3">✓ Escalation tracking with level indicators</label>
          </div>
          <div className={styles.checklistItem}>
            <input type="checkbox" id="check4" defaultChecked />
            <label htmlFor="check4">✓ KPI snapshots for trend analysis</label>
          </div>
          <div className={styles.checklistItem}>
            <input type="checkbox" id="check5" defaultChecked />
            <label htmlFor="check5">✓ Audit trail with actor identification</label>
          </div>
          <div className={styles.checklistItem}>
            <input type="checkbox" id="check6" defaultChecked />
            <label htmlFor="check6">✓ Export metadata and integrity verification</label>
          </div>
        </div>
      </div>
    </div>
  );
}
