"use client";

import { updateSprintStatus } from '@/actoins/sprint';
import { Sprint, SprintStatus } from '@/app/lib/Types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useOrganization } from '@clerk/nextjs';
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import { useRouter, useSearchParams,  } from 'next/navigation';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const SprintManager = ({ sprint, setSprint, sprints, projectId }: {sprint: Sprint, setSprint: React.Dispatch<React.SetStateAction<Sprint>>, sprints: Sprint[], projectId: string}) => {

    const { membership } = useOrganization();

    const [status, setStatus] = React.useState<Sprint["status"]>(sprint.status);

    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart = isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
    const canEnd = status === "ACTIVE" && isAfter(now, startDate) && isBefore(now, endDate);

    const searchParams = useSearchParams();
    const router = useRouter();

    const {
        fn: updateSprintStatusFn,
        loading: isUpdatingStatus,
        data: updatedStatus
    } = useFetch(updateSprintStatus);

    useEffect(() => {
        if(updatedStatus && updatedStatus.status) {
            setSprint((prevSprint) => ({
                ...prevSprint,
                status: updatedStatus.status,
            }));
            queueMicrotask(() => setStatus(updatedStatus.status));
        }
    }, [updatedStatus, isUpdatingStatus, setSprint]);

    useEffect(() => {
        const sprintId = searchParams.get('sprint');
        if(sprintId && sprintId !== sprint.id){
            const selectedSprint = sprints.find((s) => s.id === sprintId);
            if(selectedSprint){
                setSprint(selectedSprint);
                queueMicrotask(() => setStatus(selectedSprint.status));
            }
        }
    }, [searchParams, sprints, setSprint, sprint.id])

    const handleStatusChange = async (newStatus: string) => {
        if(membership?.role !== "org:admin" && membership?.roleName !== "Admin"){
            toast.error("Only Organization Admin can update sprint status.");
            return;
        }
        setStatus(newStatus as SprintStatus);
        setSprint((prevSprint) => ({
            ...prevSprint,
            status: newStatus as SprintStatus,
        }));
        updateSprintStatusFn(sprint.id, newStatus as SprintStatus);
    };

    const handleSprintChange = (value: string) => {

        const selectedSprint = sprints.find(s => s.id === value);
        if (selectedSprint) {
            setSprint(selectedSprint);
            setStatus(selectedSprint.status);
        }
        router.replace(`/project/${projectId}`, {scroll: false});
    }

    const getStatusText = () => {
        if(status === "COMPLETED") {
            return "Sprint Ended";
        } else if(status === "ACTIVE" && isAfter(now, endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)} days`;
        } else if(status === "PLANNED" && isBefore(now, startDate)) {
            return `Starts in ${formatDistanceToNow(startDate)} days`;
        } else if(status === "PLANNED" && isAfter(now, endDate)) {
            return `Expired ${formatDistanceToNow(endDate)} ago`;
        } else {
            return null;
        }
    }

  return (
    <>
    <div className='flex flex-wrap justify-between items-center gap-4 px-4'>
        <div className="flex-1 min-w-50">
            <Select value={sprint.id} onValueChange={(value: string) => handleSprintChange(value)}>
                <SelectTrigger className={"bg-slate-950! w-full self-start cursor-pointer"}>
                    <SelectValue placeholder="Select a sprint" />
                </SelectTrigger>
                <SelectContent>
                    {sprints.map((sprint) => {
                        return <SelectItem key={sprint.id} value={sprint.id} className={"cursor-pointer bg-slate-900! hover:bg-slate-950!"}>
                            {sprint.name} ({format(sprint.startDate, 'MMM d, yyyy')} to{" "}
                            {format(sprint.endDate, 'MMM d, yyyy')})
                        </SelectItem>
                    })}
                </SelectContent>
            </Select>
        </div>
        {canStart && (
            <Button 
                className={"bg-green-900 text-white hover:bg-green-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"} 
                onClick={() => handleStatusChange("ACTIVE")}
                disabled={!!isUpdatingStatus}
            >Start Sprint</Button>
        )}
        {canEnd && (
            <Button 
                variant={"destructive"} 
                className={"hover:bg-red-500! cursor-pointer"}
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={!!isUpdatingStatus}
            >End Sprint</Button>
        )}
        {
            !!getStatusText() && (
                <Badge className={`mt-3 ml-1 self-start ${isAfter(now, endDate) ? "bg-red-600" : "bg-indigo-600"}`}>{getStatusText()}</Badge>
            )
        }
    </div>
    {isUpdatingStatus && <BarLoader width={"100%"} color="#36d7b7" className="mt-2" />}
    </>
  )
}

export default SprintManager