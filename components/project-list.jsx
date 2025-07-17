import { getProjects } from "@/actions/project";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default async function ProjectList({ orgId }) {

    const projects = await getProjects(orgId);

    if(projects.length === 0) {
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

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{projects.map((project) => {
        return (
            <Card key={project.id}>
                <CardHeader>
                    <CardTitle className={"flex justify-between items-center italic"}>{project.name}</CardTitle>
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