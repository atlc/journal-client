import Swal from "sweetalert2";
import { showLoginSwal, TOKEN_KEY } from "../../hooks/useAuth";

export async function fetcher<T = any>(path: string, method: string = "GET", rawData?: any) {
    const headers: HeadersInit = {};

    const options: RequestInit = {
        headers,
        method,
    };

    if (method === "POST" || method === "PUT") {
        headers["Content-Type"] = "application/json";
        options["body"] = JSON.stringify(rawData);
    }

    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return new Promise<T>(async (resolve) => {
        try {
            const URL = import.meta.env.VITE_SERVER_URL + path;

            console.log({ URL, options });

            const res = await fetch(URL, options);
            const data = await res.json();

            if (!res.ok) {
                console.error(data);
                Swal.fire({
                    icon: "error",
                    html: data.message,
                }).then(() => {
                    if (res.status === 401 || res.status === 403) {
                        showLoginSwal();
                    }

                    if (res.status === 400 && path.startsWith("/auth")) {
                        showLoginSwal();
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
