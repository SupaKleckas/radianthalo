"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Employee, User } from "@prisma/client"
import { HiUser } from "react-icons/hi";

interface SelectionParams {
    selectionContent: User[];
    selectedValue: User | null;
    setSelectedValue: (value: User) => void;
}

export function EmployeeSelection({ selectionContent, selectedValue, setSelectedValue }: SelectionParams) {
    return (
        <div className="flex flex-row items-center gap-5">
            <HiUser className="text-3xl" />
            <Select
                value={selectedValue ? selectedValue.id : ""}
                onValueChange={(id) => {
                    const selectedEmployee = selectionContent.find((employee) => employee.id === id);
                    if (selectedEmployee) {
                        setSelectedValue(selectedEmployee);
                    }
                }}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {selectionContent.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}