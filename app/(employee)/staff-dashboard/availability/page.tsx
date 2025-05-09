"use server";
import { getEmployeeAvailability, updateAvailabilityAction } from "@/app/actions/availibility/actions";
import { SubmitButton } from "@/app/components/UI/Buttons";
import { times } from "@/app/lib/date/times";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import TemporaryLeaveForm from "@/app/components/Availability/TemporaryLeaveForm";
import Message from "@/app/components/Notifications/Message";
import { ScrollArea } from "@/components/ui/scroll-area";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
    const data = await getEmployeeAvailability();
    const { status } = await props.searchParams;

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="text-slate-800 mb-6">
                <h1 className="text-5xl">Availability</h1>
                <h1 className="text-base opacity-60">Handle your availability here!</h1>
            </div>
            {status == "success" ? <Message type="success" message="Time off submitted successfully!" /> : null}
            {status == "availability-success" ? <Message type="success" message="Availability adjusted successfully!" /> : null}
            <div className="flex flex-col gap-y-4">
                <Card className="bg-slate-300">
                    <form action={updateAvailabilityAction}>
                        <CardContent className="flex flex-col gap-y-4">
                            {
                                !data ?
                                    <h1> Something went wrong! Try again later... </h1>
                                    :
                                    data.map((availability) => (
                                        <div key={availability.id} className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
                                            <input type="hidden" name={`id-${availability.id}`} value={availability.id} />
                                            <div className="flex items-center gap-x-4 text-3xl text-slate-700">
                                                <Switch name={`isActive-${availability.id}`} defaultChecked={availability.isActive} className="data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-slate-200" />
                                                <p>{availability.day}</p>
                                            </div>
                                            <Select name={`fromTime-${availability.id}`} defaultValue={availability.fromTime}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="From" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {times.map((time) => (
                                                            <SelectItem key={time.id} value={time.time}>
                                                                {time.time}
                                                            </SelectItem>
                                                        ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <Select name={`untilTime-${availability.id}`} defaultValue={availability.untilTime}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Until" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {times.map((time) => (
                                                            <SelectItem key={time.id} value={time.time}>
                                                                {time.time}
                                                            </SelectItem>
                                                        ))
                                                        }
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                        </CardContent>
                        <CardFooter className="flex justify-end mt-4">
                            <SubmitButton text="Apply" />
                        </CardFooter>
                    </form>
                </Card>
                <TemporaryLeaveForm />
            </div>
        </ScrollArea>
    );
}