'use client';

import { useState, useEffect } from 'react';
import { BudgetVsOutcomeAnalysis } from '@/lib/types';
import { generateBudgetVsOutcomeAnalysis } from '@/data/mockDataGovernance';
import styles from './budget-outcome.module.css';

interface AnalysisItem extends BudgetVsOutcomeAnalysis {
  sortKey?: number;
}

export default function BudgetOutcomePage() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [filteredData, setFilteredData] = useState<AnalysisItem[]>([]);
  const [filterCostEffectiveness, setFilterCostEffectiveness] = useState('all');
  const [sortBy, setSortBy] = useState<'vfm' | 'utilization' | 'satisfaction'>('vfm');

  useEffect(() => {
    const generated = generateBudgetVsOutcomeAnalysis(5);
    setAnalyses(generated);
  }, []);

  useEffect(() => {
    let filtered = analyses.filter(item => {
      if (filterCostEffectiveness === 'all') return true;
      return item.costEffectiveness === filterCostEffectiveness;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'vfm':
          return b.valueForMoneyScore - a.valueForMoneyScore;
        case 'utilization':
          return (b.budgetAllocation.spentAmount / b.budgetAllocation.allocatedAmount) -
                 (a.budgetAllocation.spentAmount / a.budgetAllocation.allocatedAmount);
        case 'satisfaction':
          return (b.outcome.citizensSatisfied / b.outcome.casesResolved) -
                 (a.outcome.citizensSatisfied / a.outcome.casesResolved);
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [analyses, filterCostEffectiveness, sortBy]);

  const totalAllocated = analyses.reduce((sum, a) => sum + a.budgetAllocation.allocatedAmount, 0);
  const totalSpent = analyses.reduce((sum, a) => sum + a.budgetAllocation.spentAmount, 0);
  const avgValueForMoney = Math.round(analyses.reduce((sum, a) => sum + a.valueForMoneyScore, 0) / analyses.length);
  const totalCasesResolved = analyses.reduce((sum, a) => sum + a.outcome.casesResolved, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Budget vs Outcome View</h1>
        <p>Link spending by program to delivered outcomes and efficiency ratios</p>
      </div>

      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={styles.label}>Total Budget Allocated</div>
          <div className={styles.value}>Rs. {(totalAllocated / 100000).toFixed(1)}L</div>
          <div className={styles.subtitle}>Across {analyses.length} programs</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.label}>Total Budget Spent</div>
          <div className={styles.value}>Rs. {(totalSpent / 100000).toFixed(1)}L</div>
          <div className={styles.subtitle}>{((totalSpent / totalAllocated) * 100).toFixed(1)}% utilization</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.label}>Avg Value for Money</div>
          <div className={styles.value}>{avgValueForMoney}%</div>
          <div className={styles.subtitle}>Overall program effectiveness</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.label}>Cases Resolved</div>
          <div className={styles.value}>{totalCasesResolved}</div>
          <div className={styles.subtitle}>Through all programs</div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Program Budget Utilization</h2>
        <div className={styles.utilizationGrid}>
          {analyses.map((analysis) => {
            const utilization = (analysis.budgetAllocation.spentAmount / analysis.budgetAllocation.allocatedAmount) * 100;
            const utilizationColor = utilization > 90 ? '#dc3545' : utilization > 75 ? '#ffc107' : '#28a745';

            return (
              <div key={analysis.budgetAllocation.id} className={styles.utilizationCard}>
                <div className={styles.programName}>{analysis.budgetAllocation.program}</div>
                <div className={styles.utilizationBar}>
                  <div className={styles.utilizationFill} style={{ width: `${utilization}%`, backgroundColor: utilizationColor }} />
                </div>
                <div className={styles.utilizationText}>
                  <span>Rs. {(analysis.budgetAllocation.spentAmount / 100000).toFixed(1)}L / {(analysis.budgetAllocation.allocatedAmount / 100000).toFixed(1)}L</span>
                  <span className={styles.percentage}>{utilization.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Value for Money Analysis</h2>
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <label>Filter by Cost Effectiveness:</label>
            <select value={filterCostEffectiveness} onChange={(e) => setFilterCostEffectiveness(e.target.value)}>
              <option value="all">All Programs</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="vfm">Value for Money Score</option>
              <option value="utilization">Budget Utilization</option>
              <option value="satisfaction">Satisfaction Rate</option>
            </select>
          </div>
        </div>

        <div className={styles.cardsGrid}>
          {filteredData.map((analysis) => (
            <div key={analysis.budgetAllocation.id} className={styles.analysisCard}>
              <div className={styles.cardHeader}>
                <h3>{analysis.budgetAllocation.program}</h3>
                <div className={`${styles.badge} ${styles[analysis.costEffectiveness.toLowerCase()]}`}>
                  {analysis.costEffectiveness}
                </div>
              </div>

              <div className={styles.scoreDisplay}>
                <div className={styles.vfmScore}>{analysis.valueForMoneyScore}%</div>
                <div className={styles.scoreLabel}>Value for Money</div>
              </div>

              <div className={styles.metricsDisplay}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Cases Processed:</span>
                  <span className={styles.metricValue}>{analysis.outcome.casesProcessed}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Cases Resolved:</span>
                  <span className={styles.metricValue}>{analysis.outcome.casesResolved}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Citizen Satisfied:</span>
                  <span className={styles.metricValue}>{analysis.outcome.citizensSatisfied}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Cost per Case:</span>
                  <span className={styles.metricValue}>Rs. {analysis.budgetAllocation.costPerCase}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Efficiency Ratio:</span>
                  <span className={styles.metricValue}>{analysis.outcome.efficiencyRatio.toFixed(4)} cases/$</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Satisfaction Rate:</span>
                  <span className={styles.metricValue}>{((analysis.outcome.citizensSatisfied / analysis.outcome.casesResolved) * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className={styles.recommendationsBox}>
                <h4>Recommendations</h4>
                <ul>
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Program Comparison Matrix</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Program</th>
                <th>Budget</th>
                <th>Spent</th>
                <th>Utilization</th>
                <th>Cases</th>
                <th>Resolved</th>
                <th>Satisfaction</th>
                <th>Value for Money</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((analysis) => {
                const utilization = (analysis.budgetAllocation.spentAmount / analysis.budgetAllocation.allocatedAmount) * 100;
                const satisfaction = ((analysis.outcome.citizensSatisfied / analysis.outcome.casesResolved) * 100).toFixed(1);
                
                return (
                  <tr key={analysis.budgetAllocation.id}>
                    <td className={styles.programNameCell}>{analysis.budgetAllocation.program}</td>
                    <td>Rs. {(analysis.budgetAllocation.allocatedAmount / 100000).toFixed(1)}L</td>
                    <td>Rs. {(analysis.budgetAllocation.spentAmount / 100000).toFixed(1)}L</td>
                    <td>
                      <span className={utilization > 90 ? styles.negative : utilization > 75 ? styles.neutral : styles.positive}>
                        {utilization.toFixed(1)}%
                      </span>
                    </td>
                    <td>{analysis.outcome.casesProcessed}</td>
                    <td>{analysis.outcome.casesResolved}</td>
                    <td>{satisfaction}%</td>
                    <td>
                      <div className={styles.vfmBadge}>
                        <div className={styles.vfmValue}>{analysis.valueForMoneyScore}%</div>
                        <div className={styles.vfmLabel}>{analysis.costEffectiveness}</div>
                      </div>
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
