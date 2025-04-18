// components/Filters.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiFilter } from "react-icons/hi";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function RoleFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const roleFilter = searchParams.get("role") || "";

    const handleRoleFilter = (role: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (role) {
            params.set("role", role);
        } else {
            params.delete("role");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                    <HiFilter className="mr-2" />
                    Filters
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
                <DropdownMenuRadioGroup
                    value={roleFilter}
                    onValueChange={handleRoleFilter}
                >
                    <DropdownMenuRadioItem value="">All Roles</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ADMIN">Admin</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="USER">User</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="EMPLOYEE">Employee</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}