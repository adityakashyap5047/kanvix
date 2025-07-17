import { getOrganization } from '@/actions/organization';
import OrgSwitcher from '@/components/org-switcher';
import ProjectList from '@/components/project-list';
import React from 'react'

const page = async ({ params }) => {
    
    const orgId = await params?.orgId;

    const organization = await getOrganization(orgId);

    if (!organization) {
        return <div>Organization not found</div>;
    }

    return (
        <div className='container px-8 mx-auto'>
            <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>
                <h1 className='text-5xl font-bold gradient-title pb-2'>{organization.name}&rsquo;s Projects</h1>

                <div>
                    <OrgSwitcher />
                </div>
            </div>
            <div className='mb-4'>
                <ProjectList orgId={organization.id}/>
            </div>
            <div className='mt-8'>
                Show user assigned and reported issues here
            </div>
        </div>
    )
}

export default page