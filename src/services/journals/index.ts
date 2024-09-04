import { Journal } from "../../types";

const filter = ({ journals, filter, sortByNotes }: { journals: Journal[]; filter: string; sortByNotes?: boolean }) => {
    if (filter === "") {
        return journals;
    }

    const filtered = journals.filter((j) => {
        const contentMatches = j.content.toLowerCase().includes(filter.toLowerCase());
        const dateMatches = new Date(j.created_at).toDateString().toLowerCase().includes(filter.toLowerCase());
        const specialNoteMatch = typeof sortByNotes === "undefined" || j.is_note === sortByNotes;

        console.log({ contentMatches, dateMatches, specialNoteMatch });

        return (contentMatches || dateMatches) && specialNoteMatch;
    });

    return filtered;
};

export default {
    filter,
};
