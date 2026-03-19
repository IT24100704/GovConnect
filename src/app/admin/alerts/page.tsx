'use client';

import { useState, useEffect } from 'react';
import { generateAlerts, generateAnomalyAlerts, mockAlertTriggers } from '@/data/mockDataGovernance';
import {
  calculateAlertSeverityDistribution,
  getUnresolvedAlerts,
  getOverdueAlerts
} from '@/lib/governanceAnalytics';
import { Alert, AnomalyAlert } from '@/lib/types';
import styles from './alerts.module.css';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [filterResolved, setFilterResolved] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');

  useEffect(() => {
    const alerts = generateAlerts(20);
    const anomalies = generateAnomalyAlerts(6);
    setAlerts(alerts);
    setAnomalies(anomalies);
  }, []);

  useEffect(() => {
    let filtered = alerts;

    if (filterResolved === 'unresolved') {
      filtered = filtered.filter(a => !a.resolved);
    } else if (filterResolved === 'resolved') {
      filtered = filtered.filter(a => a.resolved);
    }

    if (filterSeverity !== 'all') {
      filtered = filtered.filter(a => a.severity === filterSeverity);
    }

    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    setFilteredAlerts(filtered);
  }, [alerts, filterSeverity, filterResolved]);

  const severity = calculateAlertSeverityDistribution(alerts);
  const unresolved = getUnresolvedAlerts(alerts);
  const overdue = getOverdueAlerts(alerts, 24);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Early Warning Alerts</h1>
        <p>Alerts for anomalies: approval spikes, rejections, duplicates, and unusual patterns</p>
      </div>

      {/* Alert Summary */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${unresolved.length > 10 ? styles.critical : ''}`}>
          <div className={styles.label}>Unresolved Alerts</div>
          <div className={styles.value}>{unresolved.length}</div>
          <div className={styles.subtitle}>Requiring action</div>
        </div>
        <div className={`${styles.kpiCard} ${overdue.length > 0 ? styles.critical : ''}`}>
          <div className={styles.label}>Overdue (24h+)</div>
          <div className={styles.value}>{overdue.length}</div>
          <div className={styles.subtitle}>Exceeded response time</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Critical Severity</div>
          <div className={styles.value}>{severity.critical}</div>
          <div className={styles.subtitle}>High priority</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Active Triggers</div>
          <div className={styles.value}>{mockAlertTriggers.filter(t => t.enabled).length}</div>
          <div className={styles.subtitle}>Monitoring enabled</div>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className={styles.section}>
        <h2>Alert Severity Distribution</h2>
        <div className={styles.severityGrid}>
          <div className={`${styles.severityCard} ${styles.critical}`}>
            <div className={styles.severityLabel}>CRITICAL</div>
            <div className={styles.severityValue}>{severity.critical}</div>
            <div className={styles.severityDesc}>Immediate action required</div>
          </div>
          <div className={`${styles.severityCard} ${styles.warning}`}>
            <div className={styles.severityLabel}>WARNING</div>
            <div className={styles.severityValue}>{severity.warning}</div>
            <div className={styles.severityDesc}>Monitor closely</div>
          </div>
          <div className={`${styles.severityCard} ${styles.info}`}>
            <div className={styles.severityLabel}>INFO</div>
            <div className={styles.severityValue}>{severity.info}</div>
            <div className={styles.severityDesc}>For information</div>
          </div>
        </div>
      </div>

      {/* Anomaly Alerts */}
      {anomalies.length > 0 && (
        <div className={styles.section}>
          <h2>🚨 Detected Anomalies</h2>
          <div className={styles.anomalyList}>
            {anomalies.map(anomaly => (
              <div key={anomaly.id} className={`${styles.anomalyCard} ${styles.critical}`}>
                <div className={styles.anomalyHeader}>
                  <span className={styles.anomalyId}>{anomaly.id}</span>
                  <span className={styles.anomalyType}>
                    {anomaly.anomalyType.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
                <div className={styles.anomalyMessage}>{anomaly.message}</div>
                <div className={styles.anomalyContext}>
                  {Object.entries(anomaly.context).map(([key, value]) => (
                    <div key={key} className={styles.contextItem}>
                      <span className={styles.contextLabel}>{key}:</span>
                      <span className={styles.contextValue}>{String(value)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.anomalyActions}>
                  <button className={styles.investigateBtn}>Investigate</button>
                  <button className={styles.dismissBtn}>Acknowledge</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Severity:</label>
          <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value as any)}>
            <option value="all">All</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select value={filterResolved} onChange={e => setFilterResolved(e.target.value as any)}>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className={styles.section}>
        <h2>All Alerts ({filteredAlerts.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Alert ID</th>
                <th>Message</th>
                <th>Severity</th>
                <th>Entity</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map(alert => (
                <tr
                  key={alert.id}
                  className={
                    alert.severity === 'critical' ? styles.criticalRow :
                    alert.severity === 'warning' ? styles.warningRow : ''
                  }
                >
                  <td className={styles.idCell}>{alert.id}</td>
                  <td>{alert.message}</td>
                  <td>
                    <span className={`${styles.severityBadge} ${styles[alert.severity]}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </td>
                  <td>{alert.relatedEntity.id}</td>
                  <td>{alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString()}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[alert.resolved ? 'resolved' : 'unresolved']}`}>
                      {alert.resolved ? 'RESOLVED' : 'OPEN'}
                    </span>
                  </td>
                  <td>
                    {!alert.resolved && (
                      <button className={styles.actionBtn}>Take Action</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Triggers */}
      <div className={styles.section}>
        <h2>Active Alert Triggers</h2>
        <div className={styles.triggerList}>
          {mockAlertTriggers.map(trigger => (
            <div key={trigger.id} className={`${styles.triggerItem} ${trigger.enabled ? styles.enabled : styles.disabled}`}>
              <div className={styles.triggerHeader}>
                <span className={styles.triggerName}>{trigger.name}</span>
                <span className={`${styles.triggerBadge} ${styles[trigger.severity]}`}>
                  {trigger.severity.toUpperCase()}
                </span>
              </div>
              <div className={styles.triggerCondition}>{trigger.condition}</div>
              <div className={styles.triggerStatus}>
                {trigger.enabled ? '✓ Enabled' : '✗ Disabled'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
