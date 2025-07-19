import { deleteIssue, updateIssue } from '@/actions/issues';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useOrganization, useUser } from '@clerk/nextjs';
import { ExternalLink } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { BarLoader } from 'react-spinners';
import statuses from '@/data/status';
import MDEditor from '@uiw/react-md-editor';
import UserAvatar from './user-avatar';

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const IssueDetailsDialog = ({ 
    isOpen, 
    onClose, 
    issue, 
    onDelete = () => {}, 
    onUpdate = () => {}, 
    borderCol = "",
    sprintStatus = "PLANNED"
}) => {

    const [status, setStatus] = React.useState(issue.status)
    const [priority, setPriority] = React.useState(issue.priority);

    const {user} = useUser();
    const {membership} = useOrganization();

    const pathname = usePathname();
    const router = useRouter();

    const {
        loading: deleteLoading,
        error: deleteError,
        fn: deleteIssueFn,
        data: deleted,
    } = useFetch(deleteIssue);

    const {
        loading: updateLoading,
        error: updateError,
        fn: updateIssueFn,
        data: updated,
    } = useFetch(updateIssue);

    const handleStatusChange = async (newStatus) => {
        setStatus(newStatus);
        updateIssueFn(issue.id, { status: newStatus, priority })
    };
    const handlePriorityChange = async (newPriority) => {
        setPriority(newPriority);
        updateIssueFn(issue.id, { status, priority: newPriority })
    };

    const handleDelete = () => {
        if(window.confirm("Are you sure you want to delete this issue?")) {
            deleteIssueFn(issue.id);
        }
    };

    React.useEffect(() => {
        if(deleted){
            onClose();
            onDelete();
        }

        if(updated){
            onUpdate(updated);
        }
    }, [deleted, updated, deleteLoading, updateLoading]);

    const canChange = user.id === issue.reporter.clerkUserId || membership.role === "org:admin";

    const isProjectPage = pathname.startsWith("/project/");

    const handleGoToProject = () => {
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`)        
    }

    const cardNotMove = sprintStatus === "PLANNED" || sprintStatus === "COMPLETED";
    const sprintEnded = sprintStatus === "COMPLETED";


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`!bg-slate-900 border-3 border-red-600 ${borderCol}`}>
            <DialogHeader>
                <div className='flex justify-between items-center'>
                    <DialogTitle className={"text-3xl"}>{issue.title}</DialogTitle>
                </div>
                {
                    !isProjectPage && (
                        <Button 
                            variant={"ghost"}
                            size="icon"
                            onClick = {handleGoToProject}
                            title ={"Go to project"}
                            className={"cursor-pointer"}
                        >
                            <ExternalLink className='h-4 w-4' />
                        </Button>
                    )
                }
            </DialogHeader>
            {(updateLoading || deleteLoading) && (
                <BarLoader className='mt-4' color='#36d7b7' width={"100%"} />
            )}
            <div className='flex items-center space-x-2'>
                <div className='w-1/2'>
                    <Select value={status} onValueChange={handleStatusChange} disabled={cardNotMove}>
                        <SelectTrigger className={"w-full cursor-pointer !bg-slate-900"}>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className={"!bg-slate-800"}>
                            {statuses.map(status => (
                                <SelectItem 
                                key={status.key} 
                                value={status.key}
                                className={`cursor-pointer hover:!bg-slate-950`}
                                >{status.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='w-1/2'>
                    <Select value={priority} onValueChange={handlePriorityChange} disabled={!canChange || sprintEnded}>
                        <SelectTrigger className={`w-full cursor-pointer !bg-slate-900 border-2 ${borderCol}`}>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className={"!bg-slate-800"}>
                            {priorityOptions.map(priority => (
                                <SelectItem 
                                key={priority} 
                                value={priority}
                                className={`cursor-pointer hover:!bg-slate-950`}
                                >{priority}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <h4 className='font-semibold'>Description</h4>
                <MDEditor.Markdown
                    className='rounded px-2 py-1'
                    source={issue.description ? issue.description : "--"}
                />
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <h4>Assignee</h4>
                    <UserAvatar user={issue.assignee} />
                </div>
                <div className="flex flex-col gap-2">
                    <h4>Reporter</h4>
                    <UserAvatar user={issue.reporter} />
                </div>
            </div>
            {
                canChange && (
                    <Button
                        variant={"destructive"}
                        disabled={deleteLoading}
                        onClick={handleDelete}
                        className={"w-full mt-4 cursor-pointer"}
                    >
                        {deleteLoading ? "Deleting..." : "Delete Issue"}
                    </Button>
                )
            }
            {(deleteError || updateError) && (
                <p className='text-red-500 ml-2'>{deleteError?.message || updateError?.message}</p>
            )}
        </DialogContent>
    </Dialog>
  )
}

export default IssueDetailsDialog