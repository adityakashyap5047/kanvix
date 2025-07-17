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

export async function getProjects(orgId){
    const { userId } = auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if(!user){
        throw new Error("User not found");
    }

    const projects = await db.project.findMany({
        where: {
            organizationId: orgId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return projects;
}

export async function deleteProject(projectId) {
    const {userId, sessionClaims} = auth();

    const orgId = sessionClaims?.o?.id;
    const orgRole = sessionClaims?.o?.rol;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");        
    }

    if (orgRole !== "admin") {
        throw new Error("Only organization admins can delete projects.")
    }

    const project = await db.project.findUnique({
        where: {id: projectId}
    })

    if (!project || project.organizationId !== orgId) {
        throw new Error("Project not found or you don't have permission to delete it")
    };

    await db.project.delete({
        where: {id: projectId}
    })

    return {success: true}
}

export async function getProject(projectId) {
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
        include: {
            sprints: {
                orderBy: {
                    createdAt: 'desc',
                },
            }
        }
    });

    if (!project) {
        return null;
    }

    if(project.organizationId !== orgId) {
        return null;
    }

    return project;
}