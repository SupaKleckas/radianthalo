"use client";

import { FC } from "react";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    pageAmount: number;
}

interface PaginationNavProps {
    towards: "previous" | "next";
    href: string;
    isDisabled: boolean;
}

const PaginationNav: FC<PaginationNavProps> = ({
    towards,
    href,
    isDisabled,
}) => {
    const router = useRouter();
    const isPrev = towards === "previous";
    const disabledClassName = isDisabled ? "opacity-50 cursor-not-allowed" : "";

    return (
        <Button
            onClick={() => router.push(href)}
            className={`bg-gray-100 text-gray-500 hover:bg-gray-200 ${disabledClassName}`}
            aria-disabled={isDisabled}
            disabled={isDisabled}
        >
            {isPrev ? <HiChevronDoubleLeft /> : <HiChevronDoubleRight />}
        </Button>
    );
};

export function PaginationComponent({ pageAmount }: Readonly<PaginationProps>) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationNav
                        towards="previous"
                        href={createPageURL(currentPage - 1)}
                        isDisabled={currentPage <= 1}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="p-2 font-semibold text-gray-500">
                        Page {currentPage}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNav
                        towards="next"
                        href={createPageURL(currentPage + 1)}
                        isDisabled={currentPage >= pageAmount}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}