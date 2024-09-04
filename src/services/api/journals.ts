import Swal from "sweetalert2";
import { DELETE, GET, POST } from ".";
import { Journal } from "../../types";

const ENDPOINT = "/api/journals";

const create = (content: string, isNote?: boolean) => POST(ENDPOINT, { content, is_note: isNote });
const destroy = (id: string) => DELETE(`${ENDPOINT}/${id}`);
const load = () => GET<Journal[]>(ENDPOINT);

const handleDelete = async (id: string) => {
    return Swal.fire({
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
            destroy(id).then(() => {
                return Swal.fire("Deleted!", "Your journal has been deleted successfully", "success");
            });
        }
    });
};

export default {
    create,
    destroy,
    load,
    handleDelete,
};
