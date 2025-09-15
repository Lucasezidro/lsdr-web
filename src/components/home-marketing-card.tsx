'use client'

import { homeMarketingCards } from "@/helpers/home-marketing-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";

export function HomeMarketingCard({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter()

  const { organizationId } = useContext(UserContext)
  
  const startNowRedirect = () => {
    isAuthenticated ? router.push('/organizations/create-organization') : router.push('/auth/sign-in')
  }

  const alreadyHasOrganizationRedirect = () => {
    if (organizationId) {
      router.push(`/organizations/${organizationId}`)
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-6 px-20 w-full">
        {homeMarketingCards.map((item) => {
          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                {item.icon}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Button 
        className="mt-10 bg-cyan-500 font-bold w-[400px] cursor-pointer hover:bg-cyan-600"
        onClick={organizationId ? alreadyHasOrganizationRedirect : startNowRedirect}
      >
        {organizationId ? 'Acessar minha organização' : 'Começar agora'}
      </Button>
    </>
  )
}