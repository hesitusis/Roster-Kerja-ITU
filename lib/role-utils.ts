import { Employee } from './types';

export interface RoleInfo {
  role: string;
  title: string;
  badgeLabel: string;
  badgeBg: string;
  textColor: string;
  isSuperAdmin: boolean;
  allowedDepts: string[];
  description: string;
}

export const OFFICIAL_DEPTS = ['SERVICE', 'HSE', 'HRGA FA', 'PART'] as const;

/**
 * Normalize department name to official department codes
 */
export function normalizeDept(dept?: string): string {
  if (!dept) return '';
  const d = dept.trim().toUpperCase().replace(/\s+/g, ' ');
  if (d === 'SERVICE' || d === 'SVC') return 'SERVICE';
  if (d === 'HSE' || d === 'SAFETY') return 'HSE';
  if (d.includes('HRGA') || d.includes('FA') || d === 'HR' || d === 'FINANCE') return 'HRGA FA';
  if (d === 'PART' || d === 'PARTS' || d === 'WAREHOUSE') return 'PART';
  return d;
}

/**
 * Check if a role has administrative privileges
 */
export function isUserAdmin(role?: string): boolean {
  if (!role) return false;
  const r = role.toLowerCase().trim();
  if (r === 'staff' || r === '' || r === 'user') return false;
  return r.includes('admin') || r.includes('head') || r.includes('supervisor');
}

/**
 * Parse the allowed departments an admin can EDIT
 */
export function getAllowedDepartments(role?: string, userDept?: string): string[] {
  if (!role || !isUserAdmin(role)) {
    return [];
  }

  const r = role.toLowerCase().trim();

  // Super Admin patterns
  if (
    r === 'admin' ||
    r === 'super_admin' ||
    r === 'superadmin' ||
    r === 'admin_all' ||
    r === 'admin_all_dept' ||
    r === 'admin_semua'
  ) {
    return ['ALL', 'SERVICE', 'HSE', 'HRGA FA', 'PART'];
  }

  const detected: string[] = [];

  // Check tokenized keywords for comma-separated or multi-dept roles:
  // e.g. "admin_service,hse,HRGA FA, Part" or "admin_service,hse"
  if (r.includes('service') || r.includes('svc')) detected.push('SERVICE');
  if (r.includes('hse') || r.includes('safety')) detected.push('HSE');
  if (r.includes('hrga') || r.includes('fa') || r.includes('hr')) detected.push('HRGA FA');
  if (r.includes('part') || r.includes('logistik')) detected.push('PART');

  // If role matched all 4 departments
  if (detected.length === 4) {
    return ['ALL', 'SERVICE', 'HSE', 'HRGA FA', 'PART'];
  }

  // If specific departments detected
  if (detected.length > 0) {
    return detected;
  }

  // Fallback: if role is just "admin" without dept name, use user's own department
  if (userDept) {
    const norm = normalizeDept(userDept);
    if (norm) return [norm];
  }

  return ['ALL', 'SERVICE', 'HSE', 'HRGA FA', 'PART'];
}

/**
 * Check if an admin can edit a specific department
 */
export function canAdminEditDepartment(adminRole?: string, targetDept?: string, adminDept?: string): boolean {
  if (!isUserAdmin(adminRole)) return false;
  const allowed = getAllowedDepartments(adminRole, adminDept);
  if (allowed.includes('ALL')) return true;
  if (!targetDept) return false;
  const targetNorm = normalizeDept(targetDept);
  return allowed.includes(targetNorm);
}

/**
 * Check if the active user can edit a specific employee's roster
 */
export function canEditEmployeeRoster(
  currentUser: Pick<Employee, 'role' | 'department'> | null | undefined,
  targetEmployee: Pick<Employee, 'department'> | null | undefined
): boolean {
  if (!currentUser || !isUserAdmin(currentUser.role)) return false;
  if (!targetEmployee) return false;
  return canAdminEditDepartment(currentUser.role, targetEmployee.department, currentUser.department);
}

/**
 * Get display info for a role (Title, Badge, Description)
 */
export function getRoleDisplayInfo(role?: string, userDept?: string): RoleInfo {
  if (!role || !isUserAdmin(role)) {
    return {
      role: 'staff',
      title: 'Staf Biasa',
      badgeLabel: 'Staff',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      textColor: 'text-slate-600',
      isSuperAdmin: false,
      allowedDepts: [],
      description: 'Dapat melihat jadwal pribadi dan mengajukan permohonan cuti / off.',
    };
  }

  const allowed = getAllowedDepartments(role, userDept);
  const isSuper = allowed.includes('ALL') || allowed.length >= 4;

  if (isSuper) {
    return {
      role: role || 'admin',
      title: 'Super Admin (Semua Departemen)',
      badgeLabel: 'Super Admin',
      badgeBg: 'bg-indigo-600 text-white border-indigo-700',
      textColor: 'text-indigo-600',
      isSuperAdmin: true,
      allowedDepts: ['SERVICE', 'HSE', 'HRGA FA', 'PART'],
      description: 'Hak akses penuh: Dapat memeriksa dan mengedit roster untuk semua departemen.',
    };
  }

  // Specific Department Admins
  if (allowed.length === 1) {
    const dept = allowed[0];
    if (dept === 'SERVICE') {
      return {
        role: 'admin_service',
        title: 'Admin Service',
        badgeLabel: 'Admin Service',
        badgeBg: 'bg-blue-600 text-white border-blue-700',
        textColor: 'text-blue-600',
        isSuperAdmin: false,
        allowedDepts: ['SERVICE'],
        description: 'Dapat memeriksa semua departemen, edit shift khusus departemen SERVICE.',
      };
    }
    if (dept === 'HSE') {
      return {
        role: 'admin_hse',
        title: 'Admin HSE',
        badgeLabel: 'Admin HSE',
        badgeBg: 'bg-emerald-600 text-white border-emerald-700',
        textColor: 'text-emerald-600',
        isSuperAdmin: false,
        allowedDepts: ['HSE'],
        description: 'Dapat memeriksa semua departemen, edit shift khusus departemen HSE.',
      };
    }
    if (dept === 'HRGA FA') {
      return {
        role: 'admin_hrga_fa',
        title: 'Admin HRGA FA',
        badgeLabel: 'Admin HRGA FA',
        badgeBg: 'bg-purple-600 text-white border-purple-700',
        textColor: 'text-purple-600',
        isSuperAdmin: false,
        allowedDepts: ['HRGA FA'],
        description: 'Dapat memeriksa semua departemen, edit shift khusus departemen HRGA FA.',
      };
    }
    if (dept === 'PART') {
      return {
        role: 'admin_part',
        title: 'Admin Part',
        badgeLabel: 'Admin Part',
        badgeBg: 'bg-amber-600 text-white border-amber-700',
        textColor: 'text-amber-600',
        isSuperAdmin: false,
        allowedDepts: ['PART'],
        description: 'Dapat memeriksa semua departemen, edit shift khusus departemen PART.',
      };
    }
  }

  // Multi-department admin
  return {
    role,
    title: `Admin (${allowed.join(', ')})`,
    badgeLabel: `Admin (${allowed.join(', ')})`,
    badgeBg: 'bg-teal-600 text-white border-teal-700',
    textColor: 'text-teal-600',
    isSuperAdmin: false,
    allowedDepts: allowed,
    description: `Dapat memeriksa semua departemen, edit shift untuk: ${allowed.join(', ')}.`,
  };
}

/**
 * Standard Role Options for UI Selectors and Role Assignment
 */
export const AVAILABLE_ROLE_OPTIONS = [
  {
    value: 'admin_service,hse,HRGA FA, Part',
    shortCode: 'super_admin',
    label: 'Super Admin (Semua Departemen)',
    subtitle: 'admin_service,hse,HRGA FA, Part',
    depts: ['SERVICE', 'HSE', 'HRGA FA', 'PART'],
    badge: 'Super Admin',
  },
  {
    value: 'admin_service',
    shortCode: 'admin_service',
    label: 'Admin Service',
    subtitle: 'Hanya Dept. SERVICE',
    depts: ['SERVICE'],
    badge: 'Admin SVC',
  },
  {
    value: 'admin_hse',
    shortCode: 'admin_hse',
    label: 'Admin HSE',
    subtitle: 'Hanya Dept. HSE',
    depts: ['HSE'],
    badge: 'Admin HSE',
  },
  {
    value: 'admin_hrga_fa',
    shortCode: 'admin_hrga_fa',
    label: 'Admin HRGA FA',
    subtitle: 'Hanya Dept. HRGA FA',
    depts: ['HRGA FA'],
    badge: 'Admin HRGA FA',
  },
  {
    value: 'admin_part',
    shortCode: 'admin_part',
    label: 'Admin Part',
    subtitle: 'Hanya Dept. PART',
    depts: ['PART'],
    badge: 'Admin PART',
  },
  {
    value: 'staff',
    shortCode: 'staff',
    label: 'Staff Biasa (Non-Admin)',
    subtitle: 'Akses Portal Karyawan',
    depts: [],
    badge: 'Staff',
  },
];

/**
 * Returns default department filter based on user role
 */
export function getDefaultDeptForUser(user?: Employee | null): string {
  if (!user) return 'ALL';
  const info = getRoleDisplayInfo(user.role, user.department);
  if (info.isSuperAdmin) return 'ALL';
  if (info.allowedDepts.length > 0) {
    return info.allowedDepts[0];
  }
  return 'ALL';
}

/**
 * Returns list of departments that should be primarily displayed for the user
 */
export function getVisibleDepartmentsForUser(user?: Employee | null): {
  isSuperAdmin: boolean;
  primaryDepts: string[];
  allDepts: string[];
} {
  const all = ['SERVICE', 'HSE', 'HRGA FA', 'PART'];
  if (!user) return { isSuperAdmin: true, primaryDepts: all, allDepts: all };
  const info = getRoleDisplayInfo(user.role, user.department);
  if (info.isSuperAdmin) {
    return {
      isSuperAdmin: true,
      primaryDepts: all,
      allDepts: all,
    };
  }
  return {
    isSuperAdmin: false,
    primaryDepts: info.allowedDepts.length > 0 ? info.allowedDepts : all,
    allDepts: all,
  };
}
