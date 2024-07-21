import { GET, POST } from ".";
import { Journal } from "../../types";

const ENDPOINT = "/api/journals";

const create = (content: string) => POST(ENDPOINT, { content });

const load = () => GET<Journal[]>(ENDPOINT);

export default {
    create,
    load,
};
