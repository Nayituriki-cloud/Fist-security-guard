export type UserRole =
  | 'super_admin'
  | 'director'
  | 'operations_manager'
  | 'supervisor'
  | 'guard'
  | 'hr_manager'
  | 'finance_manager'
  | 'client'
  | 'control_room_operator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl: string;
  siteId?: string; // For client or guard
  badgeNumber?: string;
  phoneNumber: string;
}

export type GuardStatus = 'active' | 'on_duty' | 'off_duty' | 'on_leave' | 'suspended' | 'probation';
export type ShiftType = 'Day (06:00 - 18:00)' | 'Night (18:00 - 06:00)' | 'Rotating 12h' | 'Special Event';

export interface GuardCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  certNumber: string;
  verified: boolean;
}

export interface DisciplinaryRecord {
  id: string;
  date: string;
  incidentType: string;
  description: string;
  actionTaken: string;
  reportedBy: string;
  status: 'pending' | 'resolved' | 'appealed';
}

export interface GuardProfile {
  id: string;
  employeeNumber: string;
  nationalId: string; // Rwandan 16-digit standard
  fullName: string;
  photoUrl: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  hireDate: string;
  employmentStatus: GuardStatus;
  currentSiteId: string;
  currentSiteName: string;
  assignedShift: ShiftType;
  skills: string[]; // e.g. "Armed Guard", "First Aid Responder", "CCTV Monitor", "Fire Marshal", "K9 Handling"
  certifications: GuardCertification[];
  disciplinaryRecords: DisciplinaryRecord[];
  performanceRating: number; // 1-5
  attendanceScore: number; // percentage e.g. 98.4
  monthlyBaseSalaryRWF: number;
}

export interface SecuritySite {
  id: string;
  name: string;
  clientName: string;
  clientId: string;
  category: 'Banking & Finance' | 'Diplomatic' | 'Commercial & Retail' | 'Industrial & Logistics' | 'Hospitality' | 'Critical Infrastructure';
  address: string;
  district: string;
  city: string; // Kigali, Rubavu, Musanze, Huye
  latitude: number;
  longitude: number;
  guardsRequiredDay: number;
  guardsRequiredNight: number;
  activeGuardsCount: number;
  supervisorId: string;
  supervisorName: string;
  contactPerson: string;
  contactPhone: string;
  postInstructions: string[];
  imageUrl: string;
  status: 'active' | 'temporary_hold' | 'critical_watch';
}

export interface AttendanceRecord {
  id: string;
  guardId: string;
  guardName: string;
  siteId: string;
  siteName: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  shift: ShiftType;
  status: 'on_time' | 'late' | 'overtime' | 'absent' | 'verified';
  gpsCoordinates: {
    lat: number;
    lng: number;
    accuracyMeters: number;
  };
  qrCodeScanned: boolean;
  overtimeHours: number;
  supervisorVerified: boolean;
  notes?: string;
}

export interface PatrolCheckpoint {
  id: string;
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  scheduledTime: string;
  scannedAt?: string;
  scannedBy?: string;
  status: 'pending' | 'scanned' | 'missed' | 'delayed';
  notes?: string;
}

export interface PatrolRoute {
  id: string;
  siteId: string;
  siteName: string;
  routeName: string;
  intervalMinutes: number;
  assignedGuardId: string;
  assignedGuardName: string;
  checkpoints: PatrolCheckpoint[];
  lastCompletedAt?: string;
  status: 'in_progress' | 'completed' | 'overdue' | 'idle';
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentType =
  | 'Theft'
  | 'Fire Emergency'
  | 'Unauthorized Access / Trespass'
  | 'Property Damage'
  | 'Suspicious Activity'
  | 'Medical Emergency'
  | 'Workplace Conflict'
  | 'Security Breach';

export interface IncidentReport {
  id: string;
  caseNumber: string;
  siteId: string;
  siteName: string;
  reporterId: string;
  reporterName: string;
  type: IncidentType;
  severity: IncidentSeverity;
  timestamp: string;
  locationDetails: string;
  description: string;
  evidencePhotoUrl?: string;
  status: 'reported' | 'investigating' | 'contained' | 'resolved' | 'escalated_police';
  policeCaseRef?: string;
  assignedInvestigator?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface EquipmentItem {
  id: string;
  assetTag: string;
  name: string;
  category: 'Communication (Radio)' | 'Body Armor & Vest' | 'Surveillance & Detection' | 'Illumination' | 'Uniform & Boots' | 'Restraint';
  totalQuantity: number;
  issuedQuantity: number;
  inStockQuantity: number;
  maintenanceQuantity: number;
  serialNumber?: string;
  assignedToGuardId?: string;
  assignedToGuardName?: string;
  siteId?: string;
  condition: 'Optimal' | 'Requires Service' | 'Damaged';
  lastInspectionDate: string;
}

export interface LeaveRequest {
  id: string;
  guardId: string;
  guardName: string;
  leaveType: 'Annual Leave' | 'Sick Leave' | 'Compassionate' | 'Maternity/Paternity' | 'Emergency';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  reviewedBy?: string;
}

export interface ClientInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  billingPeriod: string;
  issueDate: string;
  dueDate: string;
  totalGuardsBilled: number;
  dayGuardHours: number;
  nightGuardHours: number;
  ratePerHourRWF: number;
  subtotalRWF: number;
  vatRWF: number; // 18% in Rwanda
  totalRWF: number;
  totalUSD: number;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

export interface PayrollRecord {
  id: string;
  monthYear: string;
  guardId: string;
  guardName: string;
  nationalId: string;
  baseSalaryRWF: number;
  overtimeHours: number;
  overtimePayRWF: number;
  nightAllowanceRWF: number;
  transportStipendRWF: number;
  grossPayRWF: number;
  rssbDeductionRWF: number; // Rwanda Social Security Board pension (approx 3%)
  ramaHealthDeductionRWF: number; // RAMA medical (approx 3.75%)
  payeTaxRWF: number; // Rwandan Pay-As-You-Earn tax
  netSalaryRWF: number;
  netSalaryUSD: number;
  paymentStatus: 'processed' | 'pending' | 'hold';
  bankName: string;
  accountNumber: string;
}

export interface CompanyAnnouncement {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  priority: 'routine' | 'urgent' | 'critical';
  content: string;
  targetAudience: 'All Staff' | 'Supervisors Only' | 'Guards Only' | 'Operations';
}
