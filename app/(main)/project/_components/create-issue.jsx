"use client";

import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organization";
import { issueSchema } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import MDEditor from "@uiw/react-md-editor";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import UserAvatar from "./user-avatar";

const IssueCreationDrawer = ({
    isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    onIssueCreated,
    orgId
}) => {

    const {register, control, handleSubmit, formState: { errors }, reset} = useForm({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            priority: "MEDIUM",
            description: "",
            assigneeId: "",
        }
    })

    const {
        loading: createIssueLoading,
        fn: createIssueFn,
        error,
        data: newIssue
    } = useFetch(createIssue);

    useEffect(() => {
        if(newIssue){
            reset();
            onClose();
            onIssueCreated();
            toast.success("Issue Added successfully!");
        }
    }, [newIssue, createIssueLoading]);

    const {
        loading: getUsersLoading,
        fn: getUsersFn,
        data: users
    } = useFetch(getOrganizationUsers);
    
    useEffect(() => {
        if(isOpen && orgId){
            getUsersFn(orgId)
        }
    }, [isOpen, orgId]);

    const onSubmit = async (data) => {
        await createIssueFn(projectId, {
            ...data,
            sprintId,
            status,
        });
    };

  return (
    <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent className="px-4 mx-4 !bg-slate-950 border">
            <DrawerHeader>
                <DrawerTitle>Create Issue</DrawerTitle>
            </DrawerHeader>
            {getUsersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
            <form className="mb-8 px-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2">
                        Title
                    </label>
                    <Input id="title" {...register("title")} className={"!bg-slate-900"} placeholder="Enter Your Issue Title"/>
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-2 ml-1">{errors.title.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="assigneeId" className="block text-sm font-medium my-2">
                        Assignee
                    </label>
                    <Controller 
                        name="assigneeId"
                        control={control}

                        render={({field}) => (
                            <div>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="w-full"
                                >
                                    <SelectTrigger className={"!bg-slate-900 w-full cursor-pointer"}>
                                        <SelectValue placeholder="Select Assignee"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users && users.map((user) => (
                                            <SelectItem key={user.id} value={user.id} className={"!bg-slate-900 hover:!bg-slate-950 cursor-pointer"}>
                                                <UserAvatar user={user}/>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />
                    {errors.assigneeId && (
                        <p className="text-red-500 text-sm mt-2 ml-1">{errors.assigneeId.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium my-2">
                        Description
                    </label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <MDEditor value={field.value} onChange={field.onChange} />
                        )}
                    />
                </div>
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium my-2">
                        Priority
                    </label>
                    <Controller
                        name="priority"
                        control={control}

                        render={({field}) => (
                            <div>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="w-full"
                                >
                                    <SelectTrigger className={"!bg-slate-900 w-full cursor-pointer"}>
                                        <SelectValue placeholder="Select Priority"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                            <SelectItem className={"!bg-slate-900 hover:!bg-slate-950 cursor-pointer"} value="LOW">Low</SelectItem>
                                            <SelectItem className={"!bg-slate-900 hover:!bg-slate-950 cursor-pointer"} value="MEDIUM">Medium</SelectItem>
                                            <SelectItem className={"!bg-slate-900 hover:!bg-slate-950 cursor-pointer"} value="HIGH">High</SelectItem>
                                            <SelectItem className={"!bg-slate-900 hover:!bg-slate-950 cursor-pointer"} value="URGENT">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2 ml-1">{error.message}</p>}
                <Button 
                    type="submit"
                    disabled={createIssueLoading}
                    className="w-full mt-4 cursor-pointer bg-slate-900 text-white hover:text-black hover:bg-cyan-500"
                >
                    {createIssueLoading ? "Creating Issue..." : "Create Issue"}
                </Button>
            </form>
        </DrawerContent>
    </Drawer>
  )
}

export default IssueCreationDrawer