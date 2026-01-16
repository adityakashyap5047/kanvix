"use server";

import { Issue, IssuePriority, IssueStatus } from "@/app/lib/Types";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId: string, data: {sprintId: string; status: IssueStatus; title: string; description?: string; priority: IssuePriority; assigneeId?: string}) {

    try {
        const {userId, sessionClaims} = await auth();
            
        const orgId = (sessionClaims?.o as { id?: string })?.id;
    
        if (!userId || !orgId) {
            return {success: false, message: "Unauthorized"};
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
                reporterId: user?.id ?? "",
                assigneeId: data.assigneeId || null,
                order: newOrder,
            }, 
            include: {
                reporter: true,
                assignee: true,
            }
        });
    
        return {success: true, data: issue};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to create issue: ${error.message}` : "Failed to create issue"};
    }
}

export async function getIssueForSprint(sprintId: string) {
    try {
        const {userId, sessionClaims} = await auth();
            
        const orgId = (sessionClaims?.o as { id?: string })?.id;
    
        if (!userId || !orgId) {
            return {success: false, message: "Unauthorized"};
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
    
        return {success: true, data: issues};
    } catch {
        return {success: false, message: "An error occurred while fetching issues for the sprint"};
    }
}

export async function updateIssueOrder(updatedIssues: Issue[]) {
    try {
        const {userId, sessionClaims} = await auth();
            
        const orgId = (sessionClaims?.o as { id?: string })?.id;
    
        if (!userId || !orgId) {
            return {success: false, message: "Unauthorized"};
        }
    
        await db.$transaction(async (prisma) => {
            for(const issue of updatedIssues) {
                await prisma.issue.update({
                    where: {id: issue.id},
                    data: {
                        order: issue.order,
                        status: issue.status,
                    },
                });
            }
        })
    
        return {success: true, data: {success: true}, message: "Issue order updated successfully"};
    } catch {
        return {success: false, message: "An error occurred while updating issue order"};
    }
}

export async function deleteIssue(issueId: string) {
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
    
        const issue = await db.issue.findUnique({
            where: {id: issueId},
            include: {project: true}
        });
    
        if (!issue) {
            return {success: false, message: "Issue not found"};
        }
    
        if(
            issue.reporterId !== user.id
        ){
            return {success: false, message: "Unauthorized to delete this issue"};
        }
    
        await db.issue.delete({
            where: {id: issueId},
        });
    
        return {success: true, data: {success: true}, message: "Issue deleted successfully"};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to delete issue: ${error.message}` : "Failed to delete issue"};
    }
}

export async function updateIssue(issueId: string, data: {status: IssueStatus, priority: IssuePriority}) {
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

    try {
        const issue = await db.issue.findUnique({
            where: {id: issueId},
            include: {project: true}
        });

        if (!issue) {
            return {success: false, message: "Issue not found"};
        }

        if (issue.project.organizationId !== orgId) {
            return {success: false, message: "Unauthorized to update this issue"};
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

        return {success: true, data: updateIssue};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Error updating issue: ${error.message}` : "Error updating issue"};
    }
}

export async function getUserIssues(userId: string) {
    try {
        const {sessionClaims} = await auth();
    
        const orgId = (sessionClaims?.o as { id?: string })?.id;
    
        if (!userId || !orgId) {
            return {success: false, message: "No user id or organization id found"};        
        }
    
        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        })
    
        if (!user) {
            return {success: false, message: "User not found"};
        }
    
        const issues = await db.issue.findMany({
            where: {
                OR: [
                    {assigneeId: user.id},
                    {reporterId: user.id}
                ],
                project: {
                    organizationId: orgId
                },
            },
            include: {
                project: true,
                assignee: true,
                reporter: true,
                sprint: true,
            },
            orderBy: {updatedAt: "desc"}
        })
    
        return {success: true, data: issues};
    } catch (error) {
        return {success: false, message: error instanceof Error ? `Failed to get user issues: ${error.message}` : "Failed to get user issues"};
    }
}