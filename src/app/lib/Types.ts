export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type IssueStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "BLOCKED" | "ARCHIVED" | "DONE" | "CLOSED";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type User = {
    id: string;
    clerkUserId: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Project = {
    id: string;
    name: string;
    key: string;
    description: string | null;
    organizationId: string;
    sprints?: Sprint[];
    issues?: Issue[];
    createdAt: Date;
    updatedAt: Date;
};

export type Sprint = {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    status: SprintStatus;
    projectId: string;
    project?: Project;
    issues?: Issue[];
    createdAt: Date;
    updatedAt: Date;
};

export type Issue = {
    id: string;
    title: string;
    description: string | null;
    status: IssueStatus;
    order: number;
    priority: IssuePriority;
    assigneeId: string | null;
    assignee?: User | null;
    reporterId: string;
    reporter?: User;
    projectId: string;
    project?: Project;
    sprintId: string | null;
    sprint?: Sprint | null;
    createdAt: Date;
    updatedAt: Date;
};