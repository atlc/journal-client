import Swal from "sweetalert2";
import { showLoginSwal, ACCESS_TOKEN_KEY, refreshAccessTokenIfNeeded } from "../../hooks/useAuth";

export async function fetcher<T = any>(path: string, method: string = "GET", rawData?: any) {
    const path_starts_with_auth = path.startsWith("/auth");

    const headers: HeadersInit = {};

    const options: RequestInit = {
        headers,
        method,
    };

    if (method === "POST" || method === "PUT") {
        headers["Content-Type"] = "application/json";
        options["body"] = JSON.stringify(rawData);
    }

    if (!path_starts_with_auth) {
        await refreshAccessTokenIfNeeded();
    }

    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return new Promise<T>(async (resolve) => {
        try {
            const URL = import.meta.env.VITE_SERVER_URL + path;

            const res = await fetch(URL, options);
            const data = await res.json();

            if (!res.ok) {
                console.error(data);
                Swal.fire({
                    icon: "error",
                    html: data.message,
                }).then(() => {
                    const is_invalid_refresh_token = res.status === 403 && path === "/auth/reload";
                    const is_general_auth_error = res.status === 401 || res.status === 403;
                    const is_bad_auth_request = res.status === 400 && path_starts_with_auth;

                    if (is_invalid_refresh_token) {
                        return showLoginSwal();
                    }

                    if (is_general_auth_error) {
                        return showLoginSwal();
                    }

                    if (is_bad_auth_request) {
                        return showLoginSwal();
                    }
                });
                return;
            }

            resolve(data);
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                html: (error as Error).message,
            });
        }
    });
}

export const POST = <T = any>(url: string, rawData: any) => fetcher<T>(url, "POST", rawData);
export const PUT = <T = any>(url: string, rawData: any) => fetcher<T>(url, "PUT", rawData);
export const DELETE = <T = any>(url: string) => fetcher<T>(url, "DELETE");
export const GET = <T = any>(url: string) => fetcher<T>(url);

import auth from "./auth";
import images from "./images";
import journals from "./journals";

export default {
    auth,
    images,
    journals,
};
