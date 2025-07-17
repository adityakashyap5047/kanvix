"use client";

import { updateSprintStatus } from '@/actions/sprints';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';

const SprintManager = ({ sprint, setSprint, sprints, projectId }) => {

    const [status, setStatus] = React.useState(sprint.status);

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart = isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
    const canEnd = status === "ACTIVE" && isAfter(now, startDate) && isBefore(now, endDate);

    const {
        fn: updateSprintStatusFn,
        loading: isUpdatingStatus,
        error: updateError,
        data: updatedStatus
    } = useFetch(updateSprintStatus);

    useEffect(() => {
        if(updatedStatus && updatedStatus.success) {
            setStatus(updatedStatus.sprint.status);
            setSprint({
                ...sprint,
                status: updatedStatus.sprint.status,
            });
        }
    }, [updatedStatus, isUpdatingStatus]);

    const handleStatusChange = async (newStatus) => {
        updateSprintStatusFn(sprint.id, newStatus);
    };

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
    <div className='flex flex-wrap justify-between items-center gap-4 px-4'>
        <div className="flex-1 min-w-[200px]">
            <Select value={sprint.id} onValueChange={handleSprintChange}>
                <SelectTrigger className={"!bg-slate-950 w-full self-start cursor-pointer"}>
                    <SelectValue placeholder="Select a sprint" />
                </SelectTrigger>
                <SelectContent>
                    {sprints.map((sprint) => {
                        return <SelectItem key={sprint.id} value={sprint.id} className={"cursor-pointer !bg-slate-900 hover:!bg-slate-950"}>
                            {sprint.name} ({format(sprint.startDate, 'MMM d, yyyy')} to{" "}
                            {format(sprint.endDate, 'MMM d, yyyy')})
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>
        </div>
        {canStart && (
            <Button 
                className={"bg-green-900 text-white hover:bg-green-500 cursor-pointer"} 
                onClick={() => handleStatusChange("ACTIVE")}
                disabled={isUpdatingStatus}
            >Start Sprint</Button>
        )}
        {canEnd && (
            <Button 
                variant={"destructive"} 
                className={"hover:!bg-red-500 cursor-pointer"}
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={isUpdatingStatus}
            >End Sprint</Button>
        )}
        {
            getStatusText() && (
                <Badge className={"mt-3 ml-1 self-start bg-indigo-600"}>{getStatusText()}</Badge>
            )
        }
    </div>
    {isUpdatingStatus && <BarLoader width={"100%"} color="#36d7b7" className="mt-2" />}
    </>
  )
}

export default SprintManager