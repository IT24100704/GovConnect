'use client';

import { useState } from 'react';
import styles from './impact-metrics.module.css';

export default function ImpactMetricsPage() {
  const [period, setPeriod] = useState('month');

  const metrics = {
    totalComplaints: 156,
    resolutionRate: 92.3,
    avgResolutionTime: 6.2,
    avgSatisfactionScore: 4.1,
    recurrenceRate: 8.5,
    serviceQualityAverage: 8.2,
    coverageAreas: 12,
  };

  const recentResolutions = [
    { id: 'CMP001', citizen: 'A. Perera', issue: 'Water Supply', satisfaction: 5, quality: 'Excellent', days: 3 },
    { id: 'CMP002', citizen: 'B. Silva', issue: 'Road Repair', satisfaction: 4, quality: 'Good', days: 7 },
    { id: 'CMP003', citizen: 'C. Fernando', issue: 'Garbage Disposal', satisfaction: 3, quality: 'Fair', days: 5 },
    { id: 'CMP004', citizen: 'D. Jayasuriya', issue: 'Street Light', satisfaction: 5, quality: 'Excellent', days: 2 },
    { id: 'CMP005', citizen: 'E. Mendis', issue: 'Permit Issue', satisfaction: 4, quality: 'Good', days: 8 },
  ];

  const satisfactionTrend = [65, 70, 72, 75, 78, 80, 82, 85, 81, 79, 83, 84].map((val, i) => ({
    month: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i],
    score: val,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Public-Service Impact Metrics</h1>
        <p>Track citizen-facing outcomes: resolution time, complaint recurrence, satisfaction, service coverage</p>
      </div>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Resolution Rate</div>
          <div className={styles.value}>{metrics.resolutionRate}%</div>
          <div className={styles.subtitle}>Complaints resolved successfully</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Avg Resolution Time</div>
          <div className={styles.value}>{metrics.avgResolutionTime} days</div>
          <div className={styles.subtitle}>Target: 5 days</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Citizen Satisfaction</div>
          <div className={styles.value}>{metrics.avgSatisfactionScore}/5.0</div>
          <div className={styles.subtitle}>Average rating</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Recurrence Rate</div>
          <div className={styles.value}>{metrics.recurrenceRate}%</div>
          <div className={styles.subtitle}>Repeated complaints</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Service Quality</div>
          <div className={styles.value}>{metrics.serviceQualityAverage}/10</div>
          <div className={styles.subtitle}>Overall rating</div>
        </div>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Geographic Coverage</div>
          <div className={styles.value}>{metrics.coverageAreas}</div>
          <div className={styles.subtitle}>Districts served</div>
        </div>
      </div>

      {/* Satisfaction Trend */}
      <div className={styles.section}>
        <h2>Citizen Satisfaction Trend (Last 12 Months)</h2>
        <div className={styles.chart}>
          <div className={styles.chartBars}>
            {satisfactionTrend.map((item, idx) => (
              <div key={idx} className={styles.barContainer}>
                <div className={styles.bar} style={{ height: `${(item.score / 100) * 200}px`, background: item.score > 80 ? '#28a745' : item.score > 70 ? '#ffc107' : '#dc3545' }} />
                <div className={styles.barLabel}>{item.month}</div>
              </div>
            ))}
          </div>
          <div className={styles.chartAxis}>0% ← Satisfaction Score → 100%</div>
        </div>
      </div>

      {/* Recent Resolutions */}
      <div className={styles.section}>
        <h2>Recent Complaint Resolutions ({recentResolutions.length})</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Citizen</th>
                <th>Issue Type</th>
                <th>Satisfaction</th>
                <th>Quality</th>
                <th>Days to Resolve</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              {recentResolutions.map(resolution => (
                <tr key={resolution.id}>
                  <td className={styles.caseId}>{resolution.id}</td>
                  <td>{resolution.citizen}</td>
                  <td>{resolution.issue}</td>
                  <td>
                    <div className={styles.satisfaction}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < resolution.satisfaction ? styles.starFilled : styles.starEmpty}>★</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[resolution.quality.toLowerCase().replace(' ', '')]}`}>
                      {resolution.quality}
                    </span>
                  </td>
                  <td>{resolution.days}</td>
                  <td>
                    {resolution.satisfaction >= 4 && <span className={styles.positive}>✓ Positive</span>}
                    {resolution.satisfaction === 3 && <span className={styles.neutral}>~ Neutral</span>}
                    {resolution.satisfaction < 3 && <span className={styles.negative}>✗ Negative</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Impact by Category */}
      <div className={styles.section}>
        <h2>Impact by Issue Category</h2>
        <div className={styles.categoryGrid}>
          <div className={styles.categoryCard}>
            <div className={styles.categoryName}>Water Supply</div>
            <div className={styles.categoryMetric}>24 resolved</div>
            <div className={styles.categoryMetric}>4.8/5.0 satisfaction</div>
            <div className={styles.categoryMetric}>3.2 days avg</div>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryName}>Roads & Drainage</div>
            <div className={styles.categoryMetric}>18 resolved</div>
            <div className={styles.categoryMetric}>3.9/5.0 satisfaction</div>
            <div className={styles.categoryMetric}>8.1 days avg</div>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryName}>Garbage & Sanitation</div>
            <div className={styles.categoryMetric}>32 resolved</div>
            <div className={styles.categoryMetric}>4.3/5.0 satisfaction</div>
            <div className={styles.categoryMetric}>5.2 days avg</div>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryName}>Permits & Licenses</div>
            <div className={styles.categoryMetric}>15 resolved</div>
            <div className={styles.categoryMetric}>3.2/5.0 satisfaction</div>
            <div className={styles.categoryMetric}>9.8 days avg</div>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryName}>Public Utilities</div>
            <div className={styles.categoryMetric}>20 resolved</div>
            <div className={styles.categoryMetric}>4.1/5.0 satisfaction</div>
            <div className={styles.categoryMetric}>6.5 days avg</div>
          </div>
          <div className={styles.categoryCard}>
            <div className={styles.categoryName}>Other</div>
            <div className={styles.categoryMetric}>47 resolved</div>
            <div className={styles.categoryMetric}>4.0/5.0 satisfaction</div>
            <div className={styles.categoryMetric}>6.8 days avg</div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className={styles.section}>
        <h2>Key Insights & Recommendations</h2>
        <div className={styles.insightsList}>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>💡</span>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Water Supply Issues - Highest Satisfaction</div>
              <div className={styles.insightDesc}>4.8/5.0 rating with fastest resolution (3.2 days). Continue current approach.</div>
            </div>
          </div>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>⚠️</span>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Permits & Licenses - Lowest Satisfaction</div>
              <div className={styles.insightDesc}>3.2/5.0 rating with slowest resolution (9.8 days). Recommend process improvement.</div>
            </div>
          </div>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>✅</span>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Recurrence Rate Below Threshold</div>
              <div className={styles.insightDesc}>8.5% recurrence rate indicates effective problem resolution in most cases.</div>
            </div>
          </div>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>📊</span>
            <div className={styles.insightContent}>
              <div className={styles.insightTitle}>Overall Citizen Impact Positive</div>
              <div className={styles.insightDesc}>92.3% resolution rate and 4.1/5.0 satisfaction show strong public service value.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
