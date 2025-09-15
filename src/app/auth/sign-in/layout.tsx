import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    redirect('/')
  }

  return (
    <main className="flex flex-col items-center">
      {children}
    </main>
  );
}
