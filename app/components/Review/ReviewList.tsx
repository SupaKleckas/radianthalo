import { HiOutlineStar } from "react-icons/hi";
import { PaginationComponent } from "@/app/components/Page/Pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "@/app/components/Page/Search";
import { Suspense } from "react";
import { getReviews } from "@/app/actions/review/db";
import { ReviewFilters } from "@/app/components/Review/ReviewFilters";
import { getRatingCounts, getAverageRating } from "@/app/lib/analytics/getRatingAnalytics";
import { RatingChart } from "@/app/components/Analytics/RatingChart";

interface Props {
    searchParams?: {
        page?: string | undefined,
        query?: string | undefined,
        service?: string | undefined,
        category?: string | undefined,
        client?: string | undefined,
        employee?: string | undefined
    },
    staffView?: boolean
}

export default async function ReviewList({ searchParams, staffView }: Props) {
    const params = await searchParams;

    const query = params?.query || "";
    const service = params?.service || "";
    const category = params?.category || "";
    const employee = params?.employee || "";
    const client = params?.client || "";

    const currPage = Number(params?.page) || 1;
    const [reviews, meta] = await getReviews(currPage, query, service, category, client, employee);
    const pageAmount = meta?.pageCount;

    const ratingsAnalytics = await getRatingCounts();
    const average = await getAverageRating();

    return (
        <ScrollArea className="h-[80vh] w-full rounded-md pr-4">
            <div className="flex flex-col">
                {staffView ?
                    <div className="flex flex-col text-slate-800 gap-y-2 mb-4">
                        <h1 className="text-5xl">Reviews</h1>
                        <h1 className="text-base opacity-60">Browse all salon reviews.</h1>
                    </div>
                    :
                    <div className="flex flex-col text-slate-800 gap-y-2">
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-800">Browse reviews!</h1>
                    </div>}
                <div className='w-full'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <div className="flex justify-start mt-8 mb-8">
                            <RatingChart reviews={ratingsAnalytics} average={average} />
                        </div>
                        <div className='flex flex-col md:flex-row w-full justify-between gap-6 mb-4 mt-4'>
                            <Search placeholder="Search by content, service, or name..." />
                            <ReviewFilters />
                        </div>

                        <PaginationComponent pageAmount={pageAmount} />
                    </Suspense>
                    <Suspense fallback={<div className="text-center py-4">Loading reviews...</div>}>
                        {reviews.length === 0 && (
                            <div className="text-center mt-8 text-slate-600">
                                {query
                                    ? `No reviews found matching "${query}"`
                                    : "No reviews found"}
                            </div>
                        )}
                        <ul className='flex w-full flex-col items-center justify-center mt-4'>
                            {reviews.map((review) => (
                                <li key={review.id} className='flex flex-col p-4 rounded-lg mb-4 w-full bg-slate-100 hover:bg-slate-200'>
                                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-between items-start m-6">

                                        <div className="flex flex-col gap-6">
                                            <p className="text-2xl md:text-3xl">{review.client.user.firstName} {review.client.user.lastName}</p>
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <HiOutlineStar key={star} className={`text-2xl md:text-3xl ${star <= review.rating ? "fill-yellow-400 text-yellow-400 " : "text-gray-300 fill-gray-300 "}`} />
                                                ))}
                                            </div>
                                            <p className="text-base md:text-xl">{review.content}</p>
                                            <p className="text-xs md:text-sm text-slate-600">Service provided by {review.employee.user.firstName} {review.employee.user.lastName}</p>
                                        </div>

                                        <div className="flex gap-2 text-xs md:text-sm">
                                            <span className="bg-slate-300 px-2 py-1 rounded">
                                                {review.service.title}
                                            </span>
                                            <span className="bg-slate-400 px-2 py-1 rounded">
                                                {review.service.category}
                                            </span>
                                        </div>

                                    </div>
                                </li>
                            ))}
                        </ul>
                    </Suspense>
                </div>
            </div>
        </ScrollArea>
    )
}