import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { POST } from "../services/api";
import { jwtDecode } from "jwt-decode";

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export const showLoginSwal = (isRegistration: boolean = false) => {
    const SwalForm = () => {
        return `
      ${isRegistration ? '<label for="swal-input1">Name</label><input id="swal-input1" class="swal2-input" placeholder="Enter your name">' : ""}
      <label for="swal-input2">Email</label><input id="swal-input2" class="swal2-input" placeholder="Enter your email" type="email">
      <label for="swal-input3">Password</label><input id="swal-input3" class="swal2-input" placeholder="Enter your password" type="password">
      <label><input id="swal-toggle" type="checkbox" ${isRegistration ? "checked" : ""}> Register</label>
    `;
    };

    Swal.fire({
        title: isRegistration ? "Register" : "Login",
        html: SwalForm(),
        focusConfirm: false,
        preConfirm: () => {
            const name = isRegistration ? (document.getElementById("swal-input1") as HTMLInputElement)?.value : "";
            const email = (document.getElementById("swal-input2") as HTMLInputElement)?.value || "";
            const password = (document.getElementById("swal-input3") as HTMLInputElement)?.value || "";
            if (isRegistration && !name) {
                Swal.showValidationMessage("Please enter your name");
            }
            if (!email) {
                Swal.showValidationMessage("Please enter your email");
            }
            if (!password) {
                Swal.showValidationMessage("Please enter your password");
            }
            if ((isRegistration && !name) || !email || !password) {
                return false;
            }
            return { name, email, password };
        },
        didOpen: () => {
            const toggle = document.getElementById("swal-toggle") as HTMLInputElement;
            toggle.addEventListener("click", () => {
                showLoginSwal(!isRegistration); // Re-render the modal
            });
        },
    }).then((result) => {
        if (result.isConfirmed) {
            const URL = isRegistration ? `/auth/register` : `/auth/login`;
            const { name, email, password } = result.value!;

            POST<LoginResponse>(URL, { name, email, password }).then(({ access_token, refresh_token }) => {
                if (access_token) localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
                if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
            });
        }
    });
};

export default async function useAuth() {
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);

        if (!token) showLoginSwal();
    }, []);

    return showLoginSwal;
}

export async function refreshAccessTokenIfNeeded() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token) {
        const v = jwtDecode(token);

        if (v.exp) {
            const SECONDS = 1000;
            const MINUTES = 60 * SECONDS;
            const expiration = new Date(v.exp * SECONDS).valueOf();
            const now = new Date().valueOf();

            const is_expired = now - expiration > 0;

            const expires_soon = now - expiration < 2 * MINUTES;

            if (is_expired || expires_soon) {
                const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);

                if (refresh_token) {
                    const reloadedData = await POST<LoginResponse>("/auth/reload", { refresh_token });

                    console.log({ reloadedData });

                    const { access_token } = reloadedData;

                    if (access_token) localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
                }
            }
        }
    }
}
