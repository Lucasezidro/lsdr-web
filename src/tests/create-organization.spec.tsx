import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateOrganizationForm } from "@/app/organizations/create-organization/create-organization-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useFormState } from "@/hooks/useFormState";
import { UserContext } from "@/context/user-context";
import { useContext, useEffect } from "react";
import { createOrganization } from "@/api/organizations/create-organization";
import { createOrganizationAction } from "@/app/organizations/create-organization/actions";
import { AxiosError } from "axios";

vi.mock('@/api/organizations/create-organization', () => ({
  createOrganization: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/hooks/useFormState", () => ({
  useFormState: vi.fn(),
}));

vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useContext: vi.fn(),
    useEffect: vi.fn(),
  };
});

describe("CreateOrganizationForm", () => {
  const mockRouterPush = vi.fn();
  const mockCreateOrganizationAction = vi.fn();
  const mockUserContext = { organizationId: null };

  const mockValidData = {
    company_name: 'Teste Inc.',
    document_number: '12.345.678/0001-90',
    founding_date: '2020-01-01',
    email: 'contact@testeinc.com',
    phone: '11987654321',
    website_url: 'https://testeinc.com',
    description: 'Empresa de teste para criar um payload.',
  };

  const mockFormData = new FormData();
  Object.entries(mockValidData).forEach(([key, value]) => {
    mockFormData.append(key, value);
  })

  beforeEach(() => {
    vi.clearAllMocks();

    (useRouter as Mock).mockReturnValue({
      push: mockRouterPush,
    });
    
    (useContext as Mock).mockReturnValue(mockUserContext);

    (useEffect as Mock).mockImplementation((callback) => callback());
    
    (useFormState as Mock).mockReturnValue([
      { errors: null, success: null, message: null },
      mockCreateOrganizationAction,
      false,
    ])
  });

  it("should redirect the user if they already have an organization", () => {
    (useContext as Mock).mockReturnValue({ organizationId: 'org123' })
    render(<CreateOrganizationForm />)
    
    expect(mockRouterPush).toHaveBeenCalledWith("/organizations/org123");
  })

  it('should return success and call the API on valid data', async () => {
    vi.mocked(createOrganization).mockResolvedValueOnce(undefined);

    const result = await createOrganizationAction(mockFormData);

    expect(result.success).toBe(true);
    expect(result.message).toBeNull();
    expect(result.errors).toBeNull();

    expect(createOrganization).toHaveBeenCalledWith(mockValidData);
  })

  it('should return a message on an Axios error', async () => {
    const errorMessage = 'O CNPJ já está em uso.';
    const mockAxiosError = new AxiosError(
      errorMessage,
      '400',
      undefined,
      undefined,
      {
        data: {
          message: errorMessage
        },
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config: {}
      }
    );
    
    vi.mocked(createOrganization).mockRejectedValueOnce(mockAxiosError);

    const result = await createOrganizationAction(mockFormData);

    expect(result.success).toBe(false);
    expect(result.message).toEqual(errorMessage);
    expect(result.errors).toBeNull();
  })

  it("should render all form fields and the submit button", () => {
    render(<CreateOrganizationForm />)
    
    expect(screen.getByPlaceholderText("Nome da empresa")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("CNPJ")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Data de criação")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Website")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Telefone")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Descrição")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Criar Organização" })).toBeInTheDocument()
  })

  it("should display error messages on invalid submission", () => {
    const mockState = {
      errors: { company_name: ["Nome da empresa é obrigatório."] },
      success: false,
      message: "Erro de validação",
    };
    (useFormState as Mock).mockReturnValue([mockState, mockCreateOrganizationAction, false])
    
    render(<CreateOrganizationForm />)
    
    expect(screen.getByText("Nome da empresa é obrigatório.")).toBeInTheDocument()
  })
  
  it("should disable the submit button when the form is pending", () => {
    (useFormState as Mock).mockReturnValue([
      { errors: null, success: null, message: null },
      mockCreateOrganizationAction,
      true,
    ])
    
    render(<CreateOrganizationForm />)
    
    const submitButton = screen.getByRole("button", { name: "Criar Organização" })
    expect(submitButton).toBeDisabled()
  })

  it('should return a generic message on unexpected errors', async () => {
    vi.mocked(createOrganization).mockRejectedValueOnce(new Error('Um erro inesperado.'))

    const result = await createOrganizationAction(mockFormData)

    expect(result.success).toBe(false)
    expect(result.message).toEqual('Um erro inesperado ocorreu, tente novamente em alguns minutos.')
    expect(result.errors).toBeNull()
  })
})