import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { signUp } from "@/api/users/sign-up";
import { SignUpForm } from "@/app/auth/sign-up/sign-up-form";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("react-hook-form", () => ({
  useForm: vi.fn(),
}));

vi.mock("@/api/users/sign-up");

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("SignUpForm", () => {
  const mockRouterPush = vi.fn();
  const mockCreateUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useRouter as Mock).mockReturnValue({
      push: mockRouterPush,
    });
    
    (useMutation as Mock).mockReturnValue({
      mutateAsync: mockCreateUser,
      isPending: false,
    });
    
    (useForm as Mock).mockReturnValue({
      register: vi.fn(),
      handleSubmit: (callback: any) => (e: any) => {
        e.preventDefault();
        callback();
      },
      formState: { errors: {} },
    });
  });

  // --- RENDERING TESTS ---
  it("should render all form fields", () => {
    render(<SignUpForm />);

    expect(screen.getByPlaceholderText("Digite o seu e-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o seu Nome Completo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Escolha sua senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirme a senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o seu logradouro")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o Número da residência")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o seu bairro")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite a cidade")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o Estado")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite o CEP")).toBeInTheDocument();
  });

  it("should have a link to the sign-in page", () => {
    render(<SignUpForm />);
    const signInLink = screen.getByRole("link", { name: "Fazer login" });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/auth/sign-in");
  });

  // --- SUBMISSION AND LOGIC TESTS ---
  it("should call createUser on successful form submission", async () => {
    const mockFormData = {
      user: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        password_confirmation: 'password123',
        address_attributes: {
          street: 'Test St',
          number: '123',
          complement: 'Apt 1',
          neighborhood: 'Testville',
          city: 'Test City',
          state: 'TS',
          zip_code: '12345-678',
        }
      }
    };

    (useForm as Mock).mockReturnValue({
      register: vi.fn(),
      handleSubmit: (callback: any) => (e: any) => {
        e.preventDefault();
        callback(mockFormData);
      },
      formState: { errors: {} },
    });

    render(<SignUpForm />);
    
    fireEvent.submit(screen.getByRole("button", { name: "Criar conta" }));

    expect(mockCreateUser).toHaveBeenCalledWith(mockFormData.user);
  })

  it("should display validation errors when useFormState returns errors", () => {
    const mockErrors = {
      user: {
        email: { message: "Email inválido." },
        name: { message: "Nome é obrigatório." },
      },
    };

    (useForm as Mock).mockReturnValue({
      register: vi.fn(),
      handleSubmit: vi.fn(),
      formState: { errors: mockErrors },
    });

    render(<SignUpForm />);

    expect(screen.getByText("Email inválido.")).toBeInTheDocument()
    expect(screen.getByText("Nome é obrigatório.")).toBeInTheDocument()
  })

  it("should disable the button while form is pending", () => {
    (useMutation as Mock).mockReturnValue({
      mutateAsync: mockCreateUser,
      isPending: true,
    })

    render(<SignUpForm />)

    const submitButton = screen.getByRole("button", { name: "Criar conta" })
    expect(submitButton).toBeDisabled()
  })
})
