"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId, data){

    const {userId, sessionClaims} = auth();
    
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");        
    }

    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if (!user) {
        throw new Error("User not found");
    }

    const project = await db.project.findUnique({
        where: {id: projectId},
    });

    if(!project || project.organizationId !== orgId) {
        return null;
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

    return sprint;
}

export async function updateSprintStatus(sprintId, newStatus){
    const {userId, sessionClaims} = auth();
    
    const orgId = sessionClaims?.o?.id;
    const orgRole = sessionClaims?.o?.rol;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");        
    }

    try {
        const sprint = await db.sprint.findUnique({
            where: {id: sprintId},
            include: {project: true},
        });

        if (!sprint || sprint.project.organizationId !== orgId) {
            throw new Error("Sprint not found or you don't have permission to update it");            
        }

        if(orgRole !== "admin"){
            throw new Error("Only organization admins can update sprint status");
        }

        const now = new Date();
        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);

        if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
            throw new Error("Sprint can only be activated during its timeframe");
        }

        if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
            throw new Error("Sprint can only be completed if it is currently active");            
        }

        const updatedSprint = await db.sprint.update({
            where: {id: sprintId},
            data: {status: newStatus},
        });

        return {success: true, sprint: updatedSprint};
    } catch (error) {
        throw new Error(error.message)
    }   
}