export interface QCRecord {
  id: string;
  code: string;
  orderId: string;
  orderItemId?: string | null;
  workOrderId?: string | null;
  inspectorId: string;
  result: QCResult;
  checkDate: Date;
  notes?: string | null;
  defects?: string | null;
  defectsFound?: string[] | null;
  images?: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum QCResult {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  PASS = 'PASS',
  PASS_WITH_MINOR = 'PASS_WITH_MINOR',
  FAILED = 'FAILED',
  FAIL = 'FAIL',
  REWORK = 'REWORK',
}
