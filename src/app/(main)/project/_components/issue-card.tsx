"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import UserAvatar from './user-avatar';
import { formatDistanceToNow } from 'date-fns';
import IssueDetailsDialog from './issue-details-dialog';
import { useRouter } from 'next/navigation';
import { Issue } from '@/app/lib/Types';

const priorityColors = {
    LOW: "border-t-green-500",
    MEDIUM: "border-t-yellow-500",
    HIGH: "border-t-orange-500",
    URGENT: "border-t-red-500",
};

const priorityBorderColors = {
    LOW: "border-green-500",
    MEDIUM: "border-yellow-500",
    HIGH: "border-orange-500",
    URGENT: "border-red-500",
};

const IssueCard = ({
    issue,
    showStatus = false,
    onDelete = () => {},
    onUpdate = () => {},
    sprintStatus = "PLANNED"
}: {issue: Issue, showStatus?: boolean, onDelete?: (...params: Issue[]) => void, onUpdate?: (...params: Issue[]) => void, sprintStatus?: string}) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const router = useRouter();

    const onDeleteHandler = (...params: Issue[]) => {
        router.refresh();
        onDelete(...params);
    }

    const onUpdateHandler = (...params: Issue[]) => {
        router.refresh();
        onUpdate(...params);
    }

    const created = formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true });

  return (
    <>
        <Card 
            className={`
                bg-slate-950! cursor-pointer hover:shadow-md transition-shadow 
                border-t-4 ${priorityColors[issue.priority]} rounded-md`
            }
            onClick={() => setIsDialogOpen(true)}
        >
            <CardHeader className={``}>
                <CardTitle>{issue.title}</CardTitle>
            </CardHeader>
            <CardContent className={"flex gap-2 -mt-3"}>
                {showStatus && <Badge className={"mr-4"}>{issue.status}</Badge>}
                <Badge variant={"outline"} className={"-ml-1"}>
                    {issue.priority}
                </Badge>
            </CardContent>
            <CardFooter className={"flex flex-col items-start space-y-3"}>
                {issue?.assignee && <UserAvatar user={issue.assignee}/>}

                <div className='text-xs text-gray-400 w-full'>Created {created}</div>
            </CardFooter>
        </Card>

        {isDialogOpen && <IssueDetailsDialog 
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            issue={issue}
            onDelete={onDeleteHandler}
            onUpdate={onUpdateHandler}
            borderCol={priorityBorderColors[issue.priority]}
            sprintStatus={sprintStatus}
        />}
    </>
  )
}

export default IssueCard;