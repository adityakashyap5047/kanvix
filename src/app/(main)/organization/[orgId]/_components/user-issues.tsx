import { getUserIssues } from '@/actoins/issues';
import IssueCard from '@/app/(main)/project/_components/issue-card'
import { Issue } from '@/app/lib/Types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'

const UserIssues = async ({userId}: {userId: string}) => {

    const response = await getUserIssues(userId);

    if(!response.success || !response.data){
        return null;
    }

    const issues = response.data;

    const assignedIssues = issues.filter(issue => issue?.assignee?.clerkUserId === userId);
    const reportedIssues = issues.filter(issue => issue?.reporter?.clerkUserId === userId);

  return (
    <>
        <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="mb-4 bg-slate-800! gap-2">
                <TabsTrigger value="assigned" className={"cursor-pointer bg-slate-900!"}>Assigned to you</TabsTrigger>
                <TabsTrigger value="reported" className={"cursor-pointer bg-slate-900!"}>Reported by you</TabsTrigger>
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

function IssueGrid({issues}: {issues: Issue[]}){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
                issues.map((issue) => (
                    <IssueCard key={issue.id} issue={issue} showStatus sprintStatus={issue.sprint?.status}/>
                ))
            }
        </div>
    )
}

export default UserIssues