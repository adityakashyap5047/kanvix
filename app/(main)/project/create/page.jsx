"use client";

import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const CreateProjectPage = () => {

  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if(isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if(!isAdmin){
    return(
      <div className="flex flex-col gap-4 items-center">
        <span className="text-2xl gradient-title">Oops! Only Admins can create project Schema.</span>
        <OrgSwitcher />
      </div>
    )
  }

  return (
    <div>CreateProjectPage</div>
  )
}

export default CreateProjectPage