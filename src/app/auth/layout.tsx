import { Header } from "@/components/header";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    redirect('/auth/sign-in')
  }

  return (
    <main className="flex flex-col items-center">
      {children}
    </main>
  );
}
