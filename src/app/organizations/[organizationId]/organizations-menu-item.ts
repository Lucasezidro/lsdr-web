interface MenuItemResponse {
  title: string
  href: string
  authorized: boolean
}

type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE"

export function organizationsMenuItem(
  userRole: UserRole,
  organizationId: number
): MenuItemResponse[] {
  const menuItems = [
    {
      title: "Ver todas transações",
      href: `/organizations/${organizationId}/transactions`,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      title: "Minhas metas",
      href: `/organizations/${organizationId}/goals`,
      roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    },
    {
      title: "Membros",
      href: `/organizations/${organizationId}/members`,
      roles: ["ADMIN", "MANAGER"],
    },
  ]

  return menuItems.map(item => ({
    title: item.title,
    href: item.href,
    authorized: item.roles.includes(userRole),
  }))
}
