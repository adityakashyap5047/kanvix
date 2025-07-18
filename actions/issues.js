"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId, data){

    const {userId, sessionClaims} = auth();
        
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");        
    }

    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    const lastIssue = await db.issue.findFirst({
        where: {projectId, status: data.status},
        orderBy: {order: "desc"},
    })

    const newOrder = lastIssue ? lastIssue.order + 1 : 0;

    const issue = await db.issue.create({
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            projectId,
            sprintId: data.sprintId,
            reporterId: user.id,
            assigneeId: data.assigneeId || null,
            order: newOrder,
        }, 
        include: {
            reporter: true,
            assignee: true,
        }
    });

    return issue;
}

export async function getIssueForSprint(sprintId){
    const {userId, sessionClaims} = auth();
        
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");        
    }

    const issues = await db.issue.findMany({
        where: {
            sprintId,
        },
        orderBy: [{status: "asc"}, {order: "asc"}],
        include: {
            reporter: true,
            assignee: true,
        },
    });

    return issues;
}

export async function updateIssueOrder(updatedIssues) {
    const {userId, sessionClaims} = auth();
        
    const orgId = sessionClaims?.o?.id;

    if (!userId || !orgId) {
        throw new Error("Unauthorized");        
    }

    await db.$transaction(async (primsa) => {
        for(const issue of updatedIssues) {
            await primsa.issue.update({
                where: {id: issue.id},
                data: {
                    order: issue.order,
                    status: issue.status,
                },
            });
        }
    })

    return {success: true};
}

export async function deleteIssue(issueId) {
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

    const issue = await db.issue.findUnique({
        where: {id: issueId},
        include: {project: true}
    });

    if (!issue) {
        throw new Error("Issue not found");
    }

    if(
        issue.reporterId !== user.id &&
        !issue.project.adminIds.includes(user.id)
    ){
        throw new Error("Unauthorized to delete this issue");
    }

    await db.issue.delete({
        where: {id: issueId},
    });

    return {success: true};
}

export async function updateIssue(issueId, data) {
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

    try {
        const issue = await db.issue.findUnique({
            where: {id: issueId},
            include: {project: true}
        });

        if (!issue) {
            throw new Error("Issue not found");
        }

        if (issue.project.organizationId !== orgId) {
            throw new Error("Unauthorized to update this issue");
        }

        if(
            issue.reporterId !== user.id &&
            !issue.project.adminIds.includes(user.id)
        ){
            throw new Error("Unauthorized to delete this issue");
        }

        const updateIssue = await db.issue.update({
            where: {id: issueId},
            data: {
                status: data.status,
                priority: data.priority
            },
            include: {
                reporter: true,
                assignee: true,
            }
        });

        return updateIssue;
    } catch (error) {
        throw new Error(`Error updating issue: ${error.message}`);
    }
}