import { User } from '@/app/lib/Types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

const UserAvatar = ({user}: {user: User}) => {
  return (
    <div className='flex items-center space-x-2 w-full'>
        <Avatar className={"h-6 w-6"}>
            <AvatarImage src={user?.imageUrl ?? ""} alt={user?.name ?? ""} />
            <AvatarFallback className={"capitalize"}>{user && user.name ? user.name.charAt(0) : "?"}</AvatarFallback>
        </Avatar>
        <span className='text-xs text-gray-500'>
            {user ? user.name : "Unassigned"}
        </span>
    </div>
  )
}

export default UserAvatar