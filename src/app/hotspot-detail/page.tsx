'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './hotspot-detail.module.css';

interface HotspotData {
  district: string;
  province: string;
  intensity: number;
  count: number;
}

interface GrievanceCategory {
  category: string;
  count: number;
  percentage: number;
  trend: string;
}

interface HistoricalTrend {
  month: string;
  count: number;
  intensity: number;
}

interface ResolutionMetric {
  metric: string;
  value: string;
  target: string;
  status: 'on-track' | 'at-risk' | 'critical';
}

export default function HotspotDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hotspot, setHotspot] = useState<HotspotData | null>(null);
  const [categories, setCategories] = useState<GrievanceCategory[]>([]);
  const [trends, setTrends] = useState<HistoricalTrend[]>([]);
  const [metrics, setMetrics] = useState<ResolutionMetric[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'breakdown'>('overview');

  useEffect(() => {
    // Get hotspot data from URL parameters
    const district = searchParams.get('district');
    const province = searchParams.get('province');
    const intensity = searchParams.get('intensity');
    const count = searchParams.get('count');

    if (district && province && intensity && count) {
      setHotspot({
        district,
        province,
        intensity: parseInt(intensity),
        count: parseInt(count),
      });

      // Mock category breakdown
      setCategories([
        { category: 'Infrastructure Issues', count: 180, percentage: 40, trend: '+5%' },
        { category: 'Sanitation Problems', count: 108, percentage: 24, trend: '-2%' },
        { category: 'Service Delays', count: 90, percentage: 20, trend: '+8%' },
        { category: 'Documentation', count: 72, percentage: 16, trend: '0%' },
      ]);

      // Mock historical trends (last 6 months)
      setTrends([
        { month: 'Sep', count: 320, intensity: 78 },
        { month: 'Oct', count: 380, intensity: 82 },
        { month: 'Nov', count: 420, intensity: 85 },
        { month: 'Dec', count: 435, intensity: 86 },
        { month: 'Jan', count: 445, intensity: 85 },
        { month: 'Feb', count: 450, intensity: 85 },
      ]);

      // Mock resolution metrics
      setMetrics([
        { metric: 'Avg Resolution Time', value: '3.2 days', target: '3 days', status: 'at-risk' },
        { metric: 'First Contact Resolution', value: '62%', target: '70%', status: 'critical' },
        { metric: 'Customer Satisfaction', value: '4.1/5', target: '4.5/5', status: 'at-risk' },
        { metric: 'Reopened Cases', value: '8%', target: '<5%', status: 'critical' },
      ]);
    }
  }, [searchParams]);

  const handleGoBack = () => {
    router.back();
  };

  if (!hotspot) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading hotspot details...</div>
      </div>
    );
  }

  const maxCount = Math.max(...trends.map((t) => t.count));
  const maxIntensity = 100;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <button className={styles.backBtn} onClick={handleGoBack}>← Back</button>
          <div>
            <h1>Hotspot Detail Analysis</h1>
            <p>In-depth grievance metrics and patterns</p>
          </div>
        </div>
        <button className={styles.exportBtn}>📊 Export Analysis</button>
      </div>

      {/* Hotspot Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <div>
            <h2>{hotspot.district}</h2>
            <p className={styles.province}>{hotspot.province} Province</p>
          </div>
          <div className={styles.intensityBadge}>
            <div className={styles.intensityValue}>{hotspot.intensity}%</div>
            <div className={styles.intensityLabel}>Intensity</div>
          </div>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Total Grievances</div>
            <div className={styles.summaryValue}>{hotspot.count.toLocaleString()}</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Period</div>
            <div className={styles.summaryValue}>Last 6 Months</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Avg/Month</div>
            <div className={styles.summaryValue}>{Math.round(hotspot.count / 6)}</div>
          </div>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Status</div>
            <div className={`${styles.summaryValue} ${styles.critical}`}>🔴 Critical</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'trends' ? styles.active : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          6-Month Trends
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'breakdown' ? styles.active : ''}`}
          onClick={() => setActiveTab('breakdown')}
        >
          Category Breakdown
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            {/* Resolution Metrics */}
            <div className={styles.section}>
              <h3>Resolution Metrics</h3>
              <div className={styles.metricsList}>
                {metrics.map((metric, idx) => (
                  <div key={idx} className={styles.metricRow}>
                    <div className={styles.metricInfo}>
                      <div className={styles.metricLabel}>{metric.metric}</div>
                      <div className={styles.metricTarget}>Target: {metric.target}</div>
                    </div>
                    <div className={styles.metricStatus}>
                      <div
                        className={`${styles.metricBadge} ${styles[metric.status]}`}
                      >
                        {metric.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Indicators */}
            <div className={styles.section}>
              <h3>Risk Indicators</h3>
              <div className={styles.riskList}>
                <div className={styles.riskItem}>
                  <span className={styles.riskIcon}>⚠️</span>
                  <span>High reopening rate (8%) suggests quality issues</span>
                </div>
                <div className={styles.riskItem}>
                  <span className={styles.riskIcon}>⚠️</span>
                  <span>First contact resolution below target by 8 points</span>
                </div>
                <div className={styles.riskItem}>
                  <span className={styles.riskIcon}>⚠️</span>
                  <span>Upward trend in grievances over 6 months (+5% growth)</span>
                </div>
                <div className={styles.riskItem}>
                  <span className={styles.riskIcon}>💡</span>
                  <span>Infrastructure issues dominate (40% of cases)</span>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className={`${styles.section} ${styles.fullWidth}`}>
              <h3>Recommended Actions</h3>
              <div className={styles.actionsList}>
                <div className={styles.actionItem}>
                  <div className={styles.actionNumber}>1</div>
                  <div className={styles.actionContent}>
                    <div className={styles.actionTitle}>Increase Field Inspections</div>
                    <div className={styles.actionDesc}>Deploy additional staff in {hotspot.district} to handle infrastructure complaints directly</div>
                  </div>
                  <div className={styles.actionPriority}>🔴 High</div>
                </div>
                <div className={styles.actionItem}>
                  <div className={styles.actionNumber}>2</div>
                  <div className={styles.actionContent}>
                    <div className={styles.actionTitle}>Quality Assurance Review</div>
                    <div className={styles.actionDesc}>Implement stricter QA checks to reduce reopened cases</div>
                  </div>
                  <div className={styles.actionPriority}>🔴 High</div>
                </div>
                <div className={styles.actionItem}>
                  <div className={styles.actionNumber}>3</div>
                  <div className={styles.actionContent}>
                    <div className={styles.actionTitle}>Training Program</div>
                    <div className={styles.actionDesc}>Enhance staff training for first-contact resolution techniques</div>
                  </div>
                  <div className={styles.actionPriority}>🟡 Medium</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className={styles.section}>
            <h3>6-Month Grievance Trend</h3>
            <div className={styles.trendChart}>
              <div className={styles.chartLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: '#007bff' }} />
                  <span>Grievance Count</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: '#ff6b6b' }} />
                  <span>Intensity %</span>
                </div>
              </div>
              <div className={styles.chartsContainer}>
                <div className={styles.chart}>
                  <div className={styles.chartTitle}>Monthly Grievances</div>
                  <div className={styles.chartBars}>
                    {trends.map((trend, idx) => (
                      <div key={idx} className={styles.barGroup}>
                        <div className={styles.barWrapper}>
                          <div
                            className={styles.bar}
                            style={{ height: `${(trend.count / maxCount) * 100}%` }}
                            title={`${trend.month}: ${trend.count}`}
                          />
                          <div className={styles.barLabel}>{trend.month}</div>
                        </div>
                        <div className={styles.barValue}>{trend.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.chart}>
                  <div className={styles.chartTitle}>Intensity Trend</div>
                  <div className={styles.chartBars}>
                    {trends.map((trend, idx) => (
                      <div key={idx} className={styles.barGroup}>
                        <div className={styles.barWrapper}>
                          <div
                            className={styles.bar}
                            style={{
                              height: `${(trend.intensity / maxIntensity) * 100}%`,
                              background: '#ff6b6b',
                            }}
                            title={`${trend.month}: ${trend.intensity}%`}
                          />
                          <div className={styles.barLabel}>{trend.month}</div>
                        </div>
                        <div className={styles.barValue}>{trend.intensity}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Tab */}
        {activeTab === 'breakdown' && (
          <div className={styles.section}>
            <h3>Grievance Category Breakdown</h3>
            <div className={styles.categoriesList}>
              {categories.map((cat, idx) => (
                <div key={idx} className={styles.categoryRow}>
                  <div className={styles.categoryInfo}>
                    <div className={styles.categoryName}>{cat.category}</div>
                    <div className={styles.categoryMeta}>
                      <span className={styles.categoryCount}>{cat.count} reports</span>
                      <span className={`${styles.categoryTrend} ${cat.trend.includes('-') ? styles.positive : styles.negative}`}>
                        {cat.trend}
                      </span>
                    </div>
                  </div>
                  <div className={styles.categoryBar}>
                    <div className={styles.barContainer}>
                      <div className={styles.barFill} style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                  <div className={styles.categoryPercentage}>{cat.percentage}%</div>
                </div>
              ))}
            </div>

            {/* Key Insights */}
            <div className={styles.insightsBox}>
              <h4>Key Insights</h4>
              <ul className={styles.insightsList}>
                <li>Infrastructure issues are the leading complaint type, accounting for 40% of all grievances</li>
                <li>Sanitation complaints show a declining trend (-2%), indicating some improvement</li>
                <li>Service delays are increasing (+8%), requiring department attention</li>
                <li>Documentation-related issues remain steady at 16% of complaints</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
