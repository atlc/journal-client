import { DELETE, GET, POST } from ".";
import { Journal } from "../../types";

const ENDPOINT = "/api/journals";

const create = (content: string) => POST(ENDPOINT, { content });
const destroy = (id: string) => DELETE(`${ENDPOINT}/${id}`);
const load = () => GET<Journal[]>(ENDPOINT);

export default {
    create,
    destroy,
    load,
};
