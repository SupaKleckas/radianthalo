"use client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Employee, User } from "@prisma/client"
import { HiUser } from "react-icons/hi";

interface SelectionParams {
    selectionContent: (Employee & { user: User })[];
    selectedValue: (Employee & { user: User }) | null;
    setSelectedValue: (value: (Employee & { user: User })) => void;
}

export function EmployeeSelection({ selectionContent, selectedValue, setSelectedValue }: SelectionParams) {
    return (
        <div className="flex flex-row items-center gap-5">
            <HiUser className="text-3xl" />
            <Select
                value={selectedValue ? selectedValue.userId : ""}
                onValueChange={(userId) => {
                    const selectedEmployee = selectionContent.find((employee) => employee.userId === userId);
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
                        <SelectItem key={employee.userId} value={employee.userId}>
                            {employee.user.firstName} {employee.user.lastName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}