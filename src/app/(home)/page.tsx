import { Header } from "@/components/header";
import { HomeMarketingCard } from "@/components/home-marketing-card";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="flex flex-col items-center justify-between">
      <Header isAuthenticated={isAuthenticated} height="450" />

      <HomeMarketingCard isAuthenticated={isAuthenticated} />
    </main>
  )
}
