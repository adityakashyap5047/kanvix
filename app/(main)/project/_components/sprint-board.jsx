"use client";

import React from 'react'
import SprintManager from './sprint-manager';

const SprintBoard = ({ sprints, projectId, orgId }) => {

    const [currentSprint, setCurrentSprint] = React.useState(
        sprints.find((spr) => spr.status === "ACTIVE") || sprints[0]
    );


  return (
    <div>
        <SprintManager
            sprint={currentSprint}
            setSprint={setCurrentSprint}
            sprints={sprints}
            projectId={projectId}
        />
    </div>
  )
}

export default SprintBoard