import { useEffect, useState } from "react";
import { Journal } from "../types";
import services from "../services";

const MAX_CONTENT_LENGTH = 10_000;

const Journals = () => {
    const [content, setContent] = useState("");
    const [isNote, setIsNote] = useState<boolean>(false);
    const [journals, setJournals] = useState<Journal[]>([]);
    const [filteredJournals, setFilteredJournals] = useState<Journal[]>([]);
    const [filter, setFilter] = useState("");
    const [sortByNotes, setSortByNotes] = useState<boolean>();

    const fetchJournals = () => {
        services.api.journals.load().then((jrnls) => {
            setJournals(jrnls);
            setFilteredJournals(jrnls);
        });
    };

    useEffect(() => {
        console.log({ filter, sortByNotes });
        const filtered = services.journals.filter({ journals, filter, sortByNotes });
        setFilteredJournals(filtered);
    }, [filter, sortByNotes]);

    useEffect(() => {
        fetchJournals();
    }, []);

    const getWords = (string: string) => {
        const count = string.split(" ").length;

        return count === 1 ? `${count} word` : `${count} words`;
    };

    const handleClearFilters = () => {
        setFilter("");
        setSortByNotes(undefined);
    };

    const handleDelete = (id: string) => {
        services.api.journals.handleDelete(id).then(fetchJournals);
    };

    const handleSubmit = () => {
        services.api.journals.create(content, isNote).then(() => {
            fetchJournals();
            setContent("");
        });
    };

    const handleToggle = (id: string, current_status: boolean) => {
        services.api.journals.toggle(id, !current_status).then(fetchJournals);
    };

    return (
        <div>
            {/* New Journal Input Panel */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "5%",
                    padding: "2%",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    opacity: "0.9",
                }}
            >
                <textarea
                    style={{ width: "60%", fontSize: "1.5rem", fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", borderRadius: "12px" }}
                    value={content}
                    rows={7}
                    maxLength={MAX_CONTENT_LENGTH}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    style={{ color: "white", backgroundColor: content.length < 12 ? "#690f0f" : "#0f690f", marginLeft: "1%" }}
                    disabled={content.length < 12}
                >
                    {`Submit Journal Entry`.split(" ").map((word) => (
                        <span
                            key={word}
                            style={{ display: "block", marginBottom: "3px" }}
                        >
                            {word}
                        </span>
                    ))}
                    <span style={{ display: "block", marginTop: "18px" }}>
                        {content.length.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()}
                    </span>
                    <span style={{ display: "block", marginTop: "3px" }}>{getWords(content)}</span>
                </button>

                <button
                    onClick={() => setIsNote(!isNote)}
                    style={{ color: "white", backgroundColor: isNote ? "#0f690fB3" : "#690f0fB3", marginLeft: "1%" }}
                >
                    <p>Is this a note?</p>
                    <p>Currently "{isNote ? "yes" : "no"}".</p>
                    <p>Click me to switch</p>
                </button>
            </div>

            {/* Journals Panel with Searchbar */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginTop: "5%",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    opacity: "0.8",
                    overflowY: "auto",
                    height: "60vh",
                }}
            >
                <div>
                    <div style={{ border: "2px solid black", borderRadius: "12px", paddingBottom: "4%" }}>
                        <span style={{ fontSize: "1.85rem", marginRight: "10px" }}>🔎</span>
                        <input
                            style={{
                                fontSize: "1.85rem",
                                marginTop: "5%",
                                borderRadius: "12px",
                            }}
                            type="search"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <div>
                            <p style={{ color: "black", margin: "2%" }}>
                                Sort by special notes?{" "}
                                <input
                                    checked={!!sortByNotes}
                                    onChange={(e) => setSortByNotes(!!e.target.checked)}
                                    type="checkbox"
                                />
                            </p>
                            <button
                                onClick={handleClearFilters}
                                style={{ color: "white", margin: "2%" }}
                            >
                                Clear filters?
                            </button>
                        </div>
                    </div>
                    {filter && (
                        <p style={{ color: "black" }}>
                            {filteredJournals.length.toLocaleString()} results for{" "}
                            {typeof sortByNotes !== "undefined" ? (sortByNotes ? "noted" : "non-note") : ""} entries containing "{filter}":
                        </p>
                    )}
                </div>

                <>
                    {filteredJournals.map((j) => (
                        <div
                            key={j._id}
                            style={{ width: "80%", border: "2px solid black", borderRadius: "12px", margin: "4%", backgroundColor: "white" }}
                        >
                            <h2 style={{ color: "black" }}>
                                {new Date(j.created_at).toDateString()}{" "}
                                <span
                                    style={{ marginLeft: "15px" }}
                                    onClick={() => handleDelete(j._id)}
                                >
                                    ❌
                                </span>
                            </h2>
                            <h3
                                style={{ color: "black" }}
                                onClick={() => handleToggle(j._id, j.is_note)}
                            >
                                {j.is_note ? "IS" : "Is NOT"} a special note. Click to toggle 📝
                            </h3>
                            <hr />
                            <div>
                                {j.content.split("\n").map((line, i) => (
                                    <p
                                        style={{ color: "black" }}
                                        key={`j-${j._id}-p-${i}`}
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                            <p style={{ color: "black" }}>
                                {getWords(j.content)}. Posted {new Date(j.created_at).toLocaleTimeString()}
                            </p>
                        </div>
                    ))}
                </>
            </div>
        </div>
    );
};

export default Journals;
