import { getUserIssues } from '@/actions/issues'
import IssueCard from '@/app/(main)/project/_components/issue-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { Suspense } from 'react'

const UserIssues = async ({userId}) => {

    const issues = await getUserIssues(userId);

    if(issues.length === 0){
        return null;
    }

    const assignedIssues = issues.filter(issue => issue.assignee.clerkUserId === userId);
    const reportedIssues = issues.filter(issue => issue.reporter.clerkUserId === userId);

  return (
    <>
        <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="assigned" className={"cursor-pointer"}>Assigned to you</TabsTrigger>
                <TabsTrigger value="reported" className={"cursor-pointer"}>Reported by you</TabsTrigger>
            </TabsList>
            <TabsContent value="assigned">
                <Suspense fallback={<div>Loading...</div>}>
                    <IssueGrid issues={assignedIssues} />
                </Suspense>
            </TabsContent>
            <TabsContent value="reported">
                <Suspense fallback={<div>Loading...</div>}>
                    <IssueGrid issues={reportedIssues} />
                </Suspense>
            </TabsContent>
        </Tabs>
    </>
  )
}

function IssueGrid({issues}){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} showStatus/>
                ))
            }
        </div>
    )
}

export default UserIssues