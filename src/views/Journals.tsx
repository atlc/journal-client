import React, { useEffect, useState } from "react";
import { Journal } from "../types";
import api from "../services/api";

const Journals = () => {
    const [journals, setJournals] = useState<Journal[]>([]);

    useEffect(() => {
        api.journals.load().then(setJournals);
    }, []);

    return (
        <div>
            <h1 style={{ backgroundColor: "black" }}>Journals</h1>
            <div style={{ display: "flex", flexWrap: "wrap", backgroundColor: "white", marginTop: "5%", opacity: "0.5" }}>
                {journals.map((j) => (
                    <div style={{ width: "40%", border: "2px solid red", margin: "4%" }}>
                        <h1 style={{ color: "black" }}>{new Date(j.created_at).toLocaleString()}</h1>
                        <textarea
                            name=""
                            id=""
                        >
                            {j.content}
                        </textarea>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Journals;
