// Governance & Monitoring Mock Data Generators
import {
  Officer, Team, SLAPolicy, SLATracker, RiskScore, OfficerPerformance,
  Escalation, ComplianceCheckItem, ComplianceCheckRecord, OverrideRecord,
  Alert, AnomalyAlert, DecisionLog, TransparencyExport, KPISnapshot,
  ExecutiveDashboardMetrics, AlertTrigger, BudgetAllocation, ProgramOutcome,
  BudgetVsOutcomeAnalysis, EscalationReason
} from '@/lib/types';

// ============ OFFICERS & TEAMS ============
export const mockOfficers: Officer[] = [
  {
    id: 'off_001',
    name: 'Mr. Kamal Perera',
    department: 'Municipal Council',
    role: 'officer',
    email: 'kamal@municipal.gov.lk',
    phone: '0771234567',
    joinDate: new Date('2020-01-15'),
  },
  {
    id: 'off_002',
    name: 'Ms. Nadeeka Silva',
    department: 'Police Department',
    role: 'officer',
    email: 'nadeeka@police.gov.lk',
    phone: '0771234568',
    joinDate: new Date('2019-06-20'),
  },
  {
    id: 'off_003',
    name: 'Mr. Ruwan Wijesinghe',
    department: 'Water Board',
    role: 'manager',
    email: 'ruwan@waterboard.gov.lk',
    phone: '0771234569',
    joinDate: new Date('2018-03-10'),
  },
  {
    id: 'off_004',
    name: 'Mrs. Malini Perera',
    department: 'Electricity Board',
    role: 'officer',
    email: 'malini@ceb.gov.lk',
    phone: '0771234570',
    joinDate: new Date('2021-02-01'),
  },
  {
    id: 'off_005',
    name: 'Mr. Suresh Kumar',
    department: 'Municipal Council',
    role: 'manager',
    email: 'suresh@municipal.gov.lk',
    phone: '0771234571',
    joinDate: new Date('2017-05-12'),
  },
  {
    id: 'off_006',
    name: 'Ms. Gayani Dias',
    department: 'Health Ministry',
    role: 'officer',
    email: 'gayani@health.gov.lk',
    phone: '0771234572',
    joinDate: new Date('2022-01-10'),
  },
];

export const mockTeams: Team[] = [
  {
    id: 'team_001',
    name: 'Sanitation Team',
    department: 'Municipal Council',
    leaderId: 'off_005',
    members: ['off_001', 'off_002'],
  },
  {
    id: 'team_002',
    name: 'Water Infrastructure',
    department: 'Water Board',
    leaderId: 'off_003',
    members: ['off_003'],
  },
  {
    id: 'team_003',
    name: 'Health Services',
    department: 'Health Ministry',
    leaderId: 'off_003',
    members: ['off_006'],
  },
];

// ============ SLA POLICIES ============
export const mockSLAPolicies: SLAPolicy[] = [
  {
    id: 'sla_001',
    department: 'Municipal Council',
    complexityLevel: 'simple',
    targetDays: 3,
    warningDays: 2,
  },
  {
    id: 'sla_002',
    department: 'Municipal Council',
    complexityLevel: 'medium',
    targetDays: 7,
    warningDays: 5,
  },
  {
    id: 'sla_003',
    department: 'Municipal Council',
    complexityLevel: 'complex',
    targetDays: 14,
    warningDays: 10,
  },
  {
    id: 'sla_004',
    department: 'Water Board',
    complexityLevel: 'simple',
    targetDays: 2,
    warningDays: 1,
  },
  {
    id: 'sla_005',
    department: 'Water Board',
    complexityLevel: 'medium',
    targetDays: 5,
    warningDays: 3,
  },
];

export function generateSLATrackers(count: number = 15): SLATracker[] {
  const trackers: SLATracker[] = [];
  const policies = mockSLAPolicies;
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const policy = policies[i % policies.length];
    const createdDate = new Date(today);
    createdDate.setDate(createdDate.getDate() - (Math.random() * 20));
    const dueDate = new Date(createdDate);
    dueDate.setDate(dueDate.getDate() + policy.targetDays);

    const daysOverdue = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
    const breached = daysOverdue > 0;

    let status: 'on_track' | 'warning' | 'breached' = 'on_track';
    if (breached) status = 'breached';
    else if ((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24) <= policy.warningDays) {
      status = 'warning';
    }

    trackers.push({
      complaintId: `CMP${String(i + 1).padStart(3, '0')}`,
      slaPolicy: policy,
      createdDate,
      dueDate,
      breached,
      breachDate: breached ? new Date(dueDate.getTime() + daysOverdue * 24 * 60 * 60 * 1000) : undefined,
      daysOverdue,
      status,
      bottleneckStage: breached ? 'investigations' : undefined,
    });
  }

  return trackers;
}

// ============ RISK SCORING ============
export function generateRiskScores(count: number = 15): RiskScore[] {
  const scores: RiskScore[] = [];

  for (let i = 0; i < count; i++) {
    const fraudRisk = Math.floor(Math.random() * 100);
    const complianceRisk = Math.floor(Math.random() * 100);
    const budgetImpact = Math.floor(Math.random() * 100);
    const urgencyScore = Math.floor(Math.random() * 100);

    const avgRisk = (fraudRisk + complianceRisk + budgetImpact + urgencyScore) / 4;
    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    if (avgRisk >= 75) overallRiskLevel = 'critical';
    else if (avgRisk >= 50) overallRiskLevel = 'high';
    else if (avgRisk >= 25) overallRiskLevel = 'medium';
    else overallRiskLevel = 'low';

    const factors: string[] = [];
    if (fraudRisk > 60) factors.push('High fraud indicators');
    if (complianceRisk > 60) factors.push('Regulatory non-compliance risk');
    if (budgetImpact > 60) factors.push('Significant budget implications');
    if (urgencyScore > 70) factors.push('Time-critical');

    scores.push({
      complaintId: `CMP${String(i + 1).padStart(3, '0')}`,
      fraudRisk,
      complianceRisk,
      budgetImpact,
      urgencyScore,
      overallRiskLevel,
      factors,
      lastAssessedDate: new Date(),
    });
  }

  return scores;
}

// ============ OFFICER PERFORMANCE ============
export function generateOfficerPerformanceData(officers: Officer[] = mockOfficers): OfficerPerformance[] {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return officers.map(officer => ({
    officerId: officer.id,
    officer,
    period: {
      startDate: monthStart,
      endDate: today,
    },
    caseloadSize: Math.floor(Math.random() * 30) + 5,
    casesResolved: Math.floor(Math.random() * 20) + 1,
    averageClosureTime: Math.floor(Math.random() * 21) + 3,
    escalationRate: Math.floor(Math.random() * 31),
    qualityScore: Math.floor(Math.random() * 40) + 60,
    customerSatisfactionScore: Math.floor(Math.random() * 30) + 70,
    complianceScore: Math.floor(Math.random() * 25) + 75,
    overallPerformanceRating:
      Math.random() > 0.7 ? 'excellent' :
      Math.random() > 0.5 ? 'good' :
      Math.random() > 0.2 ? 'satisfactory' : 'poor',
  }));
}

// ============ ESCALATIONS ============
export function generateEscalations(count: number = 8): Escalation[] {
  const escalations: Escalation[] = [];
  const reasons: EscalationReason[] = [
    'sla_breach_warning', 'sla_breached', 'high_risk', 'compliance_issue',
    'citizen_complaint', 'budget_exceeded', 'manual_escalation'
  ];

  for (let i = 0; i < count; i++) {
    const escalatedDate = new Date();
    escalatedDate.setDate(escalatedDate.getDate() - Math.floor(Math.random() * 10));
    const responseDeadline = new Date(escalatedDate);
    responseDeadline.setDate(responseDeadline.getDate() + (Math.floor(Math.random() * 3) + 1));

    const isResponded = Math.random() > 0.4;
    const respondedDate = isResponded ? new Date(escalatedDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000) : undefined;

    escalations.push({
      id: `esc_${String(i + 1).padStart(3, '0')}`,
      complaintId: `CMP${String(i + 1).padStart(3, '0')}`,
      reason: reasons[Math.floor(Math.random() * reasons.length)] as EscalationReason,
      fromOfficerId: mockOfficers[Math.floor(Math.random() * 3)].id,
      toOfficerId: mockOfficers[3 + Math.floor(Math.random() * 3)].id,
      escalatedDate,
      responseDeadline,
      respondedDate,
      responseNotes: isResponded ? 'Issue being investigated. Team deployed.' : undefined,
      status: isResponded ? 'acknowledged' : 'pending',
      escalationLevel: (Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4,
    });
  }

  return escalations;
}

// ============ COMPLIANCE CHECKS ============
export const mockComplianceCheckItems: ComplianceCheckItem[] = [
  {
    id: 'chk_001',
    name: 'Financial Approval Authorization',
    description: 'Verify approval from authorized financial officer',
    mandatory: true,
    policyReference: 'FIN-POL-2023-001',
    category: 'financial',
  },
  {
    id: 'chk_002',
    name: 'Environmental Impact Assessment',
    description: 'Ensure environmental compliance for infrastructure projects',
    mandatory: true,
    policyReference: 'ENV-POL-2023-002',
    category: 'legal',
  },
  {
    id: 'chk_003',
    name: 'Public Consultation Documentation',
    description: 'Document evidence of public consultation',
    mandatory: true,
    policyReference: 'GOV-POL-2023-003',
    category: 'procedural',
  },
  {
    id: 'chk_004',
    name: 'Safety Certification',
    description: 'Obtain safety clearance for high-risk items',
    mandatory: false,
    policyReference: 'SAFE-POL-2023-004',
    category: 'safety',
  },
];

export function generateComplianceRecords(count: number = 12): ComplianceCheckRecord[] {
  const records: ComplianceCheckRecord[] = [];

  for (let i = 0; i < count; i++) {
    const allPassed = Math.random() > 0.3;
    const checkResults = mockComplianceCheckItems.map(item => ({
      itemId: item.id,
      passed: allPassed || Math.random() > 0.2,
      checkedBy: mockOfficers[Math.floor(Math.random() * mockOfficers.length)].id,
      checkedDate: new Date(new Date().getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000),
      notes: allPassed ? 'Compliant' : 'Requires revision',
    }));

    const overallCompliance = checkResults.every(r => r.passed);

    records.push({
      id: `cmp_rec_${String(i + 1).padStart(3, '0')}`,
      complaintId: `CMP${String(i + 1).padStart(3, '0')}`,
      complaintCheckItems: mockComplianceCheckItems,
      checkResults,
      overallCompliance,
      nonComplianceReasons: overallCompliance ? [] : ['Missing environmental assessment'],
      approvalRequired: !overallCompliance,
      approvedBy: overallCompliance ? undefined : mockOfficers[5].id,
      approvalDate: overallCompliance ? undefined : new Date(),
    });
  }

  return records;
}

// ============ EXCEPTION & OVERRIDE REGISTER ============
export function generateOverrideRecords(count: number = 6): OverrideRecord[] {
  const records: OverrideRecord[] = [];

  for (let i = 0; i < count; i++) {
    const isApproved = Math.random() > 0.4;

    records.push({
      id: `ovr_${String(i + 1).padStart(3, '0')}`,
      complaintId: `CMP${String(i + 1).padStart(3, '0')}`,
      overrideType: ['policy_exception', 'deadline_extension', 'approval_bypass'][Math.floor(Math.random() * 3)] as any,
      reason: 'Departmental resource constraint requiring SLA extension',
      overriddenBy: mockOfficers[Math.floor(Math.random() * mockOfficers.length)].id,
      overrideDate: new Date(new Date().getTime() - Math.random() * 8 * 24 * 60 * 60 * 1000),
      approvedBySenior: isApproved,
      approverName: isApproved ? 'Mr. Suresh Kumar' : undefined,
      approvalDate: isApproved ? new Date() : undefined,
      riskAssessment: 'Low risk override with monitoring plan',
      reviewScheduledDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
      status: isApproved ? 'approved' : 'pending_approval',
    });
  }

  return records;
}

// ============ ALERTS ============
export const mockAlertTriggers: AlertTrigger[] = [
  {
    id: 'trigger_001',
    name: 'SLA Breach Warning',
    condition: 'Case approaching SLA deadline',
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'trigger_002',
    name: 'Critical Risk Detected',
    condition: 'Risk score exceeds 80',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'trigger_003',
    name: 'Approval Spike',
    condition: 'More than 50 approvals in one day',
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'trigger_004',
    name: 'Repeated Rejections',
    condition: 'Same item rejected 3+ times',
    severity: 'warning',
    enabled: true,
  },
  {
    id: 'trigger_005',
    name: 'Budget Overrun',
    condition: 'Spending exceeds allocation by 10%',
    severity: 'critical',
    enabled: true,
  },
];

export function generateAlerts(count: number = 15): Alert[] {
  const alerts: Alert[] = [];

  for (let i = 0; i < count; i++) {
    const isResolved = Math.random() > 0.6;

    alerts.push({
      id: `alert_${String(i + 1).padStart(3, '0')}`,
      triggerId: mockAlertTriggers[Math.floor(Math.random() * mockAlertTriggers.length)].id,
      message: `Alert: Case CMP${String(i + 1).padStart(3, '0')} requires attention`,
      severity: Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'warning' : 'info',
      timestamp: new Date(new Date().getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      relatedEntity: {
        type: 'complaint',
        id: `CMP${String(i + 1).padStart(3, '0')}`,
      },
      resolved: isResolved,
      resolvedDate: isResolved ? new Date() : undefined,
      actionTaken: isResolved ? 'Case escalated to senior officer' : undefined,
    });
  }

  return alerts;
}

export function generateAnomalyAlerts(count: number = 5): AnomalyAlert[] {
  const anomalyTypes = ['approval_spike', 'repeated_rejections', 'duplicate_vendor', 'duplicate_citizen', 'unusual_timeline', 'budget_overrun'] as const;
  const alerts: AnomalyAlert[] = [];

  for (let i = 0; i < count; i++) {
    alerts.push({
      id: `anom_${String(i + 1).padStart(3, '0')}`,
      triggerId: mockAlertTriggers[Math.floor(Math.random() * mockAlertTriggers.length)].id,
      message: `Anomaly detected: ${anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]}`,
      severity: 'critical',
      timestamp: new Date(new Date().getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000),
      relatedEntity: {
        type: 'complaint',
        id: `CMP${String(Math.floor(Math.random() * 20) + 1).padStart(3, '0')}`,
      },
      resolved: false,
      anomalyType: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      context: {
        threshold: '50 per day',
        actual: '78',
        variance: '156%',
      },
    });
  }

  return alerts;
}

// ============ DECISION LOGS & AUDIT ============
export function generateDecisionLogs(count: number = 20): DecisionLog[] {
  const logs: DecisionLog[] = [];
  const decisions = ['Approved', 'Rejected', 'Escalated', 'Assigned', 'Resolved', 'Closed', 'Reopened', 'On Hold'];

  for (let i = 0; i < count; i++) {
    logs.push({
      id: `dec_${String(i + 1).padStart(3, '0')}`,
      complaintId: `CMP${String(i + 1).padStart(3, '0')}`,
      officerId: mockOfficers[Math.floor(Math.random() * mockOfficers.length)].id,
      decision: decisions[Math.floor(Math.random() * decisions.length)],
      reasonCode: Math.random() > 0.8 ? 'POL_001' : 'MER_001',
      timestamp: new Date(new Date().getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000),
      approverName: Math.random() > 0.6 ? 'Mr. Suresh Kumar' : undefined,
      complianceStatus: Math.random() > 0.2,
    });
  }

  return logs;
}

// ============ KPI SNAPSHOTS ============
export function generateKPISnapshots(days: number = 30): KPISnapshot[] {
  const snapshots: KPISnapshot[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    snapshots.push({
      date,
      slaBreachRate: 15 + Math.random() * 20,
      riskyItemsBacklog: Math.floor(20 + Math.random() * 40),
      unresolutionEscalationsCount: Math.floor(5 + Math.random() * 15),
      auditFlagsCount: Math.floor(2 + Math.random() * 8),
      averageClosureTime: 5 + Math.random() * 10,
      overallComplianceScore: 75 + Math.random() * 20,
      processEfficiencyScore: 70 + Math.random() * 25,
    });
  }

  return snapshots;
}

// ============ EXECUTIVE DASHBOARD ============
export function generateExecutiveDashboardMetrics(): ExecutiveDashboardMetrics {
  const today = new Date();
  const periodStart = new Date(today);
  periodStart.setDate(periodStart.getDate() - 30);

  return {
    period: {
      startDate: periodStart,
      endDate: today,
    },
    slaBreachRate: 18.5,
    riskBacklog: 34,
    pendingEscalations: 12,
    auditFlags: 4,
    unmetTargets: [
      'Complaint resolution time exceeds target by 15%',
      'Department A has SLA breach rate of 25%',
      '3 critical risk items pending for >5 days',
    ],
    criticalAlerts: 5,
    complianceScore: 82,
    trend: Math.random() > 0.5 ? 'improving' : 'stable',
  };
}

// ============ TRANSPARENCY EXPORT ============
export function generateTransparencyExport(): TransparencyExport {
  const today = new Date();
  const periodStart = new Date(today);
  periodStart.setMonth(periodStart.getMonth() - 1);

  return {
    exportDate: today,
    period: {
      startDate: periodStart,
      endDate: today,
    },
    decisionLogs: generateDecisionLogs(25),
    complianceChecks: generateComplianceRecords(15),
    overrides: generateOverrideRecords(8),
    escalations: generateEscalations(10),
    kpiSnapshots: generateKPISnapshots(30),
    auditTrail: [],
  };
}

// ============ BUDGET & OUTCOME ============
export function generateBudgetAllocations(count: number = 5): BudgetAllocation[] {
  const programs = [
    { name: 'Complaint Resolution Program', dept: 'Municipal Council', base: 50000 },
    { name: 'Citizen Support Initiative', dept: 'Police Department', base: 75000 },
    { name: 'Service Excellence Fund', dept: 'Water Board', base: 60000 },
    { name: 'Digital Transformation', dept: 'Electricity Board', base: 120000 },
    { name: 'Community Outreach Program', dept: 'Health Department', base: 40000 },
  ];

  return programs.slice(0, count).map((prog, idx) => {
    const allocatedAmount = prog.base + Math.random() * 30000;
    const spentAmount = allocatedAmount * (0.65 + Math.random() * 0.35);
    const costsPerCase = spentAmount / (50 + Math.floor(Math.random() * 100));

    return {
      id: `budget_${idx + 1}`,
      program: prog.name,
      department: prog.dept,
      allocatedAmount: Math.round(allocatedAmount),
      spentAmount: Math.round(spentAmount),
      costPerCase: Math.round(costsPerCase * 100) / 100,
      period: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      },
    };
  });
}

export function generateProgramOutcomes(count: number = 5): ProgramOutcome[] {
  const programs = [
    { name: 'Complaint Resolution Program', cases: 150 },
    { name: 'Citizen Support Initiative', cases: 200 },
    { name: 'Service Excellence Fund', cases: 120 },
    { name: 'Digital Transformation', cases: 180 },
    { name: 'Community Outreach Program', cases: 90 },
  ];

  return programs.slice(0, count).map((prog, idx) => {
    const casesResolved = Math.floor(prog.cases * (0.7 + Math.random() * 0.25));
    const citizensSatisfied = Math.floor(casesResolved * (0.8 + Math.random() * 0.2));
    const efficiencyRatio = prog.cases / (50000 + Math.random() * 30000);

    return {
      id: `outcome_${idx + 1}`,
      program: prog.name,
      budgetId: `budget_${idx + 1}`,
      casesProcessed: prog.cases,
      casesResolved,
      citizensSatisfied,
      efficiencyRatio: Math.round(efficiencyRatio * 100) / 100,
      outcomesDelivered: [
        'Improved citizen satisfaction',
        'Reduced resolution time',
        'Enhanced transparency',
        'Better resource allocation',
      ],
    };
  });
}

export function generateBudgetVsOutcomeAnalysis(count: number = 5): BudgetVsOutcomeAnalysis[] {
  const budgets = generateBudgetAllocations(count);
  const outcomes = generateProgramOutcomes(count);

  return budgets.map((budget, idx) => {
    const outcome = outcomes[idx];
    const utilization = budget.spentAmount / budget.allocatedAmount;
    
    // Value for Money: efficiency × satisfaction ratio, normalized to 0-100
    const satisfactionRate = outcome.citizensSatisfied / outcome.casesResolved;
    const efficiencyScore = Math.min(outcome.casesResolved / outcome.casesProcessed, 1);
    const valueForMoney = Math.round((efficiencyScore * 0.6 + satisfactionRate * 0.4) * 100);

    const costEffectiveness = 
      valueForMoney > 80 ? 'Excellent' :
      valueForMoney > 60 ? 'Good' :
      valueForMoney > 40 ? 'Fair' : 'Poor';

    const recommendations = [];
    if (utilization > 0.9) {
      recommendations.push('Consider increased budget allocation for next period');
    }
    if (utilization < 0.6) {
      recommendations.push('Optimize budget usage or reallocate surplus funds');
    }
    if (valueForMoney < 50) {
      recommendations.push('Review program effectiveness and resource allocation');
    }
    if (outcome.efficiencyRatio > 0.003) {
      recommendations.push('Strong ROI - consider scaling this program');
    }

    return {
      budgetAllocation: budget,
      outcome,
      valueForMoneyScore: valueForMoney,
      costEffectiveness,
      recommendations: recommendations.length > 0 ? recommendations : ['Program operating effectively'],
    };
  });
}
