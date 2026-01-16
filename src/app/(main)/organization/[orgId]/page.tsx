import UserIssues from './_components/user-issues';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import OrgSwitcher from './_components/org-switcher';
import { getOrganization } from '@/actoins/organization';
import ProjectList from './_components/project-list';

const page = async ({ params }: { params: Promise<{ orgId: string }> }) => {
    
    const { orgId } = await params;

    const response = await getOrganization(orgId);

    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in');
    }

    if (!response.success) {
        return <div className="container px-8 mx-auto gradient-title-error text-4xl text-center pt-12">Organization not found</div>;
    }

    const organization = response.data;

    return (
        <div className='container px-8 mx-auto'>
            <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>
                <h1 className='text-5xl font-bold gradient-title pb-2'>{organization?.name}&rsquo;s Projects</h1>

                <div>
                    <OrgSwitcher />
                </div>
            </div>
            <div className='mb-4'>
                <ProjectList orgId={organization?.id ?? ""}/>
            </div>
            <div className='mt-8'>
                <UserIssues userId={userId} />
            </div>
        </div>
    )
}

export default page