import { GET, POST } from ".";
import { ACCESS_TOKEN_KEY, LoginResponse, REFRESH_TOKEN_KEY, showLoginSwal } from "../../hooks/useAuth";

const reload = () => {
    const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refresh_token) showLoginSwal();

    POST<LoginResponse>("/auth/reload", { refresh_token }).then(({ access_token }) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
    });
};

const validate = () => GET("/auth/validate");

export default {
    reload,
    validate,
};
