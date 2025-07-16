import { getOrganization } from '@/actions/organization';
import React from 'react'

const page = async ({ params }) => {
    
    const orgId = await params?.orgId;

    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization not found</div>;
    }

    return (
        <div>
            <h1>{organization.name}&rsquo;s Projects</h1>
        </div>
    )
}

export default page