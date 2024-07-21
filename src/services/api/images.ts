import { GET } from ".";

const getImageURLs = () => GET<string[]>("/api/images");

export default {
    getImageURLs,
};
