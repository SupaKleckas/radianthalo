"use client";
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation";
import Link from "next/link";
import { Service, User } from "@prisma/client";
import { useState } from "react";
import { StarRating } from "./StarRating";
import { MessageFunction } from "@/app/components/Notifications/Message"
import { addReviewAction } from "@/app/actions/review/actions";
import { HiUser } from "react-icons/hi";

interface Params {
    service: Service,
    employee: User,
    clientId: string
}

export default function ReviewForm({ service, employee, clientId }: Params) {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            MessageFunction({ type: "info", message: "Please select a star rating first." })
            return;
        }

        setLoading(true);
        const result = await addReviewAction(rating, content, service.id, employee.id, clientId);
        if (result.success) {
            redirect("/home/appointments?status=review-success")
        } else {
            MessageFunction({ type: "error", message: result.message })
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center flex-col gap-y-6">
            <div className="flex flex-col justify-start w-[90%] lg:w-[70%] gap-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-800">Leave a rating and review!</h1>
                <h1 className="text-2xl md:text-4xl font-base text-slate-500">Share your feedback to help improve our services.</h1>
            </div>
            <div className="flex w-[90%] lg:w-[70%]">
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <div className="flex flex-row justify-start w-[90%] lg:w-[70%] items-center gap-x-10 text-xl text-slate-600">
                <div>{service.title}</div>
                {employee ? <div className="flex flex-row items-center"><HiUser /> {employee.firstName + " " + employee.lastName} </div> : null}
            </div>
            <div className="flex flex-col gap-y-2 w-[90%] lg:w-[70%]">
                <Label htmlFor="textarea">Share details about your experience here!</Label>
                <Textarea id="textarea"
                    placeholder="Type your review here."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px]"
                />
            </div>
            <div className="flex gap-x-4 justify-end w-[90%] lg:w-[70%]">
                <Link href={"/home/appointments"}>
                    <Button className="hover:cursor-pointer bg-slate-400 hover:bg-slate-600">Cancel</Button>
                </Link>
                <Button onClick={handleSubmit} className="hover:cursor-pointer bg-slate-700"> {loading ? "Please wait..." : "Submit"}</Button>
            </div>
        </div>
    )
}