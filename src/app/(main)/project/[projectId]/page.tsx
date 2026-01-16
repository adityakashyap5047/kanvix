import NotFound from '@/app/not-found';
import SprintBoard from '../_components/sprint-board';
import SprintCreationForm from '../_components/create-sprint';
import { getProject } from '@/actoins/project';
import { Project } from '@/app/lib/Types';

const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {

    const { projectId } = await params;

    const response = await getProject(projectId);

    if(!response.success || !response.data){ 
        return NotFound();
    }

    const project: Project = response.data;

    return (
        <div className='container mx-auto xl:max-w-[95%]'>
            {/* Sprint Creation  */}
            <SprintCreationForm
                projectTitle={project.name}
                projectId={projectId}
            />

            {/* sprint Board  */}
            {project.sprints && project.sprints.length > 0 ? (
                <SprintBoard 
                    sprints={project.sprints}
                    projectId={projectId}
                    orgId={project.organizationId}
                />
            ) : (
                <div>Create a Sprint From Above Button</div>
            )}
        </div>
    )
}

export default page