import { getOrganization } from '@/actions/organization';
import OrgSwitcher from '@/app/(main)/organization/[orgId]/_components/org-switcher';
import ProjectList from '@/app/(main)/organization/[orgId]/_components/project-list';
import React from 'react'
import UserIssues from './_components/user-issues';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const page = async ({ params }) => {
    
    const orgId = await params?.orgId;

    const organization = await getOrganization(orgId);

    const {userId} = auth();

    if (!userId) {
        redirect('/sign-in');
    }

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
                <UserIssues userId={userId} />
            </div>
        </div>
    )
}

export default page