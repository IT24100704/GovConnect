// Utility functions for governance calculations and analysis
import {
  SLATracker, RiskScore, RiskHeatmapEntry, OfficerPerformance,
  Complaint, Escalation, Alert, DecisionLog, KPISnapshot,
  ExecutiveDashboardMetrics, BudgetAllocation, ProgramOutcome,
  BudgetVsOutcomeAnalysis
} from '@/lib/types';

// ============ SLA ANALYSIS ============
export function calculateSLABreachRate(trackers: SLATracker[]): number {
  if (trackers.length === 0) return 0;
  const breached = trackers.filter(t => t.breached).length;
  return Math.round((breached / trackers.length) * 100);
}

export function calculateSLAWarningRate(trackers: SLATracker[]): number {
  if (trackers.length === 0) return 0;
  const warning = trackers.filter(t => t.status === 'warning').length;
  return Math.round((warning / trackers.length) * 100);
}

export function getBottleneckStages(trackers: SLATracker[]): Record<string, number> {
  const bottlenecks: Record<string, number> = {};
  trackers.forEach(tracker => {
    if (tracker.bottleneckStage) {
      bottlenecks[tracker.bottleneckStage] = (bottlenecks[tracker.bottleneckStage] || 0) + 1;
    }
  });
  return bottlenecks;
}

export function getOldestOverdueItems(trackers: SLATracker[], limit: number = 5): SLATracker[] {
  return trackers
    .filter(t => t.breached)
    .sort((a, b) => (b.daysOverdue) - (a.daysOverdue))
    .slice(0, limit);
}

// ============ RISK ANALYSIS ============
export function calculateAverageRiskScore(scores: RiskScore[]): number {
  if (scores.length === 0) return 0;
  const avg = scores.reduce((sum, score) => {
    return sum + (score.fraudRisk + score.complianceRisk + score.budgetImpact + score.urgencyScore) / 4;
  }, 0);
  return Math.round(avg / scores.length);
}

export function getRiskDistribution(scores: RiskScore[]): Record<string, number> {
  const distribution: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  scores.forEach(score => {
    distribution[score.overallRiskLevel]++;
  });

  return distribution;
}

export function getHighRiskItems(scores: RiskScore[], limit: number = 10): RiskScore[] {
  return scores
    .sort((a, b) => {
      const aAvg = (a.fraudRisk + a.complianceRisk + a.budgetImpact + a.urgencyScore) / 4;
      const bAvg = (b.fraudRisk + b.complianceRisk + b.budgetImpact + b.urgencyScore) / 4;
      return bAvg - aAvg;
    })
    .slice(0, limit);
}

export function buildRiskHeatmap(
  complaints: Complaint[],
  riskScores: RiskScore[],
  escalations: Escalation[]
): RiskHeatmapEntry[] {
  const scoreMap = new Map(riskScores.map(r => [r.complaintId, r]));
  const now = new Date();

  return complaints
    .map(complaint => {
      const riskScore = scoreMap.get(complaint.id);
      if (!riskScore) return null;

      const escalationCount = escalations.filter(e => e.complaintId === complaint.id).length;
      const daysOpen = Math.floor((now.getTime() - new Date(complaint.createdDate).getTime()) / (1000 * 60 * 60 * 24));

      return {
        complaintId: complaint.id,
        complaint,
        riskScore,
        daysOpen,
        escalationCount,
      };
    })
    .filter((entry): entry is RiskHeatmapEntry => entry !== null);
}

// ============ PERFORMANCE ANALYSIS ============
export function calculateTeamAverageClosureTime(performances: OfficerPerformance[]): number {
  if (performances.length === 0) return 0;
  const sum = performances.reduce((acc, p) => acc + p.averageClosureTime, 0);
  return Math.round(sum / performances.length);
}

export function calculateTeamQualityScore(performances: OfficerPerformance[]): number {
  if (performances.length === 0) return 0;
  const sum = performances.reduce((acc, p) => acc + p.qualityScore, 0);
  return Math.round(sum / performances.length);
}

export function getTopPerformers(performances: OfficerPerformance[], limit: number = 5): OfficerPerformance[] {
  return performances
    .sort((a, b) => {
      const scoreA = (a.qualityScore + a.customerSatisfactionScore + a.complianceScore) / 3;
      const scoreB = (b.qualityScore + b.customerSatisfactionScore + b.complianceScore) / 3;
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

export function getUnderperformers(performances: OfficerPerformance[], limit: number = 5): OfficerPerformance[] {
  return performances
    .sort((a, b) => {
      const scoreA = (a.qualityScore + a.customerSatisfactionScore + a.complianceScore) / 3;
      const scoreB = (b.qualityScore + b.customerSatisfactionScore + b.complianceScore) / 3;
      return scoreA - scoreB;
    })
    .slice(0, limit);
}

export function calculateWorkloadImbalance(performances: OfficerPerformance[]): { officer: OfficerPerformance; imbalance: number }[] {
  if (performances.length === 0) return [];

  const avgCaseload = performances.reduce((sum, p) => sum + p.caseloadSize, 0) / performances.length;

  return performances
    .map(p => ({
      officer: p,
      imbalance: Math.abs(p.caseloadSize - avgCaseload),
    }))
    .sort((a, b) => b.imbalance - a.imbalance);
}

// ============ ESCALATION ANALYSIS ============
export function calculateEscalationRate(escalations: Escalation[], totalComplaints: number): number {
  if (totalComplaints === 0) return 0;
  return Math.round((escalations.length / totalComplaints) * 100);
}

export function getEscalationTrend(escalations: Escalation[], days: number = 30): number[] {
  const dailyData: Record<string, number> = {};
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyData[dateStr] = 0;
  }

  escalations.forEach(e => {
    const dateStr = new Date(e.escalatedDate).toISOString().split('T')[0];
    if (dailyData[dateStr] !== undefined) {
      dailyData[dateStr]++;
    }
  });

  return Object.values(dailyData).reverse();
}

export function getPendingEscalations(escalations: Escalation[]): Escalation[] {
  return escalations.filter(e => e.status === 'pending' || e.status === 'acknowledged');
}

export function getOverdueEscalationResponses(escalations: Escalation[]): Escalation[] {
  const now = new Date();
  return escalations.filter(e => !e.respondedDate && e.responseDeadline < now);
}

// ============ COMPLIANCE ANALYSIS ============
export function calculateComplianceRate(complianceRecords: any[]): number {
  if (complianceRecords.length === 0) return 0;
  const compliant = complianceRecords.filter(r => r.overallCompliance).length;
  return Math.round((compliant / complianceRecords.length) * 100);
}

export function getCommonNonComplianceReasons(complianceRecords: any[]): Record<string, number> {
  const reasons: Record<string, number> = {};

  complianceRecords.forEach(record => {
    record.nonComplianceReasons.forEach((reason: string) => {
      reasons[reason] = (reasons[reason] || 0) + 1;
    });
  });

  return Object.entries(reasons)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [reason, count]) => {
      acc[reason] = count;
      return acc;
    }, {} as Record<string, number>);
}

// ============ ALERT ANALYSIS ============
export function calculateAlertSeverityDistribution(alerts: Alert[]): Record<string, number> {
  const distribution: Record<string, number> = {
    info: 0,
    warning: 0,
    critical: 0,
  };

  alerts.forEach(alert => {
    distribution[alert.severity]++;
  });

  return distribution;
}

export function getUnresolvedAlerts(alerts: Alert[]): Alert[] {
  return alerts.filter(a => !a.resolved);
}

export function getOverdueAlerts(alerts: Alert[], hoursThreshold: number = 24): Alert[] {
  const now = new Date();
  return alerts.filter(alert => {
    if (alert.resolved) return false;
    const age = (now.getTime() - new Date(alert.timestamp).getTime()) / (1000 * 60 * 60);
    return age > hoursThreshold;
  });
}

// ============ KPI TREND ANALYSIS ============
export function calculateTrend(snapshots: KPISnapshot[], metric: keyof Omit<KPISnapshot, 'date'>): 'improving' | 'stable' | 'declining' {
  if (snapshots.length < 2) return 'stable';

  const recent = snapshots.slice(-7);
  const older = snapshots.slice(-14, -7);

  const recentAvg = recent.reduce((sum, s) => sum + (s[metric] as number), 0) / recent.length;
  const olderAvg = older.reduce((sum, s) => sum + (s[metric] as number), 0) / older.length;

  // For metrics where lower is better (like slaBreachRate), inverse the logic
  const lowerIsBetter = ['slaBreachRate', 'riskyItemsBacklog', 'unresolutionEscalationsCount', 'auditFlagsCount', 'averageClosureTime'].includes(metric);

  if (lowerIsBetter) {
    if (recentAvg < olderAvg * 0.95) return 'improving';
    if (recentAvg > olderAvg * 1.05) return 'declining';
  } else {
    if (recentAvg > olderAvg * 1.05) return 'improving';
    if (recentAvg < olderAvg * 0.95) return 'declining';
  }

  return 'stable';
}

// ============ BUDGET ANALYSIS ============
export function calculateBudgetUtilization(allocation: BudgetAllocation): number {
  if (allocation.allocatedAmount === 0) return 0;
  return Math.round((allocation.spentAmount / allocation.allocatedAmount) * 100);
}

export function calculateValueForMoney(allocation: BudgetAllocation, outcome: ProgramOutcome): number {
  if (allocation.allocatedAmount === 0) return 0;

  // Calculate efficiency: cases resolved per 100k budget
  const efficiencyScore = (outcome.casesResolved / allocation.allocatedAmount) * 100000;

  // Calculate satisfaction: satisfaction rate weighted by cases
  const satisfactionScore = (outcome.citizensSatisfied / outcome.casesProcessed) * 100;

  // Combine scores (60% efficiency, 40% satisfaction)
  return Math.round((efficiencyScore * 0.6) + (satisfactionScore * 0.4));
}

export function identifyOverspendingPrograms(analyses: BudgetVsOutcomeAnalysis[]): BudgetVsOutcomeAnalysis[] {
  return analyses
    .filter(a => {
      const utilization = calculateBudgetUtilization(a.budgetAllocation);
      return utilization > 90;
    })
    .sort((a, b) => {
      const utilizationA = calculateBudgetUtilization(a.budgetAllocation);
      const utilizationB = calculateBudgetUtilization(b.budgetAllocation);
      return utilizationB - utilizationA;
    });
}

// ============ DECISION LOG ANALYSIS ============
export function getDecisionDistribution(logs: DecisionLog[]): Record<string, number> {
  const distribution: Record<string, number> = {};

  logs.forEach(log => {
    distribution[log.decision] = (distribution[log.decision] || 0) + 1;
  });

  return distribution;
}

export function getComplianceDecisionRate(logs: DecisionLog[]): number {
  if (logs.length === 0) return 0;
  const compliant = logs.filter(l => l.complianceStatus).length;
  return Math.round((compliant / logs.length) * 100);
}

// ============ EXECUTIVE SUMMARY ============
export function generateExecutiveSummary(metrics: ExecutiveDashboardMetrics): string[] {
  const summary: string[] = [];

  if (metrics.slaBreachRate > 20) {
    summary.push(`⚠️ Critical: SLA breach rate at ${metrics.slaBreachRate}% (threshold: 20%)`);
  }

  if (metrics.riskBacklog > 30) {
    summary.push(`⚠️ Risk backlog at ${metrics.riskBacklog} items - requires attention`);
  }

  if (metrics.pendingEscalations > 15) {
    summary.push(`⚠️ ${metrics.pendingEscalations} escalations pending resolution`);
  }

  if (metrics.auditFlags > 5) {
    summary.push(`⚠️ ${metrics.auditFlags} audit flags require review`);
  }

  if (metrics.complianceScore < 80) {
    summary.push(`⚠️ Compliance score at ${metrics.complianceScore}% - below target of 85%`);
  }

  if (metrics.unmetTargets.length > 0) {
    summary.push(`📊 ${metrics.unmetTargets.length} performance targets not met`);
  }

  if (metrics.trend === 'improving') {
    summary.push(`✅ Overall trend: Improving`);
  } else if (metrics.trend === 'declining') {
    summary.push(`⚠️ Overall trend: Declining`);
  }

  return summary.length > 0 ? summary : ['✅ All metrics within acceptable ranges'];
}
