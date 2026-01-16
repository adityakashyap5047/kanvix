import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { useOrganization, useUser } from '@clerk/nextjs';
import { ExternalLink, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { BarLoader } from 'react-spinners';
import statuses from '@/data/status.json';
import MDEditor from '@uiw/react-md-editor';
import UserAvatar from './user-avatar';
import { Issue, IssuePriority, IssueStatus } from '@/app/lib/Types';
import { deleteIssue, updateIssue } from '@/actoins/issues';
import { toast } from 'sonner';

const priorityOptions = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const IssueDetailsDialog = ({ 
    isOpen, 
    onClose, 
    issue, 
    onDelete = () => {}, 
    onUpdate = () => {}, 
    borderCol = "",
    sprintStatus = "PLANNED"
}: {isOpen: boolean, onClose: () => void, issue: Issue, onDelete?: () => void, onUpdate?: (updatedIssue: Issue) => void, borderCol?: string, sprintStatus?: string}) => {

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

    const handleStatusChange = async (newStatus: IssueStatus) => {
        setStatus(newStatus);
        updateIssueFn(issue.id, { status: newStatus, priority })
    };
    const handlePriorityChange = async (newPriority: IssuePriority) => {
        setPriority(newPriority);
        updateIssueFn(issue.id, { status, priority: newPriority })
    };

    // State for AlertDialog
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [deleteErrorMsg, setDeleteErrorMsg] = React.useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        setDeleteErrorMsg(null);
        try {
            await deleteIssueFn(issue.id);
            router.refresh();
            toast.error("Issue deleted successfully.");
        } catch (err: unknown) {
            if (typeof err === "object" && err !== null && "message" in err) {
                setDeleteErrorMsg((err as { message?: string }).message || "Failed to delete issue.");
            } else {
                setDeleteErrorMsg("Failed to delete issue.");
            }
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    const processedUpdateRef = React.useRef<string | null>(null);

    React.useEffect(() => {
        if(deleted){
            onClose();
            onDelete();
        }

        if(updated && updated.id && processedUpdateRef.current !== updated.id + updated.status + updated.priority){
            processedUpdateRef.current = updated.id + updated.status + updated.priority;
            onUpdate(updated);
        }
    }, [deleted, updated, deleteLoading, updateLoading, onClose, onDelete, onUpdate]);

    const canChange = user?.id === issue.reporter?.clerkUserId || membership?.role === "org:admin";

    const isProjectPage = pathname.startsWith("/project/");

    const handleGoToProject = () => {
        router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`)        
    }

    const cardNotMove = sprintStatus === "PLANNED" || sprintStatus === "COMPLETED";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`bg-slate-900! border-3 border-red-600 ${borderCol}`}>
            <DialogHeader>
                <div className='flex justify-between items-center'>
                    <DialogTitle className={"text-3xl"}>{issue.title}</DialogTitle>
                </div>
                {!isProjectPage && (
                    <Button 
                        variant={"ghost"}
                        size="icon"
                        onClick={handleGoToProject}
                        title ={"Go to project"}
                        className={"cursor-pointer"}
                    >
                        <ExternalLink className='h-4 w-4' />
                    </Button>
                )}
            </DialogHeader>
            {(updateLoading || deleteLoading) && (
                <BarLoader className='mt-4' color='#36d7b7' width={"100%"} />
            )}
            <div className='flex items-center space-x-2'>
                <div className='w-1/2'>
                    <Select value={status} onValueChange={handleStatusChange} disabled={cardNotMove}>
                        <SelectTrigger className={"w-full cursor-pointer bg-slate-900!"}>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className={"bg-slate-800!"}>
                            {statuses.map(status => (
                                <SelectItem 
                                    key={status.key} 
                                    value={status.key}
                                    className={`cursor-pointer hover:bg-slate-950!`}
                                >{status.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className='w-1/2'>
                    <Select value={priority} onValueChange={handlePriorityChange} disabled={cardNotMove}>
                        <SelectTrigger className={`w-full cursor-pointer bg-slate-900! border-2 ${borderCol}`}>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className={"bg-slate-800!"}>
                            {priorityOptions.map(priority => (
                                <SelectItem 
                                    key={priority} 
                                    value={priority}
                                    className={`cursor-pointer hover:bg-slate-950!`}
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
                    {issue.assignee && <UserAvatar user={issue.assignee} />}
                </div>
                <div className="flex flex-col gap-2">
                    <h4>Reporter</h4>
                    {issue.reporter && <UserAvatar user={issue.reporter} />}
                </div>
            </div>
            {canChange && (
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`${isDeleting ? "animate-pulse" : "cursor-pointer"} flex bg-red-800/40 hover:bg-red-900/70!`}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                            Delete Issue
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-slate-900 border-white top-[20%]'>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete this issue? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        {deleteErrorMsg && <p className="text-red-500 text-sm mt-2">{deleteErrorMsg}</p>}
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting} className='cursor-pointer'>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}
                                disabled={isDeleting}
                                className="bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {(deleteError || updateError) && (
                <p className='text-red-500 ml-2'>{deleteError || updateError}</p>
            )}
        </DialogContent>
    </Dialog>
    );
}

export default IssueDetailsDialog