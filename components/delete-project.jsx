"use client"

import { useOrganization } from '@clerk/nextjs'
import React, { useEffect } from 'react'
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteProject } from '@/actions/project';

const DeleteProject = ({projectId}) => {

    const router = useRouter();

    const {membership} = useOrganization();

    const {
        data: deleted,
        loading: isDeleting,
        error,
        fn: deleteProjectFn,
    } = useFetch(deleteProject)

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            deleteProjectFn(projectId)            
        }
    };

    useEffect(() => {
        if(deleted && deleted.success){
            toast.success("Project deleted successfully");
            router.refresh();
        }
    }, [deleted]);

    const isAdmin = membership?.role === "org:admin";

    if(!isAdmin) return null;

    return <>

        <Button 
            variant="ghost" 
            size="sm"
            className={`${isDeleting ? "animate-pulse" : "cursor-pointer"} flex flex-col`} 
            onClick={handleDelete} disabled={isDeleting}
        >
            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
            {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
        </Button>

    </>
}

export default DeleteProject