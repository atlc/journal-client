import api from "../api";

export default async function shuffleBackground() {
    const urls = await api.images.getImageURLs();

    document.body.style.opacity = "0.8";
    document.body.style.backgroundSize = "contain";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    setInterval(() => {
        const url = urls[Math.floor(Math.random() * urls.length)];
        document.body.style.backgroundImage = `url(${url})`;
    }, 10000);
}
