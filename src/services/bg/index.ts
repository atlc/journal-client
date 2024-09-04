import api from "../api";

async function shuffleBackground() {
    const urls = await api.images.getImageURLs();

    document.body.style.opacity = "0.8";
    document.body.style.backgroundSize = "cover";
    // document.body.style.backgroundSize = "contain";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";

    async function preloadNextImage() {
        return new Promise((resolve) => {
            const url = urls[Math.floor(Math.random() * urls.length)];
            const nextImage = new Image();
            nextImage.src = url;
            nextImage.onload = () => resolve(url);
        });
    }

    setInterval(async () => {
        preloadNextImage().then((url) => {
            document.body.style.backgroundImage = `url(${url})`;
        });
    }, 20000);
}

export default {
    shuffleBackground,
};
