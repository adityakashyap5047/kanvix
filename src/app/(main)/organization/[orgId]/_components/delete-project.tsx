"use client"

import { useOrganization } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { deleteProject } from '@/actoins/project';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DeleteProject = ({projectId}: {projectId: string}) => {

    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const {membership} = useOrganization();

    const {
        data: deleted,
        loading: isDeleting,
        error,
        fn: deleteProjectFn,
    } = useFetch(deleteProject)

    const handleDelete = () => {
        deleteProjectFn(projectId);
    };

    useEffect(() => {
        if(deleted && deleted.success){
            queueMicrotask(() => setIsOpen(false));
            toast.error("Project deleted successfully");
            router.refresh();
        }
    }, [deleted, router]);

    const isAdmin = membership?.role === "org:admin";

    if(!isAdmin) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost" 
                    size="sm"
                    className={`${isDeleting ? "animate-pulse" : "cursor-pointer"} flex flex-col`} 
                    disabled={isDeleting!}
                >
                    <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='bg-slate-900 border-white top-[20%]'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Project</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this project? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting!} className='cursor-pointer'>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={isDeleting!}
                        className="bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteProject