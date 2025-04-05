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
                    <Button disabled variant={"outline"} className={`${className ? className : "w-fit"}`}>
                        Please wait...
                    </Button>
                ) : (
                    <Button type="submit" className={`${className ? className : "w-fit hover:cursor-pointer"}`}>
                        {text}
                    </Button>
                )
            }
        </>
    )
}