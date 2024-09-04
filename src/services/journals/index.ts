import { Journal } from "../../types";

const filter = ({ journals, filter }: { journals: Journal[]; filter: string }) => {
    if (filter === "") {
        return journals;
    }

    const filtered = journals.filter((j) => {
        const contentMatches = j.content.toLowerCase().includes(filter.toLowerCase());
        const dateMatches = new Date(j.created_at).toDateString().toLowerCase().includes(filter.toLowerCase());

        console.log({ contentMatches, dateMatches, j });

        return contentMatches || dateMatches;
    });

    return filtered;
};

export default {
    filter,
};
