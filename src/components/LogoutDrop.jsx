import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUserRound } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { logout } from '../services/authService';

const LogoutDrop = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="bg-white w-[40px] h-[40px] me-5 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors">
                <CircleUserRound />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={()=>{logout()}}><LogOut />Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default LogoutDrop
