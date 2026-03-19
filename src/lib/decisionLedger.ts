import { mockAuditTrail, mockComplaints } from '@/data/mockData';

export type DecisionLedgerAction = 'APPROVE' | 'REJECT' | 'STATUS_EDIT' | 'FORWARD' | 'FIELD_EDIT';

export type DecisionLedgerEntry = {
  id: string;
  complaintId: string;
  departmentId?: string;
  department?: string;
  action: DecisionLedgerAction;
  field: string;
  beforeValue: string;
  afterValue: string;
  reason: string;
  performedById: string;
  performedByName: string;
  performedAt: string;
};

const DECISION_LEDGER_KEY = 'govconnect_decision_ledger_v1';

const complaintLookup = new Map(mockComplaints.map((complaint) => [complaint.id, complaint]));

const seededDecisionLedger: DecisionLedgerEntry[] = mockAuditTrail.map((entry) => {
  const complaint = complaintLookup.get(entry.complaintId);
  const oldStatus = entry.details?.oldStatus ?? 'unknown';
  const newStatus = entry.details?.newStatus ?? 'unknown';
  let action: DecisionLedgerAction = 'STATUS_EDIT';
  if (newStatus === 'resolved') action = 'APPROVE';
  if (newStatus === 'rejected') action = 'REJECT';

  return {
    id: `seed_${entry.id}`,
    complaintId: entry.complaintId,
    departmentId: complaint?.departmentId,
    department: complaint?.department,
    action,
    field: 'status',
    beforeValue: oldStatus,
    afterValue: newStatus,
    reason: entry.details?.reason ?? 'No reason captured (legacy record)',
    performedById: entry.performedBy,
    performedByName: entry.performedByName,
    performedAt: entry.timestamp,
  };
});

export function readDecisionLedger(): DecisionLedgerEntry[] {
  if (typeof window === 'undefined') return seededDecisionLedger;
  const raw = window.localStorage.getItem(DECISION_LEDGER_KEY);
  if (!raw) {
    window.localStorage.setItem(DECISION_LEDGER_KEY, JSON.stringify(seededDecisionLedger));
    return seededDecisionLedger;
  }

  try {
    const parsed = JSON.parse(raw) as DecisionLedgerEntry[];
    if (!Array.isArray(parsed)) return seededDecisionLedger;
    return parsed;
  } catch {
    return seededDecisionLedger;
  }
}

export function appendDecisionLedgerEntry(entry: DecisionLedgerEntry): DecisionLedgerEntry[] {
  const current = readDecisionLedger();
  const updated = [entry, ...current];
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DECISION_LEDGER_KEY, JSON.stringify(updated));
  }
  return updated;
}
