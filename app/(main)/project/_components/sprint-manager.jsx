"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import React from 'react'

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {

    const [status, setStatus] = React.useState(sprint.status);

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart = isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
    const canEnd = status === "ACTIVE" && isAfter(now, startDate) && isBefore(now, endDate);

    const handleSprintChange = (value) => {

        const selectedSprint = sprints.find(s => s.id === value);
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
    }

    const getStatusText = () => {
        if(status === "COMPLETED") {
            return "Sprint Ended";
        } else if(status === "ACTIVE" && isAfter(now, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)} days`;
        } else if(status === "PLANNED" && isBefore(now, startDate)) {
            return `Starts in ${formatDistanceToNow(startDate)} days`;
        } else {
            return null;
        }
    }

  return (
    <>
    <div className='flex justify-between items-center gap-4'>
        <Select value={sprint.id} onValueChange={handleSprintChange}>
            <SelectTrigger className={"!bg-slate-950 self-start cursor-pointer"}>
                <SelectValue placeholder="Select a sprint" />
            </SelectTrigger>
            <SelectContent>
                {sprints.map((sprint) => {
                    return <SelectItem key={sprint.id} value={sprint.id} className={"cursor-pointer"}>
                        {sprint.name} ({format(sprint.startDate, 'MMM d, yyyy')} to{" "}
                        {format(sprint.endDate, 'MMM d, yyyy')})
                    </SelectItem>
                })}
            </SelectContent>
        </Select>
        {canStart && (
            <Button className={"bg-green-900 text-white hover:bg-green-500 cursor-pointer"} >Start Sprint</Button>
        )}
        {canEnd && (
            <Button variant={"destructive"} className={"hover:!bg-red-500 cursor-pointer"} >End Sprint</Button>
        )}
    </div>
    {
        getStatusText() && (
            <Badge className={"mt-3 ml-1 self-start"}>{getStatusText()}</Badge>
        )
    }
    </>
  )
}

export default SprintManager