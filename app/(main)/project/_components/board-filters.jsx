import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import React, { useEffect } from 'react'

const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const BoardFilters = ({ issues, onFilterChange }) => {

    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedAssignees, setSelectedAssignees] = React.useState([]);
    const [selectedPriority, setSelectedPriority] = React.useState('');

    const assignees = issues.
        map((issue) => issue.assignee)
        .filter(
            (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        );

    const isFilteredApplied = 
        searchTerm !== "" ||
        selectedAssignees.length > 0 ||
        selectedPriority !== "";

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedAssignees([]);
        setSelectedPriority('');
    };

    useEffect(() => {
        const filteredIssues = issues.filter(
            (issue) => 
                issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedAssignees.length === 0 || 
                    selectedAssignees.includes(issue.assignee?.id)) &&
                (selectedPriority === '' || issue.priority === selectedPriority)
        )

        onFilterChange(filteredIssues);
    }, [searchTerm, selectedAssignees, selectedPriority, issues])

    const toggleAssignee = (assigneeId) => {
        setSelectedAssignees((prev) => 
            prev.includes(assigneeId)
                ? prev.filter((id) => id !== assigneeId)
                : [...prev, assigneeId]
        )
    }

    return (
        <div>
            <div className='flex flex-col px-4 pr-2 sm:flex-row gap-4 sm:gap-6 mt-6'>
                <Input
                    className={'w-full sm:w-72'}
                    placeholder='Search issues...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className='flex-shrink-0'>
                    <div className={`flex gap-2 flex-wrap`}>
                        {assignees?.map((assignee, i) => {
                            const selected = selectedAssignees.includes(assignee.id);
                            return (
                                <div 
                                    key={assignee.id}
                                    className={`rounded-full ring-2 ${
                                        selected ? "ring-red-200" : "ring-white/20"
                                    } ${i > 0 ? "-ml-6" : ""}`}
                                    style={{zIndex: i}}
                                    onClick={() => toggleAssignee(assignee.id)}
                                >
                                    <Avatar className={"h-10 w-10 cursor-pointer"}>
                                        <AvatarImage src={assignee?.imageUrl} />
                                        <AvatarFallback className={"capitalize"}>{assignee ? assignee.name.charAt(0) : "?"}</AvatarFallback>
                                    </Avatar>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div>
                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                        <SelectTrigger className={`w-full sm:w-52 cursor-pointer !bg-slate-900 border-2`}>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className={"!bg-slate-800"}>
                            {priorities.map((priority, idx) => (
                                <SelectItem 
                                    key={idx} 
                                    value={priority}
                                    className={`cursor-pointer hover:!bg-slate-950`}
                                >{priority}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isFilteredApplied && (
                    <Button
                        variant={"ghost"}
                        className={"flex items-center w-full sm:w-32 cursor-pointer"}
                        onClick={clearFilters}
                    >
                        <X className='mr-2 h-4 w-4' /> Clear Filters
                    </Button>
                )}
            </div>
        </div>
    )
}

export default BoardFilters