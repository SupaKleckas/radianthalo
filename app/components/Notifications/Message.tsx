"use client";
import { toast } from "sonner";
import { useEffect } from "react";
interface Params {
    type?: string
    message?: string
}

export default function Message({ type = "default", message }: Params) {
    useEffect(() => {
        if (!message) return;

        const toastId = (() => {
            switch (type) {
                case "success":
                    return toast.success(message);
                case "error":
                    return toast.error(message);
                case "warning":
                    return toast.warning(message);
                case "info":
                    return toast.info(message);
                case "default":
                default:
                    return toast(message);
            }
        })();

        return () => {
            toast.dismiss(toastId);
        };
    }, [type, message]);

    return null;
}