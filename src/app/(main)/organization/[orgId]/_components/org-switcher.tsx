"use client";

import { OrganizationSwitcher, SignedIn, useOrganization, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const OrgSwitcher = () => {
    const { isLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const pathname = usePathname();

    if (!isLoaded || !isUserLoaded) {
        return null;
    }

    return <div>
        <SignedIn>
            <OrganizationSwitcher 
                hidePersonal
                afterCreateOrganizationUrl="/organization/:slug"
                afterSelectOrganizationUrl={pathname === "/project/create" ? "" : "/organization/:slug"}
                createOrganizationMode={
                    pathname === "/onboarding" ? "navigation" : undefined
                }
                createOrganizationUrl="/onboarding"
                appearance={{
                    elements: {
                        organizationSwitcherTrigger: "!border border-gray-300 rounded-md !px-5 py-2",
                        organizationSwitcherTriggerIcon: "text-white"
                    }
                }}
            />
        </SignedIn>
    </div>
}

export default OrgSwitcher