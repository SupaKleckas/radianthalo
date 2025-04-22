"use client";
import { HiSearch } from "react-icons/hi";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from 'use-debounce';

interface Params {
    placeholder?: string
}

export function Search({ placeholder }: Params) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="relative flex flex-1">
            <Input
                id="search"
                className="w-full lg:w-[30%] rounded pl-10 text-sm focus-visible:ring-[1px]"
                placeholder={`${placeholder ? placeholder : "Search..."}`}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
                defaultValue={searchParams.get('query')?.toString()}
            />
            <HiSearch className="absolute left-3 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-slate-400" />
        </div>
    )
}