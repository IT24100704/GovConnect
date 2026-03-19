'use client';

import { useState, useEffect } from 'react';
import { generateKPISnapshots, generateExecutiveDashboardMetrics, generateSLATrackers, generateRiskScores, generateEscalations, generateAlerts } from '@/data/mockDataGovernance';
import { calculateSLABreachRate, generateExecutiveSummary, calculateTrend } from '@/lib/governanceAnalytics';
import { KPISnapshot, ExecutiveDashboardMetrics } from '@/lib/types';
import styles from './executive-dashboard.module.css';

export default function ExecutiveDashboardPage() {
  const [metrics, setMetrics] = useState<ExecutiveDashboardMetrics | null>(null);
  const [kpiHistory, setKpiHistory] = useState<KPISnapshot[]>([]);
  const [summary, setSummary] = useState<string[]>([]);

  useEffect(() => {
    const metricsData = generateExecutiveDashboardMetrics();
    const kpiData = generateKPISnapshots(30);
    
    setMetrics(metricsData);
    setKpiHistory(kpiData);
    setSummary(generateExecutiveSummary(metricsData));
  }, []);

  if (!metrics) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const slaBreachTrend = calculateTrend(kpiHistory, 'slaBreachRate');
  const complianceTrend = calculateTrend(kpiHistory, 'overallComplianceScore');
  const riskTrend = calculateTrend(kpiHistory, 'riskyItemsBacklog');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Actionable Governance Dashboard</h1>
        <p>Executive Layer - Key Indicators for Decision-Ready Accountability View</p>
      </div>

      {/* Executive Summary */}
      <div className={styles.summarySection}>
        <h2>Executive Summary</h2>
        <div className={styles.summaryList}>
          {summary.map((item, idx) => (
            <div 
              key={idx} 
              className={
                item.includes('Critical') || item.includes('⚠️') ? styles.critical :
                item.includes('✅') ? styles.positive :
                styles.neutral
              }
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Top Panel: Key Indicators */}
      <div className={styles.keyIndicatorsGrid}>
        <div className={`${styles.indicator} ${metrics.slaBreachRate > 20 ? styles.critical : styles.healthy}`}>
          <div className={styles.indicatorLabel}>SLA Breach Rate</div>
          <div className={styles.indicatorValue}>{metrics.slaBreachRate.toFixed(1)}%</div>
          <div className={styles.indicatorTarget}>Target: &lt; 20%</div>
          <div className={`${styles.trend} ${styles[slaBreachTrend]}`}>
            {slaBreachTrend === 'improving' ? '📈 Improving' : slaBreachTrend === 'stable' ? '➡️ Stable' : '📉 Declining'}
          </div>
        </div>

        <div className={`${styles.indicator} ${metrics.riskBacklog > 30 ? styles.warning : styles.healthy}`}>
          <div className={styles.indicatorLabel}>Risk Backlog</div>
          <div className={styles.indicatorValue}>{metrics.riskBacklog}</div>
          <div className={styles.indicatorUnit}>high-risk items</div>
          <div className={`${styles.trend} ${styles[riskTrend]}`}>
            {riskTrend === 'improving' ? '📈 Improving' : riskTrend === 'stable' ? '➡️ Stable' : '📉 Declining'}
          </div>
        </div>

        <div className={`${styles.indicator} ${metrics.pendingEscalations > 15 ? styles.warning : styles.healthy}`}>
          <div className={styles.indicatorLabel}>Pending Escalations</div>
          <div className={styles.indicatorValue}>{metrics.pendingEscalations}</div>
          <div className={styles.indicatorUnit}>unresolved items</div>
          <div className={styles.healthStatus}>⏳ Requires Response</div>
        </div>

        <div className={`${styles.indicator} ${metrics.auditFlags > 5 ? styles.critical : styles.healthy}`}>
          <div className={styles.indicatorLabel}>Audit Flags</div>
          <div className={styles.indicatorValue}>{metrics.auditFlags}</div>
          <div className={styles.indicatorUnit}>flagged for review</div>
          <div className={styles.healthStatus}>🔍 Being Investigated</div>
        </div>

        <div className={`${styles.indicator} ${metrics.complianceScore < 85 ? styles.warning : styles.healthy}`}>
          <div className={styles.indicatorLabel}>Compliance Score</div>
          <div className={styles.indicatorValue}>{metrics.complianceScore}%</div>
          <div className={styles.indicatorTarget}>Target: 95%</div>
          <div className={`${styles.trend} ${styles[complianceTrend]}`}>
            {complianceTrend === 'improving' ? '📈 Improving' : complianceTrend === 'stable' ? '➡️ Stable' : '📉 Declining'}
          </div>
        </div>

        <div className={`${styles.indicator} ${metrics.criticalAlerts > 5 ? styles.critical : styles.healthy}`}>
          <div className={styles.indicatorLabel}>Critical Alerts</div>
          <div className={styles.indicatorValue}>{metrics.criticalAlerts}</div>
          <div className={styles.indicatorUnit}>active alerts</div>
          <div className={metrics.criticalAlerts > 0 ? styles.actionRequired : styles.allGood}>
            {metrics.criticalAlerts > 0 ? '⚠️ Action Required' : '✅ All Clear'}
          </div>
        </div>
      </div>

      {/* Unmet Targets */}
      {metrics.unmetTargets.length > 0 && (
        <div className={styles.section}>
          <h2>Unmet Targets - Requiring Executive Attention</h2>
          <div className={styles.targetsList}>
            {metrics.unmetTargets.map((target, idx) => (
              <div key={idx} className={styles.targetItem}>
                <span className={styles.bulletIcon}>📋</span>
                <span className={styles.targetText}>{target}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Analysis */}
      <div className={styles.section}>
        <h2>Overall Performance Trend</h2>
        <div className={styles.trendCard}>
          <div className={`${styles.trendIndicator} ${styles[metrics.trend]}`}>
            {metrics.trend === 'improving' ? '📈' : metrics.trend === 'stable' ? '➡️' : '📉'}
          </div>
          <div className={styles.trendText}>
            {metrics.trend === 'improving' && 'Governance metrics are improving. Continue monitoring and maintaining current initiatives.'}
            {metrics.trend === 'stable' && 'Governance metrics remain stable. Monitor closely for any changes in trends.'}
            {metrics.trend === 'declining' && 'Governance metrics are declining. Immediate action required to address deteriorating performance.'}
          </div>
        </div>
      </div>

      {/* Decision-Ready Actions */}
      <div className={styles.section}>
        <h2>Recommended Actions for Leadership</h2>
        <div className={styles.actionsList}>
          {metrics.slaBreachRate > 20 && (
            <div className={styles.actionItem}>
              <span className={styles.priority}>HIGH</span>
              <span className={styles.action}>Address SLA breach rate through resource allocation review</span>
              <button className={styles.actionBtn}>Review Details</button>
            </div>
          )}
          {metrics.riskBacklog > 30 && (
            <div className={styles.actionItem}>
              <span className={styles.priority}>HIGH</span>
              <span className={styles.action}>Prioritize high-risk items for immediate escalation</span>
              <button className={styles.actionBtn}>View Risk Heatmap</button>
            </div>
          )}
          {metrics.complianceScore < 85 && (
            <div className={styles.actionItem}>
              <span className={styles.priority}>MEDIUM</span>
              <span className={styles.action}>Launch compliance improvement program</span>
              <button className={styles.actionBtn}>View Compliance</button>
            </div>
          )}
          {metrics.auditFlags > 5 && (
            <div className={styles.actionItem}>
              <span className={styles.priority}>MEDIUM</span>
              <span className={styles.action}>Schedule audit review meeting</span>
              <button className={styles.actionBtn}>Audit Details</button>
            </div>
          )}
          {metrics.pendingEscalations > 15 && (
            <div className={styles.actionItem}>
              <span className={styles.priority}>HIGH</span>
              <span className={styles.action}>Allocate resources to resolve pending escalations</span>
              <button className={styles.actionBtn}>Escalation Queue</button>
            </div>
          )}
          {metrics.slaBreachRate < 15 && metrics.complianceScore > 90 && (
            <div className={styles.actionItem}>
              <span className={styles.priority}>LOW</span>
              <span className={styles.action}>Maintain current governance standards</span>
              <button className={`${styles.actionBtn} ${styles.success}`}>Acknowledge</button>
            </div>
          )}
        </div>
      </div>

      {/* Period Information */}
      <div className={styles.footer}>
        <div className={styles.periodInfo}>
          <span>Reporting Period:</span>
          <strong>{metrics.period.startDate.toLocaleDateString()} - {metrics.period.endDate.toLocaleDateString()}</strong>
        </div>
        <div className={styles.timestamp}>
          Last Updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
