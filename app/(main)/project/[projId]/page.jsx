import { getProject } from '@/actions/project';
import NotFound from '@/app/not-found';
import SprintCreationForm from '@/components/create-sprint';
import React from 'react'

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
        <></>
      ) : (
        <div>Create a Sprint From Above Button</div>
      )}
    </div>
  )
}

export default page