"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import OrgSwitcher from "@/app/(main)/organization/[orgId]/_components/org-switcher";
import { projectSchema } from "@/app/lib/validators";
import { createProject } from "@/actoins/project";

const CreateProjectPage = () => {

    const { isLoaded: isOrgLoaded, membership } = useOrganization();
    const { isLoaded: isUserLoaded } = useUser();
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema),
    })

    const isAdmin = useMemo(() => {
        return isOrgLoaded && isUserLoaded && membership
        ? membership.role === "org:admin"
        : false;
    }, [isOrgLoaded, isUserLoaded, membership]);
  
  
    const {data: project, loading, error, fn: createProjectFn} = useFetch(createProject);

    useEffect(() => {
        if (project) {
        toast.success("Project created Successfully")
        router.push(`/project/${project.id}`);
        }
    }, [loading, project, router]);
  
    const onSubmit = async(data: {name: string; key: string; description?: string}) => {
        createProjectFn(data);
    }
    
    if (!isOrgLoaded || !isUserLoaded) {
        return null;
    }

    if(!isAdmin){
        return(
        <div className="flex flex-col gap-4 items-center">
            <span className="text-2xl gradient-title">Oops! Only Admins can create project Schema.</span>
            <OrgSwitcher />
        </div>
        )
    }
  

    return (
        <div className="container mx-auto py-10 xl:max-w-[95%]">
        <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
            Create New Project
        </h1>

        <form className="flex flex-col space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
            <div className="flex gap-4">
                <Input
                    id="key"
                    className={"bg-slate-950!"}
                    placeholder="Project Key (PJKY)"
                    disabled={!isAdmin || loading!}
                    {...register("key")}
                />
                <OrgSwitcher />
            </div>
            {errors.key && (
                <p className="text-red-500 text-sm mt-2 ml-2">{errors?.key?.message}</p>
            )}          
            </div>
            <div>
            <Input
                id="name"
                className={"bg-slate-950!"}
                placeholder="Project Name"
                disabled={!isAdmin || loading!}
                {...register("name")}
            />
            {errors.name && (
                <p className="text-red-500 text-sm mt-2 ml-2">{errors?.name?.message}</p>
            )}
            </div>
            <div>
            <Textarea
                id="description"
                className={"bg-slate-950! h-28"}
                placeholder="Project Description"
                disabled={!isAdmin || loading!}
                {...register("description")}
            />
            {errors.description && (
                <p className="text-red-500 text-sm mt-2 ml-2">{errors?.description?.message}</p>
            )}
            </div>

            <Button type="submit" size="lg" disabled={!isAdmin || loading!} className={"bg-blue-500 text-white hover:bg-blue-800 cursor-pointer"}>
            {loading ? "Creating..." : "Create Project"}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2 ml-2">{error}</p>}
        </form>
        </div>
    )
}

export default CreateProjectPage