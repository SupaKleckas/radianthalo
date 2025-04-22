"use client"

import { HiOutlineStar } from "react-icons/hi";

interface Props {
    rating: number;
    setRating: (rating: number) => void;
}

export function StarRating({ rating, setRating }: Props) {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <HiOutlineStar className={`text-5xl hover:cursor-pointer  ${star <= rating ?
                        "fill-yellow-400 text-yellow-400 hover:fill-yellow-600  hover:text-yellow-600"
                        : "text-gray-300 hover:fill-yellow-400  hover:text-yellow-400"}`} />
                </button>
            ))}
        </div>
    );
}