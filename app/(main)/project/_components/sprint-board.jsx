"use client";

import React from 'react'
import SprintManager from './sprint-manager';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import status from '@/data/status';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import IssueCreationDrawer from './create-issue';
import useFetch from '@/hooks/use-fetch';
import { getIssueForSprint, updateIssueOrder } from '@/actions/issues';
import { BarLoader } from 'react-spinners';
import IssueCard from './issue-card';
import { toast } from 'sonner';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

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

    const {
      loading: issuesLoading,
      error: issuesError,
      data: issues,
      setData: setIssues,
      fn: fetchIssues
    } = useFetch(getIssueForSprint);

    const {
      fn: updateIssueOrderFn,
      loading: updateIssueLoading,
      error: updateIssueError
    } = useFetch(updateIssueOrder)

    React.useEffect(() => {
      if(currentSprint.id){
        fetchIssues(currentSprint.id);
      }
    }, [currentSprint.id]);

    const [filteredIssues, setFilteredIssues] = React.useState([]);
    
    React.useEffect(() => {
      if (Array.isArray(issues)) {
        setFilteredIssues(issues);
      }
    }, [issues]);

    const handleIssueCreated = (issue) => {
      fetchIssues(currentSprint.id);
    }

    const onDragEnd = async (result) => {
      if(currentSprint.status === "PLANNED") {
        toast.warning("Start the sprint to update board");
        return;
      }

      if(currentSprint.status === "COMPLETED") {
        toast.warning("Cannot update board after sprint end");
        return;
      }

      const { source, destination } = result;

      if(
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ){
        return;
      }

      const newOrderedData = [...issues];

      const sourceList = newOrderedData.filter(
        (list) => list.status === source.droppableId
      )

      const destinationList = newOrderedData.filter(
        (list) => list.status === destination.droppableId
      )

      // if source and destination are same
      if(source.droppableId === destination.droppableId){
        const reorderedCard = reorder(
          sourceList,
          source.index,
          destination.index
        );

        reorderedCard.forEach((card, i) => {
          card.order = i;
        });
      } else {
        // remove card from source list
        const [movedCard] = sourceList.splice(source.index, 1);

        // assign the new list id to the moved card
        movedCard.status = destination.droppableId;

        // add new card to the destination list
        destinationList.splice(destination.index, 0, movedCard);

        sourceList.forEach((card, i) => {
          card.order = i;
        });

        // update the order of the destination list
        destinationList.forEach((card, i) => {
          card.order = i;
        });
      }

      const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
      setIssues(newOrderedData, sortedIssues);

      updateIssueOrderFn(sortedIssues);
    }

    if(issuesError) return <div className='text-red-500 px-6'>Error loading issues</div>;

  return (
    <div>
        <SprintManager
            sprint={currentSprint}
            setSprint={setCurrentSprint}
            sprints={sprints}
            projectId={projectId}
        />
        {updateIssueError && (
          <p className='text-red-500 px-6 mt-2'>{updateIssueError.message}</p>
        )}
        {(updateIssueLoading || issuesLoading) && (
          <BarLoader className='mt-4' color='#36d7b7' width={"100%"} />
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4 !bg-slate-900 p-4'>
            {status.map((column) => (
              <Droppable key={column.key} droppableId={column.key}>
                {(provided) => {
                  return <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2'>
                    <h3 className='font-semibold mb-2 text-center'>{column.name}</h3>

                    {provided.placeholder}
                    {filteredIssues?.filter(
                      (issue) => issue.status === column.key
                    ).map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssueLoading}
                      >
                        {(provided) => {
                          return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='bg-slate-800 p-2 rounded-md'
                          >
                            <IssueCard 
                              issue={issue} 
                              onDelete={() => fetchIssues(currentSprint.id)}
                              onUpdate={(updated) => 
                                setIssues((issues) => 
                                  issues.map((issue) => {
                                    if(issue.id === updated.id)
                                      return updated; 
                                    return issue;
                                  })
                                )
                              }
                            />
                          </div>)
                        }}
                      </Draggable>
                    ))}

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