"use client";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface ButtonProps {
    text: string,
    className?: string
}

export function SubmitButton({ text, className }: ButtonProps) {
    const { pending } = useFormStatus();

    return (
        <>
            {
                pending ? (
                    <Button disabled variant={"outline"} className={`${className ? className : "w-fit, bg-slate-500"}`}>
                        Please wait...
                    </Button>
                ) : (
                    <Button type="submit" className={`${className ? className : "w-fit hover:cursor-pointer bg-slate-700 hover:bg-slate-800"}`}>
                        {text}
                    </Button>
                )
            }
        </>
    )
}