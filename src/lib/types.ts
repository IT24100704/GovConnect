// Core Types for GovConnect Governance Dashboard

// ============ BASIC ENTITIES ============
export interface Officer {
  id: string;
  name: string;
  department: string;
  role: 'officer' | 'manager' | 'admin' | 'executive';
  email: string;
  phone: string;
  joinDate: Date;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  leaderId: string;
  members: string[]; // Officer IDs
}

// ============ CASE/REQUEST MANAGEMENT ============
export interface Complaint {
  id: string;
  referenceNumber: string;
  citizenName: string;
  department: string;
  status: 'registered' | 'assigned' | 'in_progress' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdDate: Date;
  targetResolutionDate: Date;
  actualResolutionDate?: Date;
  assignedOfficerId?: string;
  description: string;
  category: string;
}

// ============ SLA MANAGEMENT ============
export interface SLAPolicy {
  id: string;
  department: string;
  complexityLevel: 'simple' | 'medium' | 'complex';
  targetDays: number;
  warningDays: number;
}

export interface SLATracker {
  complaintId: string;
  slaPolicy: SLAPolicy;
  createdDate: Date;
  dueDate: Date;
  breached: boolean;
  breachDate?: Date;
  daysOverdue: number;
  status: 'on_track' | 'warning' | 'breached';
  bottleneckStage?: string;
}

// ============ RISK ASSESSMENT ============
export interface RiskScore {
  complaintId: string;
  fraudRisk: number; // 0-100
  complianceRisk: number; // 0-100
  budgetImpact: number; // 0-100 (cost severity)
  urgencyScore: number; // 0-100
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  lastAssessedDate: Date;
}

export interface RiskHeatmapEntry {
  complaintId: string;
  complaint: Complaint;
  riskScore: RiskScore;
  daysOpen: number;
  escalationCount: number;
}

// ============ OFFICER PERFORMANCE ============
export interface OfficerPerformance {
  officerId: string;
  officer: Officer;
  period: { startDate: Date; endDate: Date };
  caseloadSize: number;
  casesResolved: number;
  averageClosureTime: number; // days
  escalationRate: number; // percentage
  qualityScore: number; // 0-100
  customerSatisfactionScore: number; // 0-100
  complianceScore: number; // 0-100
  overallPerformanceRating: 'excellent' | 'good' | 'satisfactory' | 'poor';
}

export interface TeamPerformance {
  teamId: string;
  team: Team;
  period: { startDate: Date; endDate: Date };
  totalCaseload: number;
  resolvedCases: number;
  avgClosureTime: number;
  teamEscalationRate: number;
  avgQualityScore: number;
  avgSatisfactionScore: number;
}

// ============ ESCALATION MANAGEMENT ============
export type EscalationReason = 
  | 'sla_breach_warning' 
  | 'sla_breached' 
  | 'high_risk' 
  | 'compliance_issue' 
  | 'citizen_complaint' 
  | 'budget_exceeded' 
  | 'manual_escalation';

export interface Escalation {
  id: string;
  complaintId: string;
  reason: EscalationReason;
  fromOfficerId?: string;
  toOfficerId?: string;
  escalatedDate: Date;
  responseDeadline: Date;
  respondedDate?: Date;
  responseNotes?: string;
  status: 'pending' | 'acknowledged' | 'resolved' | 'escalated_further';
  escalationLevel: 1 | 2 | 3 | 4; // 1 = team lead, 2 = manager, 3 = director, 4 = executive
}

export interface EscalationHistory {
  complaintId: string;
  escalations: Escalation[];
  totalEscalations: number;
  currentEscalationLevel: number;
}

// ============ COMPLIANCE & POLICY ============
export interface ComplianceCheckItem {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  policyReference: string;
  category: string; // 'legal', 'financial', 'procedural', 'safety'
}

export interface ComplianceCheckRecord {
  id: string;
  complaintId: string;
  complaintCheckItems: ComplianceCheckItem[];
  checkResults: {
    itemId: string;
    passed: boolean;
    checkedBy: string;
    checkedDate: Date;
    notes: string;
  }[];
  overallCompliance: boolean;
  nonComplianceReasons: string[];
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

// ============ EXCEPTION & OVERRIDE REGISTER ============
export interface OverrideRecord {
  id: string;
  complaintId: string;
  overrideType: 'policy_exception' | 'deadline_extension' | 'approval_bypass' | 'other';
  reason: string;
  overriddenBy: string;
  overrideDate: Date;
  approvedBySenior: boolean;
  approverName?: string;
  approvalDate?: Date;
  riskAssessment: string;
  reviewScheduledDate?: Date;
  status: 'pending_approval' | 'approved' | 'under_review' | 'archived';
}

// ============ IMPACT METRICS ============
export interface PublicServiceImpact {
  complaintId: string;
  resolutionTime: number; // days
  complainantSatisfaction: number; // 1-5
  complaintRecurrence: boolean;
  serviceDeliveryQuality: 'poor' | 'fair' | 'good' | 'excellent';
  citizenOutcome: string;
  coverageArea: string;
  impactScope: 'individual' | 'community' | 'district' | 'national';
  followUpNeeded: boolean;
}

export interface ImpactMetrics {
  period: { startDate: Date; endDate: Date };
  totalComplaints: number;
  resolutionRate: number;
  avgResolutionTime: number;
  avgSatisfactionScore: number;
  recurrenceRate: number;
  serviceQualityAverage: number;
}

// ============ BUDGET & OUTCOME ============
export interface BudgetAllocation {
  id: string;
  program: string;
  department: string;
  allocatedAmount: number;
  spentAmount: number;
  costPerCase: number;
  period: { startDate: Date; endDate: Date };
}

export interface ProgramOutcome {
  id: string;
  program: string;
  budgetId: string;
  casesProcessed: number;
  casesResolved: number;
  citizensSatisfied: number;
  efficiencyRatio: number; // cases per dollar
  outcomesDelivered: string[];
}

export interface BudgetVsOutcomeAnalysis {
  budgetAllocation: BudgetAllocation;
  outcome: ProgramOutcome;
  valueForMoneyScore: number; // 0-100
  costEffectiveness: string;
  recommendations: string[];
}

// ============ EARLY WARNING ALERTS ============
export interface AlertTrigger {
  id: string;
  name: string;
  condition: string;
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
}

export interface Alert {
  id: string;
  triggerId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: Date;
  relatedEntity: {
    type: 'complaint' | 'officer' | 'department' | 'system';
    id: string;
  };
  resolved: boolean;
  resolvedDate?: Date;
  actionTaken?: string;
}

export interface AnomalyAlert extends Alert {
  anomalyType: 
    | 'approval_spike' 
    | 'repeated_rejections' 
    | 'duplicate_vendor' 
    | 'duplicate_citizen' 
    | 'unusual_timeline' 
    | 'budget_overrun';
  context: Record<string, any>;
}

// ============ AUDIT & TRANSPARENCY ============
export interface DecisionLog {
  id: string;
  complaintId: string;
  officerId: string;
  decision: string;
  reasonCode: string;
  timestamp: Date;
  approverName?: string;
  complianceStatus: boolean;
}

export interface ComplianceEvidence {
  id: string;
  complaintId: string;
  documentType: string;
  documentRef: string;
  uploadedDate: Date;
  relatedDecision: string;
}

export interface TransparencyExport {
  exportDate: Date;
  period: { startDate: Date; endDate: Date };
  decisionLogs: DecisionLog[];
  complianceChecks: ComplianceCheckRecord[];
  overrides: OverrideRecord[];
  escalations: Escalation[];
  kpiSnapshots: KPISnapshot[];
  auditTrail: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: Date;
  entityType: string;
  entityId: string;
  changes: Record<string, any>;
}

// ============ KPI & EXECUTIVE DASHBOARD ============
export interface KPISnapshot {
  date: Date;
  slaBreachRate: number; // percentage
  riskyItemsBacklog: number;
  unresolutionEscalationsCount: number;
  auditFlagsCount: number;
  averageClosureTime: number;
  overallComplianceScore: number;
  processEfficiencyScore: number;
}

export interface ExecutiveDashboardMetrics {
  period: { startDate: Date; endDate: Date };
  slaBreachRate: number;
  riskBacklog: number;
  pendingEscalations: number;
  auditFlags: number;
  unmetTargets: string[];
  criticalAlerts: number;
  complianceScore: number;
  trend: 'improving' | 'stable' | 'declining';
}

// ============ UTILITY TYPES ============
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterCriteria {
  department?: string;
  status?: string;
  priority?: string;
  dateRange?: DateRange;
  officer?: string;
  riskLevel?: string;
  slaStatus?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  
  position: { row: number; col: number };
  size: { width: number; height: number };
}
