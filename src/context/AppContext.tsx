import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  GuardProfile,
  SecuritySite,
  AttendanceRecord,
  PatrolRoute,
  IncidentReport,
  EquipmentItem,
  ClientInvoice,
  PayrollRecord,
  CompanyAnnouncement,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SITES,
  INITIAL_GUARDS,
  INITIAL_ATTENDANCE,
  INITIAL_PATROLS,
  INITIAL_INCIDENTS,
  INITIAL_EQUIPMENT,
  INITIAL_INVOICES,
  INITIAL_PAYROLL,
  INITIAL_ANNOUNCEMENTS,
} from '../data/mockData';

export type AppView =
  | 'control_room'
  | 'guards'
  | 'deployment'
  | 'patrols'
  | 'attendance'
  | 'incidents'
  | 'guard_app'
  | 'clients'
  | 'hr'
  | 'finance'
  | 'inventory'
  | 'ai_assistant'
  | 'comms';

interface ActiveSosAlert {
  id: string;
  guardId: string;
  guardName: string;
  siteName: string;
  timestamp: string;
  coordinates: { lat: number; lng: number };
  status: 'dispatched' | 'contained' | 'resolved';
}

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Data
  guards: GuardProfile[];
  addGuard: (guard: Omit<GuardProfile, 'id' | 'employeeNumber'>) => void;
  updateGuard: (id: string, updates: Partial<GuardProfile>) => void;
  reassignGuardSite: (guardId: string, targetSiteId: string) => void;

  sites: SecuritySite[];
  updateSiteInstructions: (siteId: string, instructions: string[]) => void;

  attendance: AttendanceRecord[];
  clockInGuard: (guardId: string, siteId: string, gps: { lat: number; lng: number }, qrVerified: boolean) => void;
  clockOutGuard: (recordId: string) => void;
  verifyAttendanceBySupervisor: (recordId: string) => void;

  patrols: PatrolRoute[];
  scanCheckpoint: (routeId: string, checkpointId: string, scannedBy: string, notes?: string) => void;

  incidents: IncidentReport[];
  reportIncident: (incident: Omit<IncidentReport, 'id' | 'caseNumber' | 'timestamp'>) => void;
  updateIncidentStatus: (id: string, status: IncidentReport['status'], resolutionNotes?: string) => void;

  equipment: EquipmentItem[];
  issueEquipment: (equipmentId: string, guardId: string, guardName: string) => void;
  returnEquipment: (equipmentId: string) => void;

  invoices: ClientInvoice[];
  payroll: PayrollRecord[];
  announcements: CompanyAnnouncement[];
  addAnnouncement: (announcement: Omit<CompanyAnnouncement, 'id' | 'date'>) => void;

  // Emergency SOS
  activeSos: ActiveSosAlert | null;
  triggerSos: (guardId: string, siteName: string, coords?: { lat: number; lng: number }) => void;
  resolveSos: () => void;

  // Selected filters / navigation shortcuts
  selectedSiteId: string | null;
  setSelectedSiteId: (siteId: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [currentView, setCurrentView] = useState<AppView>('control_room');
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  // States with local storage initialization
  const [guards, setGuards] = useState<GuardProfile[]>(() => {
    const saved = localStorage.getItem('fg_guards');
    return saved ? JSON.parse(saved) : INITIAL_GUARDS;
  });

  const [sites, setSites] = useState<SecuritySite[]>(() => {
    const saved = localStorage.getItem('fg_sites');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('fg_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [patrols, setPatrols] = useState<PatrolRoute[]>(() => {
    const saved = localStorage.getItem('fg_patrols');
    return saved ? JSON.parse(saved) : INITIAL_PATROLS;
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('fg_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [equipment, setEquipment] = useState<EquipmentItem[]>(() => {
    const saved = localStorage.getItem('fg_equipment');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [invoices] = useState<ClientInvoice[]>(INITIAL_INVOICES);
  const [payroll] = useState<PayrollRecord[]>(INITIAL_PAYROLL);

  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>(() => {
    const saved = localStorage.getItem('fg_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [activeSos, setActiveSos] = useState<ActiveSosAlert | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fg_guards', JSON.stringify(guards));
  }, [guards]);

  useEffect(() => {
    localStorage.setItem('fg_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('fg_patrols', JSON.stringify(patrols));
  }, [patrols]);

  useEffect(() => {
    localStorage.setItem('fg_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('fg_equipment', JSON.stringify(equipment));
  }, [equipment]);

  const switchRole = (role: UserRole) => {
    const matched = INITIAL_USERS.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      // Auto route to appropriate default view for that role
      if (role === 'guard') {
        setCurrentView('guard_app');
      } else if (role === 'client') {
        setCurrentView('clients');
      } else if (role === 'hr_manager') {
        setCurrentView('hr');
      } else if (role === 'finance_manager') {
        setCurrentView('finance');
      } else if (role === 'control_room_operator') {
        setCurrentView('control_room');
      } else if (role === 'supervisor') {
        setCurrentView('patrols');
      } else if (role === 'operations_manager') {
        setCurrentView('deployment');
      }
    }
  };

  const addGuard = (guardData: Omit<GuardProfile, 'id' | 'employeeNumber'>) => {
    const newId = `grd_${Date.now()}`;
    const empNum = `FG-${Math.floor(1000 + Math.random() * 9000)}`;
    const newGuard: GuardProfile = {
      ...guardData,
      id: newId,
      employeeNumber: empNum,
    };
    setGuards((prev) => [newGuard, ...prev]);
  };

  const updateGuard = (id: string, updates: Partial<GuardProfile>) => {
    setGuards((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const reassignGuardSite = (guardId: string, targetSiteId: string) => {
    const targetSite = sites.find((s) => s.id === targetSiteId);
    if (!targetSite) return;

    setGuards((prev) =>
      prev.map((g) =>
        g.id === guardId
          ? {
              ...g,
              currentSiteId: targetSite.id,
              currentSiteName: targetSite.name,
            }
          : g
      )
    );
  };

  const updateSiteInstructions = (siteId: string, instructions: string[]) => {
    setSites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, postInstructions: instructions } : s))
    );
  };

  const clockInGuard = (
    guardId: string,
    siteId: string,
    gps: { lat: number; lng: number },
    qrVerified: boolean
  ) => {
    const guard = guards.find((g) => g.id === guardId);
    const site = sites.find((s) => s.id === siteId);
    if (!guard || !site) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      guardId,
      guardName: guard.fullName,
      siteId,
      siteName: site.name,
      date: dateStr,
      clockInTime: timeStr,
      shift: guard.assignedShift,
      status: 'on_time',
      gpsCoordinates: {
        lat: gps.lat,
        lng: gps.lng,
        accuracyMeters: 3.5,
      },
      qrCodeScanned: qrVerified,
      overtimeHours: 0,
      supervisorVerified: true,
      notes: 'GPS geo-perimeter verified within authorized guard post.',
    };

    setAttendance((prev) => [newRecord, ...prev]);
    updateGuard(guardId, { employmentStatus: 'on_duty' });
  };

  const clockOutGuard = (recordId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          return {
            ...r,
            clockOutTime: timeStr,
          };
        }
        return r;
      })
    );
  };

  const verifyAttendanceBySupervisor = (recordId: string) => {
    setAttendance((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, supervisorVerified: true, status: 'verified' } : r))
    );
  };

  const scanCheckpoint = (
    routeId: string,
    checkpointId: string,
    scannedBy: string,
    notes?: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPatrols((prev) =>
      prev.map((route) => {
        if (route.id === routeId) {
          const updatedCheckpoints = route.checkpoints.map((cp) => {
            if (cp.id === checkpointId) {
              return {
                ...cp,
                scannedAt: timeStr,
                scannedBy,
                status: 'scanned' as const,
                notes: notes || cp.notes,
              };
            }
            return cp;
          });

          const allScanned = updatedCheckpoints.every((cp) => cp.status === 'scanned');

          return {
            ...route,
            checkpoints: updatedCheckpoints,
            status: allScanned ? ('completed' as const) : ('in_progress' as const),
            lastCompletedAt: allScanned ? timeStr : route.lastCompletedAt,
          };
        }
        return route;
      })
    );
  };

  const reportIncident = (
    incidentData: Omit<IncidentReport, 'id' | 'caseNumber' | 'timestamp'>
  ) => {
    const now = new Date();
    const year = now.getFullYear();
    const rand = Math.floor(100 + Math.random() * 900);
    const caseNumber = `FG-INC-${year}-${rand}`;
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    const newReport: IncidentReport = {
      ...incidentData,
      id: `inc_${Date.now()}`,
      caseNumber,
      timestamp: timestampStr,
    };

    setIncidents((prev) => [newReport, ...prev]);
  };

  const updateIncidentStatus = (
    id: string,
    status: IncidentReport['status'],
    resolutionNotes?: string
  ) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status,
              resolutionNotes: resolutionNotes || inc.resolutionNotes,
              resolvedAt:
                status === 'resolved' || status === 'contained'
                  ? new Date().toLocaleString()
                  : inc.resolvedAt,
            }
          : inc
      )
    );
  };

  const issueEquipment = (equipmentId: string, guardId: string, guardName: string) => {
    setEquipment((prev) =>
      prev.map((eq) => {
        if (eq.id === equipmentId && eq.inStockQuantity > 0) {
          return {
            ...eq,
            issuedQuantity: eq.issuedQuantity + 1,
            inStockQuantity: eq.inStockQuantity - 1,
            assignedToGuardId: guardId,
            assignedToGuardName: guardName,
          };
        }
        return eq;
      })
    );
  };

  const returnEquipment = (equipmentId: string) => {
    setEquipment((prev) =>
      prev.map((eq) => {
        if (eq.id === equipmentId && eq.issuedQuantity > 0) {
          return {
            ...eq,
            issuedQuantity: eq.issuedQuantity - 1,
            inStockQuantity: eq.inStockQuantity + 1,
            assignedToGuardId: undefined,
            assignedToGuardName: undefined,
          };
        }
        return eq;
      })
    );
  };

  const addAnnouncement = (ann: Omit<CompanyAnnouncement, 'id' | 'date'>) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const newAnn: CompanyAnnouncement = {
      ...ann,
      id: `ann_${Date.now()}`,
      date: dateStr,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const triggerSos = (
    guardId: string,
    siteName: string,
    coords: { lat: number; lng: number } = { lat: -1.9536, lng: 30.0911 }
  ) => {
    const guard = guards.find((g) => g.id === guardId) || { fullName: 'Patrol Officer' };
    const alert: ActiveSosAlert = {
      id: `sos_${Date.now()}`,
      guardId,
      guardName: guard.fullName,
      siteName,
      timestamp: new Date().toLocaleTimeString(),
      coordinates: coords,
      status: 'dispatched',
    };
    setActiveSos(alert);
    // Also record an incident
    reportIncident({
      siteId: 'site_kbc_park',
      siteName,
      reporterId: guardId,
      reporterName: guard.fullName,
      type: 'Security Breach',
      severity: 'critical',
      locationDetails: `SOS Emergency Beacon Triggered at ${siteName}`,
      description: `Immediate officer distress signal dispatched from mobile guard terminal. Coordinates: ${coords.lat.toFixed(
        4
      )}, ${coords.lng.toFixed(4)}. Rapid Tactical Response Unit deployed.`,
      status: 'investigating',
    });
  };

  const resolveSos = () => {
    setActiveSos(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        currentView,
        setCurrentView,
        guards,
        addGuard,
        updateGuard,
        reassignGuardSite,
        sites,
        updateSiteInstructions,
        attendance,
        clockInGuard,
        clockOutGuard,
        verifyAttendanceBySupervisor,
        patrols,
        scanCheckpoint,
        incidents,
        reportIncident,
        updateIncidentStatus,
        equipment,
        issueEquipment,
        returnEquipment,
        invoices,
        payroll,
        announcements,
        addAnnouncement,
        activeSos,
        triggerSos,
        resolveSos,
        selectedSiteId,
        setSelectedSiteId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
