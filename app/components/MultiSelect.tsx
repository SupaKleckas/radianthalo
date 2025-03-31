"use client";

import { useState } from "react";
import { HiCheck, HiOutlineChevronDoubleDown } from "react-icons/hi";
import { Button } from "@/components/ui/button"
import { User } from "@prisma/client";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function MultiSelect({
    employees,
    selectedValues,
    setSelectedValues,
}: {
    employees: User[];
    selectedValues: string[];
    setSelectedValues: (values: string[]) => void;
}) {
    const [open, setOpen] = useState(false);

    function label(employee: User) {
        return employee.firstName + " " + employee.lastName;
    }

    const handleSetValue = (id: string) => {
        if (selectedValues.includes(id)) {
            selectedValues.splice(selectedValues.indexOf(id), 1);
            setSelectedValues(selectedValues.filter((item) => item !== id));
        } else {
            setSelectedValues([...selectedValues, id]);
        }
    }

    const selectedEmployees = employees.filter((e) => selectedValues.includes(e.id));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[480px] justify-between"
                >
                    <div className="flex gap-2 justify-start">
                        {selectedEmployees.length > 0
                            ? selectedEmployees.map((e) => label(e)).join(", ")
                            : "Select employees..."}
                    </div>
                    <HiOutlineChevronDoubleDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search employees..." />
                    <CommandEmpty>No employees found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            {employees.map((employee) => (
                                <CommandItem
                                    key={employee.id}
                                    value={employee.id}
                                    onSelect={() => {
                                        handleSetValue(employee.id);
                                    }}>
                                    <HiCheck className={`mr-2 h-4 w-4 ${selectedValues.includes(employee.id) ? "opacity-100" : "opacity-0"}`} />
                                    {label(employee)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}