"use server";

import { SprintStatus } from "@/app/lib/Types";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId: string, data: {name: string, startDate: Date, endDate: Date}){

    try {
        const {userId, sessionClaims} = await auth();
        
        const orgId = (sessionClaims?.o as { id?: string })?.id;
    
        if (!userId || !orgId) {
            return {success: false, message: "Unauthorized"};
        }
    
        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });
    
        if (!user) {
            return {success: false, message: "User not found"};
        }
    
        const project = await db.project.findUnique({
            where: {id: projectId},
        });
    
        if(!project || project.organizationId !== orgId) {
            return {success: false, message: "Project not found"};
        }
    
        const sprint = await db.sprint.create({
            data: {
                name: data.name,
                startDate: data.startDate,
                endDate: data.endDate,
                status: "PLANNED",
                projectId,
            }
        });
    
        return {success: true, data: sprint};
    } catch {
        return {success: false, message: "An error occurred while creating the sprint"};
    }
}


export async function updateSprintStatus(sprintId: string, newStatus: SprintStatus){
    const {userId, sessionClaims} = await auth();
    
    const orgId = (sessionClaims?.o as { id?: string })?.id;
    const orgRole = (sessionClaims?.o as { rol?: string })?.rol;

    if (!userId || !orgId) {
        return {success: false, message: "Unauthorized"};
    }

    try {
        const sprint = await db.sprint.findUnique({
            where: {id: sprintId},
            include: {project: true},
        });

        if (!sprint || sprint.project.organizationId !== orgId) {
            return {success: false, message: "Sprint not found or you don't have permission to update it"};            
        }

        if(orgRole !== "admin"){
            return {success: false, message: "Only organization admins can update sprint status"};
        }

        const now = new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);

        if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
            return {success: false, message: "Sprint can only be activated during its timeframe"};
        }

        if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
            return {success: false, message: "Sprint can only be completed if it is currently active"};            
        }

        const updatedSprint = await db.sprint.update({
            where: {id: sprintId},
            data: {status: newStatus},
        });

        return {success: true, data: updatedSprint};
    } catch {
        return {success: false, message: "An error occurred while updating the sprint"};
    }   
}