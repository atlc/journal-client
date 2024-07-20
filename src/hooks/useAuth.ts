import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { POST } from "../services/api";

export const TOKEN_KEY = "access_token";

interface LoginResponse {
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
                if (access_token) localStorage.setItem(TOKEN_KEY, access_token);
                if (refresh_token) localStorage.setItem("refresh_token", refresh_token);
            });
        }
    });
};

export default async function useAuth() {
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) showLoginSwal();
    }, []);

    return showLoginSwal;
}
