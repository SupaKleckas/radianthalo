import ReviewList from "@/app/components/Review/ReviewList";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;

    return (
        <ReviewList searchParams={{
            page: searchParams.page, query: searchParams.query, service: searchParams.service,
            category: searchParams.category, client: searchParams.client, employee: searchParams.employee
        }} staffView={true} />
    );
}