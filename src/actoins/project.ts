"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data: {name: string; key: string; description?: string}) {

    const { userId, sessionClaims } = await auth();

    const orgId = (sessionClaims?.o as { id?: string })?.id;

    if (!userId) {
        return {success: false, message: "Unauthorized"};
    }

    if(!orgId) {
        return {success: false, message: "No Organization Selected"};
    }

    const client = await clerkClient();
    const {data: membership} = await client.organizations.getOrganizationMembershipList({
        organizationId: orgId,
    });

    const userMembership = membership.find(
        (member) => member.publicUserData?.userId === userId
    );
    
    if(!userMembership || userMembership.role !== "org:admin"){
        return {success: false, message: "Only organization admins can create projects"};
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
            success: true,
            data: {
                ...project,
                createdAt: project.createdAt.toISOString(),
                updatedAt: project.updatedAt.toISOString(),
            }
        };
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to create project: ${error.message}` : "Failed to create project"};
    }
}

export async function getProjects(orgId: string){
    try {
        const { userId } = await auth();
    
        if (!userId) {
            return {success: false, message: "Unauthorized"};
        }
    
        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        });
    
        if(!user){
            return {success: false, message: "User not found"};
        }
    
        const projects = await db.project.findMany({
            where: {
                organizationId: orgId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return {success: true, data: projects};
    } catch (error) {
        return {success: false, message: error instanceof Error ? error.message : "An error occurred while fetching projects"};
    }
}

export async function deleteProject(projectId: string) {
    try {
        const {userId, sessionClaims} = await auth();
    
        const orgId = (sessionClaims?.o as { id?: string })?.id;
        const orgRole = (sessionClaims?.o as { rol?: string })?.rol;
    
        if (!userId || !orgId) {
            return {success: false, message: "Unauthorized"};
        }
    
        if (orgRole !== "admin") {
            return {success: false, message: "Only organization admins can delete projects."};      
        }
    
        const project = await db.project.findUnique({
            where: {id: projectId}
        })
    
        if (!project || project.organizationId !== orgId) {
            return {success: false, message: "Project not found or you don't have permission to delete it"};
        };
    
        await db.project.delete({
            where: {id: projectId}
        })
    
        return {success: true, data: {success: true}, message: "Project deleted successfully"};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to delete project: ${error.message}` : "Failed to delete project"};
    }
}

export async function getProject(projectId: string) {
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
            include: {
                sprints: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                }
            }
        });
    
        if (!project) {
            return {success: false, message: "Project not found"};
        }
    
        if(project.organizationId !== orgId) {
            return {success: false, message: "Project not found"};
        }
    
        return {success: true, data: project};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to get project: ${error.message}` : "Failed to get project"};
    }
}