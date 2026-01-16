"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string){
    try {
        const {userId} = await auth();
    
        if(!userId){
            return {success: false, message: "Unauthorized"};
        }
    
        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        })
    
        if(!user){
            return {success: false, message: "User not found"};
        }
    
        const client = await clerkClient();
    
        const organization = await client.organizations.getOrganization({
            slug,
        });
    
        if(!organization){
            return {success: false, message: "Organization not found"};
        }
    
        const {data: membership} = await client.organizations.getOrganizationMembershipList({
            organizationId: organization.id,
        });
    
        const userMembership = membership.find(
            (member) => member.publicUserData?.userId === userId
        );
    
        if(!userMembership){
            return {success: false, message: "User is not a member of this organization"};
        }
    
        return {success: true, data: organization};
    } catch (error) {
        return {success: false, message: error instanceof Error ? error.message : "An error occurred while fetching organization"};
    }
}

export async function getOrganizationUsers(orgId: string){
    try {
        const {userId} = await auth();
    
        if(!userId){
            return {success: false, message: "Unauthorized"};
        }
    
        const user = await db.user.findUnique({
            where: {clerkUserId: userId},
        })
    
        if(!user){
            return {success: false, message: "User not found"};
        }
    
        const client = await clerkClient();
        const organizationMemberships = await client.organizations.getOrganizationMembershipList({
            organizationId: orgId,
        });
    
        if(!organizationMemberships){
            return {success: false, message: "Organization not found"};
        }
        const userIds = organizationMemberships.data.map(
            (member) => member.publicUserData?.userId
        );
    
        const users = await db.user.findMany({
            where: {
                clerkUserId: {
                    in: userIds.filter((id): id is string => id !== undefined),
                }
            },
        });
    
        return {success: true, data: users};
    } catch (error) {
        return {success: false, message: error instanceof Error ? error.message : "An error occurred while fetching organization users"};
    }

}