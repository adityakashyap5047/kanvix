"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const IssueCreationDrawer = ({
    isOpen,
    onClose,
    sprintId,
    status,
    projectId,
    onIssueCreated,
    orgId
}) => {
  return (
    <Drawer open={isOpen} onClose={onClose}>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Create Issue</DrawerTitle>
            </DrawerHeader>
        </DrawerContent>
    </Drawer>
  )
}

export default IssueCreationDrawer