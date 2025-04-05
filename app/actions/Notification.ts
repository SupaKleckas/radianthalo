"use client";
import { toast } from "sonner";

export default function Notification(title: string, description?: string) {
    return (
        toast(title, {
            description: description
        })
    )
}