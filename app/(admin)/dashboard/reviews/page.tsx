import ReviewList from "@/app/components/Review/ReviewList";

export type paramsType = Promise<{
    page?: string,
    query?: string,
    service?: string,
    category?: string,
    client?: string,
    employee?: string
}>;

export default async function Page(props: { params: paramsType }) {
    const { page, query, service, category, client, employee } = await props.params;

    return (
        <ReviewList searchParams={{ page, query, service, category, client, employee }} staffView={true} />
    );
}