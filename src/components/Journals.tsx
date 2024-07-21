import { useEffect, useState } from "react";
import { Journal } from "../types";
import api from "../services/api";
import Swal from "sweetalert2";

const MAX_CONTENT_LENGTH = 10_000;

const Journals = () => {
    const [disabled, setDisabled] = useState(true);
    const [content, setContent] = useState("");
    const [journals, setJournals] = useState<Journal[]>([]);

    const fetchJournals = () => api.journals.load().then(setJournals);

    useEffect(() => {
        setDisabled(content.length < 12);
    }, [content]);

    useEffect(() => {
        fetchJournals();
    }, []);

    const handleSubmit = () => {
        setDisabled(true);
        api.journals.create(content).then(() => {
            fetchJournals();
            setDisabled(false);
            setContent("");
        });
    };

    const handleDelete = (id: string) => {
        Swal.fire({
            title: "Are you sure you want to delete this journal?",
            text: "This action is PERMANENT, the journal cannot be recovered.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                api.journals.destroy(id).then(() => {
                    fetchJournals();
                    Swal.fire("Deleted!", "Your journal has been deleted successfully", "success");
                });
            }
        });
    };

    return (
        <div>
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
                    style={{ width: "60%", fontSize: "1.5rem", fontFamily: " Inter, system-ui, Avenir, Helvetica, Arial, sans-serif", borderRadius: "12px" }}
                    value={content}
                    rows={7}
                    maxLength={MAX_CONTENT_LENGTH}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    style={{ color: "white", backgroundColor: disabled ? "#690f0f" : "#0f690f" }}
                    disabled={disabled}
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
                </button>
            </div>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginTop: "5%",
                    borderRadius: "12px",
                    backgroundColor: "white",
                    opacity: "0.8",
                    overflowY: "auto",
                    height: "60vh",
                }}
            >
                {journals.map((j) => (
                    <div style={{ width: "80%", border: "2px solid black", borderRadius: "12px", margin: "4%", backgroundColor: "white" }}>
                        <h2 style={{ color: "black" }}>
                            {new Date(j.created_at).toLocaleDateString()}{" "}
                            <span
                                style={{ marginLeft: "15px" }}
                                onClick={() => handleDelete(j._id)}
                            >
                                ❌
                            </span>
                        </h2>
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
                        <p style={{ color: "black" }}>{new Date(j.created_at).toLocaleTimeString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Journals;
