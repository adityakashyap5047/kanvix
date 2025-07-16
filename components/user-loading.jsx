"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { BarLoader } from "react-spinners";

const UserLoading = () => {
    const { isLoaded } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();

    if (!isLoaded || !isUserLoaded) {
        return <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>;
    }
    else {
        return <></>;
    }
}

export default UserLoading;