export function usePermissions(userRole: 'ADMIN' | 'MANAGER' | 'EMPLOYEE') {
  const canManagement = userRole === 'ADMIN' || userRole === 'MANAGER'
  const isAdmin = userRole === 'ADMIN'

  return { 
    canManagement,
    isAdmin,
  }
}