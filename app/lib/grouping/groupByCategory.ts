import { Service, ServiceCategory } from "@prisma/client";

export function groupByCategory(services: Service[]) {
    const serviceGroups: {
        [category: string]:
        Service[]
    } = {}

    for (const category of Object.values(ServiceCategory)) {
        serviceGroups[category] = [];
        services.forEach(service => {
            if (service.category == category) {
                serviceGroups[category].push(service);
            }
        });

    }

    const grouped = Object.entries(serviceGroups);
    const result = new Map(grouped);
    return result;
}