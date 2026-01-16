import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { getProjects } from "@/actoins/project";
import DeleteProject from "./delete-project";

export default async function ProjectList({ orgId }: { orgId: string }) {

    const response = await getProjects(orgId);

    if (!response.success) {
        return <div className="container px-8 mx-auto gradient-title-error text-4xl text-center pt-12">{`${response.message || "No Project found"}`}</div>;
    }

    const projects = response.data;

    if(projects?.length === 0) {
        return(
            <p>
                No Project Found.{" "}
                <Link 
                    href="/project/create" 
                    className="underline underline-offset-2 text-blue-200"
                >
                    Create New
                </Link>
            </p>
        )
    }

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{projects?.map((project) => {
        return (
            <Card key={project.id} className={"bg-slate-900!"}>
                <CardHeader>
                    <CardTitle className={"flex justify-between items-center italic"}>
                        {project.name}
                        <DeleteProject projectId={project.id} />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                    <Link
                        href={`/project/${project.id}`}
                        className="text-blue-500 hover:underline"
                    >
                        View Project
                    </Link>
                </CardContent>
            </Card>
        )
    })}</div>

}