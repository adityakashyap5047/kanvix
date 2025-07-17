import { getProject } from '@/actions/project';
import NotFound from '@/app/not-found';
import React from 'react'
import SprintBoard from '../_components/sprint-board';
import SprintCreationForm from '../_components/create-sprint';

const page = async ({params}) => {

  const projId = await params?.projId;

  const project = await getProject(projId);

  if(!project) {
    return NotFound();
  }

  return (
    <div className='container mx-auto xl:max-w-[95%]'>
      {/* Sprint Creation  */}
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {/* sprint Board  */}
      {project.sprints.length > 0 ? (
        <SprintBoard 
          sprints={project.sprints}
          projectId={projId}
          orgId={project.organizationId}
        />
      ) : (
        <div>Create a Sprint From Above Button</div>
      )}
    </div>
  )
}

export default page