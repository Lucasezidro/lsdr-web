import { ShortHeader } from "@/components/short-header";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function OrganizationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    redirect('/auth/sign-in')
  }

  return (
    <main className="flex flex-col items-center">
      <ShortHeader isAuthenticated={isAuthenticated} />
      {children}
    </main>
  );
}
