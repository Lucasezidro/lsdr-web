import { describe, it, expect, vi, Mock } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { useRouter } from "next/navigation"
import { SignInForm } from "@/app/auth/sign-in/sign-in-form"
import { useFormState } from "@/hooks/useFormState"
import { signIn } from "@/api/users/sign-in"
import { cookies } from "next/headers"
import { signInAction } from "@/app/auth/sign-in/actions"
import { AxiosError } from "axios"

vi.mock('next/headers')
vi.mock('@/api/users/sign-in')

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}))

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
  },
}))

vi.mock("@/hooks/useFormState", () => ({
  useFormState: vi.fn(),
}))

vi.mock("@/hooks/useFormState", () => ({
  useFormState: vi.fn(() => [{ errors: null, success: null, message: null }, vi.fn(), false]),
}))

describe("SignInForm", () => {
  const mockPush = vi.fn()
  const mockValidData = {
    email: 'test@example.com',
    password: 'password123',
  }

  const mockToken = 'mock-auth-token';
  const mockUser = { id: 1, name: 'Test User' }

  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({
      push: mockPush,
    });
    mockPush.mockClear();
    vi.clearAllMocks();

    vi.mocked(signIn).mockResolvedValue({
      token: mockToken,
      user: mockUser,
    });
  })

  it("should render email input", () => {
    render(<SignInForm />)
    const email = screen.getByPlaceholderText("Digite o seu e-mail")
    expect(email).toBeInTheDocument()
  })

  it("should render password input", () => {
    render(<SignInForm />)
    const password = screen.getByPlaceholderText("Digite a sua senha")
    expect(password).toBeInTheDocument()
  })

  it("should have the correct link for account registration", () => {
    render(<SignInForm />)
    const registerLink = screen.getByText("Registrar conta")
    expect(registerLink).toHaveAttribute("href", "/auth/sign-up")
  })

  it("should render error message on invalid credentials", async () => {
    const mockState = {
      errors: null,
      success: false,
      message: 'Os dados de login estão incorretos, por favor, tente novamente.'
    };
    
    (useFormState as Mock).mockReturnValue([mockState, vi.fn(), false])

    render(<SignInForm />);

    expect(screen.getByText("Erro ao fazer o login!")).toBeInTheDocument()
    expect(screen.getByText("Os dados de login estão incorretos, por favor, tente novamente.")).toBeInTheDocument()
  })

  it('should return success and set cookies on valid credentials', async () => {
    const formData = new FormData()
    formData.append('email', mockValidData.email)
    formData.append('password', mockValidData.password)

    const mockCookieSet = vi.fn()
    vi.mocked(cookies).mockReturnValue({
      set: mockCookieSet,
    });

    const result = await signInAction(formData);

    expect(result.success).toBe(true)
    expect(result.message).toBeNull()
    expect(result.errors).toBeNull()

    expect(signIn).toHaveBeenCalledWith(mockValidData);

    expect(mockCookieSet).toHaveBeenCalledWith('token', mockToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    expect(mockCookieSet).toHaveBeenCalledWith('userId', mockUser.id)
  })

  it('should return validation errors on invalid data', async () => {
    const formData = new FormData()
    formData.append('email', 'invalid-email')

    const result = await signInAction(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBeNull()
    expect(result.errors).toEqual({
      email: ['Por favor, digite um e-mail válido.'],
      password: ['Invalid input: expected string, received undefined'],
    })

    expect(signIn).not.toHaveBeenCalled()
  })

  it('should return a message on Axios error', async () => {
    vi.mocked(signIn).mockRejectedValue(new AxiosError('Unauthorized', '401', {
      status: 401,
      statusText: 'Unauthorized',
      headers: {},
      config: {},
    }, {
      message: 'Unauthorized'
    }));

    const formData = new FormData();
    formData.append('email', mockValidData.email);
    formData.append('password', mockValidData.password);

    const result = await signInAction(formData);

    expect(result.success).toBe(false);
    expect(result.message).toEqual('Unauthorized');
    expect(result.errors).toBeNull();
  })

  it('should return a generic message on unexpected errors', async () => {
    vi.mocked(signIn).mockRejectedValue(new Error('Um erro inesperado.'));

    const formData = new FormData();
    formData.append('email', mockValidData.email)
    formData.append('password', mockValidData.password)

    const result = await signInAction(formData)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Um erro inesperado ocorreu, tente novamente em alguns minutos.')
    expect(result.errors).toBeNull()
  })
})