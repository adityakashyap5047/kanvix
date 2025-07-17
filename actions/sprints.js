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