"use client";

import React from 'react'
import SprintManager from './sprint-manager';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import status from '@/data/status';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import IssueCreationDrawer from './create-issue';

const SprintBoard = ({ sprints, projectId, orgId }) => {

    const [currentSprint, setCurrentSprint] = React.useState(
        sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [selectedStatus, setSelectedStatus] = React.useState(null);

    const handleAddIssue = (status) => {
      setSelectedStatus(status);
      setIsDrawerOpen(true);
    }

    const handleIssueCreated = (issue) => {
      //fetch issue again
    }

    const onDragEnd = () => {};

  return (
    <div>
        <SprintManager
            sprint={currentSprint}
            setSprint={setCurrentSprint}
            sprints={sprints}
            projectId={projectId}
        />

        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 !bg-slate-900 p-4'>
            {status.map((column) => (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => {
                  return <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                    <h3 className='font-semibold mb-2 text-center'>{column.name}</h3>

                    {provided.placeholder}

                    {column.key === 'TODO' && currentSprint.status !== 'COMPLETED' && (
                      <Button 
                        variant={"ghost"} 
                        className={"w-full cursor-pointer"}
                        onClick={() => handleAddIssue(column.key)}
                      >
                        <Plus className='mr-2 h-4 w-4' />
                        Create Issue
                      </Button>
                    )}
                  </div>}}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        <IssueCreationDrawer 
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sprintId={currentSprint.id}
          status={selectedStatus}
          projectId={projectId}
          orgId={orgId}
          onIssueCreated={handleIssueCreated}
        />
    </div>
  )
}

export default SprintBoard