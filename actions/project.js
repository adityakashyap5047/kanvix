"use server"

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data){

    const { userId, sessionClaims } = auth();

    const orgId = sessionClaims?.o?.id;

    if (!userId) {
        throw new Error("Unauthorized");
    }

    if(!orgId) {
        throw new Error("No Organization Selected");
    }

    const {data: membership} = await clerkClient().organizations.getOrganizationMembershipList({
        organizationId: orgId,
    });

    const userMembership = membership.find(
        (member) => member.publicUserData.userId === userId
    );
    
    if(!userMembership || userMembership.role !== "org:admin"){
        throw new Error("Only organization admins can create projects");
    }

    try {
        const project = await db.project.create({
            data: {
                name: data.name,
                key: data.key,
                description: data.description,
                organizationId: orgId,
            }
        })
        
        return {
  ...project,
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
};
    } catch (error) {
        throw new Error("Failed to create project: " + error.message);
    }
}