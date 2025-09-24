import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { UserContext } from "@/context/user-context";
import { toast } from "sonner";
import { UserContextType } from "@/context/user-context"
import { CreateTransaction } from "@/app/organizations/[organizationId]/transactions/create-transaction";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useForm: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe("CreateTransaction", () => {
  
  const mockUserContext: UserContextType = {
    organizationId: 1,
    role: "ADMIN" as const,
    userId: 1,
  };

  const mockQueryClient = {
    refetchQueries: vi.fn(),
  };

  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useMutation as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    (useQueryClient as Mock).mockReturnValue(mockQueryClient)
  });

  it("should render the create transaction button", () => {
    render(<CreateTransaction />);
    expect(screen.getByRole("button", { name: "Cadastrar transação" })).toBeInTheDocument();
  });

  // TODO - Fix this test
  it.skip("should create a transaction and refetch queries on success", async () => {
    mockMutateAsync.mockResolvedValueOnce({});

    render(
      <UserContext.Provider value={mockUserContext}>
        <CreateTransaction />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar transação" }))

    const formElement = await waitFor(() => screen.getByRole("form"))

    fireEvent.submit(formElement);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        orgId: 1,
        transaction: {
          description: "Teste",
          amount: 100,
          date: "2025-09-24",
          transaction_type: "income",
        },
      })
    })

    expect(mockQueryClient.refetchQueries).toHaveBeenCalledTimes(2);
    expect(mockQueryClient.refetchQueries).toHaveBeenCalledWith({
      queryKey: ["transactions", 1],
      type: "active",
    });
    expect(mockQueryClient.refetchQueries).toHaveBeenCalledWith({
      queryKey: ["dashboard", 1],
      type: "active",
    });

    expect(toast.success).toHaveBeenCalledWith("Transação criada com sucesso!");    
  })

  it.skip("should show an error toast on mutation failure", async () => {
    mockMutateAsync.mockRejectedValue(new Error("Erro de teste"));

    render(
      <UserContext.Provider value={mockUserContext}>
        <CreateTransaction />
      </UserContext.Provider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Cadastrar transação" }));
    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Erro ao criar transação. Tente novamente.");
    });
  });
});