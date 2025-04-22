import ReviewList from "@/app/components/Review/ReviewList";

interface SearchParamsProps {
    searchParams?: {
        page?: string,
        query?: string,
        service?: string,
        category?: string,
        client?: string,
        employee?: string
    };
}

export default async function Page({ searchParams }: SearchParamsProps) {
    return (
        <div className="m-8">
            <ReviewList searchParams={searchParams} />
        </div>
    );
}