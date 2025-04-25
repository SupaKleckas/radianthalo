import prisma from "@/app/lib/database/db";

export async function getRatingCounts() {
    const data = await prisma.review.groupBy({
        by: ['rating'],
        // where: filteroption,
        _count: {
            rating: true
        }
    });

    const ratingMap = new Map<number, number>();
    data.forEach(({ rating, _count }) => {
        ratingMap.set(rating, _count.rating);
    });

    const result = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        title: `⭐ ${rating}`,
        count: ratingMap.get(rating) || 0
    }));

    return result;
}

export async function getAverageRating() {
    const counts = await getRatingCounts();
    const { total, count } = counts.reduce(
        (acc, { rating, count }) => ({
            total: acc.total + rating * count,
            count: acc.count + count
        }),
        { total: 0, count: 0 }
    );
    return count > 0 ? Number((total / count).toFixed(1)) : 0;
}