"use client"
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ServiceCategory } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiFilter } from "react-icons/hi";

export function ReviewFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get("category");

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.push(`?${params.toString()}`);

    };

    const getFilterText = () => {
        return selectedCategory && Object.values(ServiceCategory).includes(selectedCategory as ServiceCategory)
            ? selectedCategory
            : "Select Service Category";
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2 text-slate-800">
                    <HiFilter className="mr-2" />
                    {getFilterText()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
                <DropdownMenuRadioGroup
                    value={searchParams.get("category") || ""}
                    onValueChange={(value) => handleFilter("category", value)}
                >
                    <DropdownMenuRadioItem value="" className="text-slate-800">All Categories</DropdownMenuRadioItem>
                    {Object.values(ServiceCategory).map((category) => (
                        <DropdownMenuRadioItem key={category} value={category}>
                            {category}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}