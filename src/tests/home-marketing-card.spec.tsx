import { describe, it, expect, vi, Mock } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { UserContext } from "@/context/user-context"
import { HomeMarketingCard } from "@/components/home-marketing-card"

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

describe("HomeMarketingCard", () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    ;(useRouter as Mock).mockReturnValue({
      push: mockPush,
    })
    mockPush.mockClear()
  })

  function renderWithUserContext(ui: React.ReactNode, { organizationId }: { organizationId: number | null }) {
    return render(
      <UserContext.Provider value={{ organizationId } as any}>
        {ui}
      </UserContext.Provider>
    )
  }

  it("should redirect to auth/sign-in when user is not authenticated", () => {
    renderWithUserContext(<HomeMarketingCard isAuthenticated={false} />, { organizationId: null })
    const button = screen.getByRole("button", { name: /Começar agora/i })
    fireEvent.click(button)
    expect(mockPush).toHaveBeenCalledWith("/auth/sign-in")
  })

  it("should redirect to create organization when user is authenticated but not have an organization id", () => {
    renderWithUserContext(<HomeMarketingCard isAuthenticated={true} />, { organizationId: null })
    const button = screen.getByRole("button", { name: /Começar agora/i })
    fireEvent.click(button)
    expect(mockPush).toHaveBeenCalledWith("/organizations/create-organization")
  })

  it("should redirect to organization page if user has part an organization", () => {
    renderWithUserContext(<HomeMarketingCard isAuthenticated={true} />, { organizationId: 42 })
    const button = screen.getByRole("button", { name: /Acessar minha organização/i })
    fireEvent.click(button)
    expect(mockPush).toHaveBeenCalledWith("/organizations/42")
  })
})
