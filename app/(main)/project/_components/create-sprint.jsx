"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sprintSchema } from "@/app/lib/validators";
import { addDays, format } from "date-fns";
import { Popover } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getProject } from "@/actions/project";
import { BeatLoader } from "react-spinners";

const SprintCreationForm = ({
    projectTitle,
    projectId,
    projectKey,
}) => {

    const [showForm, setShowForm] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: new Date(),
        to: addDays(new Date(), 14) 
    })
    const router = useRouter();

    const {data: project, fn: fetchProject, loading} = useFetch(() => getProject(projectId));
    const {loading: createSprintLoading, fn: createSprintFn} = useFetch(createSprint);

    useEffect(() => {
        fetchProject();
    }, [projectId]);
    
    const formSubmit = async (data) => {
        await createSprintFn(projectId, {
            ...data,
            startDate: dateRange.from,
            endDate: dateRange.to
        })
        setShowForm(false);
        toast.success("Sprint created successfully!");
        fetchProject();
        router.refresh();
    }

    const { register, handleSubmit, setValue, formState: { errors }, control } = useForm({
        resolver: zodResolver(sprintSchema),
        defaultValues:{
            startDate: dateRange.from,
            endDate: dateRange.to
        }
    })

    useEffect(() => {
        if (project) {
            const sprintKey = project.sprints.length + 1;
            setValue("name", `${project.key}-${sprintKey}`);
        }
    }, [project, setValue]);

    if (loading || !project) {
        return (
            <div className="flex flex-wrap px-4 mb-4 justify-between items-center">
                <h1 className="text-5xl font-bold mb-2 gradient-title">{projectTitle}</h1>
                <BeatLoader color='#36d7b7'/>
            </div>
        );
    }

  return (
    <>
        <div className="flex flex-wrap px-4 mb-4 justify-between">
            <h1 className="text-5xl font-bold mb-2 gradient-title">{projectTitle}</h1>
            <Button 
                className={"mt-2 cursor-pointer"} 
                onClick={() => setShowForm(!showForm)}
                variant={showForm ? "destructive" : "default"}
                disabled={createSprintLoading}
            >{showForm ? "Cancel" : "Create New Sprint"}</Button>
        </div>
        {
            showForm && <Card className={"pt-4 mx-3 mb-4 !bg-slate-900"}>
                <CardContent>
                    <form className="flex flex-wrap gap-4 items-end" onSubmit={handleSubmit(formSubmit)}>
                        <div className="flex-1 min-w-[200px]">
                            <label 
                                htmlFor="name"
                                className="block text-sm font-medium mb-1"
                            >Sprint Name</label>
                            <Input 
                                id="name"
                                className={"!bg-slate-950"}
                                readOnly
                                {...register("name")}
                            />
                            {errors.name && <p className="text-red-500 text-sm !mt-2 !ml-2">{errors.name.message}</p>}
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">
                                Sprint Duration
                            </label>

                            <Controller
                                control={control}
                                name="dateRange"
                                render={({field}) => {
                                    return <Popover>
                                        <PopoverTrigger asChild>
                                            <Button 
                                                variant={"outline"}
                                                className={`w-full justify-start text-left font-normal !bg-slate-950 cursor-pointer ${!dateRange && "text-muted-foreground"}`}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dateRange.from && dateRange.to ? (
                                                    format(dateRange.from, "LLL dd, y") + " - " + format(dateRange.to, "LLL dd, y")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className={"w-auto !bg-slate-900"}
                                            align="start"
                                        >
                                            <DayPicker 
                                                mode="range"
                                                selected={dateRange}
                                                onSelect={(range) => {
                                                    if(range?.from && range.to) {
                                                        setDateRange(range);
                                                        field.onChange(range);
                                                    }
                                                }}
                                                classNames={{
                                                    chevron: "fill-blue-500",
                                                    range_start: "bg-blue-700",
                                                    range_end: "bg-blue-700",
                                                    range_middle: "bg-blue-400",
                                                    day_button: "border-none cursor-pointer",
                                                    today: "border-2 border-blue-700",
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                }}
                            />
                        </div>

                        <Button type="submit" disabled={createSprintLoading} className={"cursor-pointer !bg-slate-950 hover:!bg-slate-800 text-white"}>
                            {createSprintLoading ? "Creating..." : "Create Sprint"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        }
    </>
  )
}

export default SprintCreationForm