import Checkout from "@/app/components/Booking/Checkout"
import { Employee, Service } from "@prisma/client"

interface Params {
    selectedEmployee: Employee,
    date: Date,
    time: string,
    service: Service,
    timezone: string
}


//selectedEmployee, date, time, service, Intl.DateTimeFormat().resolvedOptions().timeZone

export default function Page({ selectedEmployee, date, time, service, timezone }: Params) {
    return (
        <Checkout amount={service.price} />
    )
}