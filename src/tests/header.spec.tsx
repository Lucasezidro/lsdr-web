import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { Header } from "@/components/header"

vi.mock("@tanstack/react-query", () => ({
  useQuery: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}))

describe("Header", () => {
  it("renders login link when not authenticated", () => {
    ;(useQuery as ReturnType<typeof vi.fn>).mockReturnValue({ data: null, isLoading: false })
    ;(usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/")

    render(<Header isAuthenticated={false} height="450px" />)

    expect(screen.getByText("Inicio")).toBeInTheDocument()
    expect(screen.getByText("Entrar")).toBeInTheDocument()
  })

  it("renders authenticated user data with organization", () => {
    ;(useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: {
        id: 1,
        name: "Lucas",
        email: "lucas@email.com",
        created_at: "",
        updated_at: "",
        organization_id: 123,
        invitation_status: "accepted",
        role: "ADMIN",
      },
      isLoading: false,
    })
    ;(usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/")

    render(<Header isAuthenticated={true} height="450px" />)

    expect(screen.getByText("Lucas")).toBeInTheDocument()
    expect(screen.getByText("Acessar organização")).toBeInTheDocument()
    expect(screen.getByText("Sair")).toBeInTheDocument()
  })

  it.skip("renders skeleton while loading user data", () => {
    render(<Header isAuthenticated={true} height="450px" />)

    expect(screen.getByTestId("loading-header")).toBeInTheDocument()
  })

  it("show headline when pathname is '/'", () => {
    render(<Header isAuthenticated={false} height="450px" />)

    expect(
      screen.getByText("Gerencie suas finanças e metas de forma inteligente.")
    ).toBeInTheDocument()
  })
})
