import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react'
import UserAvatar from './user-avatar';
import { formatDistanceToNow } from 'date-fns';

const priorityColors = {
    LOW: "border-t-green-500",
    MEDIUM: "border-t-yellow-500",
    HIGH: "border-t-orange-500",
    URGENT: "border-t-red-500",
};

const IssueCard = ({
    issue,
    showStatus = false,
    onDelete = () => {},
    onUpdate = () => {},
}) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const created = formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true });

  return (
    <>
        <Card className={`!bg-slate-950 cursor-pointer hover:shadow-md transition-shadow border-t-4 ${priorityColors[issue.priority]} rounded-md`}>
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
                <UserAvatar user={issue?.assignee}/>

                <div className='text-xs text-gray-400 w-full'>Created {created}</div>
            </CardFooter>
        </Card>

        {isDialogOpen && <></>}
    </>
  )
}

export default IssueCard;