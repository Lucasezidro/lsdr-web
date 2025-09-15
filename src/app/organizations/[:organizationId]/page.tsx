import { OrganizationsMenu } from "./organizations-menu";
import { OrganizationDetails } from "./organizationsDetails";

export default async function OrganizationPage() {

  return (
    <div className="p-10 relative w-[1260px]">
      <OrganizationDetails />

      <OrganizationsMenu />
    </div>
  )
}