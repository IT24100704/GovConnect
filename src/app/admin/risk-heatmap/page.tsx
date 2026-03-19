'use client';

import { useState, useEffect } from 'react';
import { generateRiskScores } from '@/data/mockDataGovernance';
import { mockComplaints } from '@/data/mockData';
import { generateEscalations } from '@/data/mockDataGovernance';
import { buildRiskHeatmap, getRiskDistribution, getHighRiskItems } from '@/lib/governanceAnalytics';
import { RiskScore, RiskHeatmapEntry, Complaint } from '@/lib/types';
import styles from './risk-heatmap.module.css';

export default function RiskHeatmapPage() {
  const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
  const [heatmapEntries, setHeatmapEntries] = useState<RiskHeatmapEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<RiskHeatmapEntry[]>([]);
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'days' | 'escalations'>('risk');

  useEffect(() => {
    const scores = generateRiskScores(20);
    const escalations = generateEscalations(8);
    const complaints = mockComplaints.slice(0, 20);

    setRiskScores(scores);

    const heatmap = buildRiskHeatmap(complaints as any, scores, escalations);
    setHeatmapEntries(heatmap);
  }, []);

  useEffect(() => {
    let filtered = heatmapEntries;

    if (riskFilter !== 'all') {
      filtered = heatmapEntries.filter(entry => entry.riskScore.overallRiskLevel === riskFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'risk') {
        const avgA = (a.riskScore.fraudRisk + a.riskScore.complianceRisk + a.riskScore.budgetImpact + a.riskScore.urgencyScore) / 4;
        const avgB = (b.riskScore.fraudRisk + b.riskScore.complianceRisk + b.riskScore.budgetImpact + b.riskScore.urgencyScore) / 4;
        return avgB - avgA;
      } else if (sortBy === 'days') {
        return b.daysOpen - a.daysOpen;
      } else {
        return b.escalationCount - a.escalationCount;
      }
    });

    setFilteredEntries(filtered);
  }, [heatmapEntries, riskFilter, sortBy]);

  const distribution = getRiskDistribution(riskScores);
  const highRiskItems = getHighRiskItems(riskScores, 5);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Risk Heatmap</h1>
        <p>Score cases/requests by fraud, compliance risk, budget impact, and urgency</p>
      </div>

      {/* Risk Distribution */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.critical}`}>
          <div className={styles.label}>Critical Risk</div>
          <div className={styles.value}>{distribution.critical}</div>
          <div className={styles.subtitle}>Cases requiring immediate action</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.high}`}>
          <div className={styles.label}>High Risk</div>
          <div className={styles.value}>{distribution.high}</div>
          <div className={styles.subtitle}>Active monitoring needed</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.medium}`}>
          <div className={styles.label}>Medium Risk</div>
          <div className={styles.value}>{distribution.medium}</div>
          <div className={styles.subtitle}>Routine oversight</div>
        </div>
        <div className={`${styles.kpiCard} ${styles.low}`}>
          <div className={styles.label}>Low Risk</div>
          <div className={styles.value}>{distribution.low}</div>
          <div className={styles.subtitle}>Standard processing</div>
        </div>
      </div>

      {/* Top High Risk Items */}
      {highRiskItems.length > 0 && (
        <div className={styles.section}>
          <h2>Top High-Risk Items</h2>
          <div className={styles.riskItemsGrid}>
            {highRiskItems.slice(0, 5).map(item => {
              const avg = (item.fraudRisk + item.complianceRisk + item.budgetImpact + item.urgencyScore) / 4;
              return (
                <div key={item.complaintId} className={`${styles.riskCard} ${styles[item.overallRiskLevel]}`}>
                  <div className={styles.riskCardHeader}>
                    <span className={styles.caseId}>{item.complaintId}</span>
                    <span className={`${styles.riskBadge} ${styles[item.overallRiskLevel]}`}>
                      {item.overallRiskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className={styles.riskScore}>
                    <div className={styles.scoreLabel}>Overall Risk Score</div>
                    <div className={styles.scoreValue}>{Math.round(avg)}%</div>
                  </div>
                  <div className={styles.riskFactors}>
                    {item.factors.length > 0 ? (
                      item.factors.map((factor, idx) => (
                        <div key={idx} className={styles.factor}>⚠️ {factor}</div>
                      ))
                    ) : (
                      <div className={styles.factor}>No specific risk factors</div>
                    )}
                  </div>
                  <div className={styles.scoreBreakdown}>
                    <div>Fraud: <strong>{item.fraudRisk}%</strong></div>
                    <div>Compliance: <strong>{item.complianceRisk}%</strong></div>
                    <div>Budget: <strong>{item.budgetImpact}%</strong></div>
                    <div>Urgency: <strong>{item.urgencyScore}%</strong></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className={styles.controls}>
        <div className={styles.filterGroup}>
          <label>Filter by Risk Level:</label>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value as any)}>
            <option value="all">All Cases</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="risk">Risk Score</option>
            <option value="days">Days Open</option>
            <option value="escalations">Escalations</option>
          </select>
        </div>
      </div>

      {/* Detailed Risk Matrix */}
      <div className={styles.section}>
        <h2>Risk Assessment Matrix ({filteredEntries.length} cases)</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Risk Level</th>
                <th>Fraud Risk</th>
                <th>Compliance Risk</th>
                <th>Budget Impact</th>
                <th>Urgency</th>
                <th>Days Open</th>
                <th>Escalations</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => {
                const avg = (entry.riskScore.fraudRisk + entry.riskScore.complianceRisk + entry.riskScore.budgetImpact + entry.riskScore.urgencyScore) / 4;
                return (
                  <tr
                    key={entry.complaintId}
                    className={styles[`risk-${entry.riskScore.overallRiskLevel}`]}
                  >
                    <td className={styles.caseCell}>{entry.complaintId}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[entry.riskScore.overallRiskLevel]}`}>
                        {entry.riskScore.overallRiskLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.riskValue}>{entry.riskScore.fraudRisk}%</td>
                    <td className={styles.riskValue}>{entry.riskScore.complianceRisk}%</td>
                    <td className={styles.riskValue}>{entry.riskScore.budgetImpact}%</td>
                    <td className={styles.riskValue}>{entry.riskScore.urgencyScore}%</td>
                    <td>{entry.daysOpen} days</td>
                    <td className={entry.escalationCount > 2 ? styles.highEscalation : ''}>
                      {entry.escalationCount}
                    </td>
                    <td>
                      {entry.riskScore.overallRiskLevel === 'critical' && (
                        <button className={styles.actionBtn}>Escalate</button>
                      )}
                      {entry.riskScore.overallRiskLevel === 'high' && (
                        <button className={styles.actionBtnWarning}>Review</button>
                      )}
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
