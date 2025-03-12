import { defineStore } from "pinia";
import UserTypes from "../types/UserTypes";
import {api} from "~/app/api/api";
import {setCookie} from "nookies";
import {apiService} from "~/app/services/services";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null as UserTypes | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user?.token,
        isWriter: (state) => state.user?.writer ?? false,
        userName: (state) => state.user?.name || "Гость",
    },

    actions: {
        async GetUser() {
            try {
                this.user = await apiService.get("users/me");
            } catch (error) {
                console.error("Ошибка токена:", error);
            }
        },

        async registerUser(email: string, username: string, password: string, re_password: string) {
            try {
                const response = await fetch(`${api}/djoser/users/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        username,
                        re_password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.username[0]) {
                        throw new Error("Уже есть пользыватель с данным именем")
                    }
                    else {
                        throw new Error(data || "Ошибка при регистрации");
                    }
                }

                return data;
            } catch (error) {
                console.error("Ошибка регистрации:", error);
                throw error;
            }
        }
        ,

        async ActivateUser(uid: string, token: string) {
            try {
                const response = await fetch(`${api}/djoser/users/activation/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        uid:uid,
                        token:token,
                    }),
                });
                const data = await response.json();
                console.log(!response.ok && (response.status !== 403 || data.detail !== "Stale token for given user."))
                if (!response.ok && (response.status !== 403 || data.detail !== "Stale token for given user.")) {
                    throw new Error("Ошибка при активаций аккаунта");
                }

                return await data;
            } catch (error) {
                console.error("Ошибка регистрации:", error);
                throw error;
            }
        },

        async LoginUser(username: string, password: string) {
            try {
                const response = await fetch(`${api}/auth/token/login/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password: password,
                        username: username,
                    }),
                });

                if (!response.ok && response.status !== 403) {
                    throw new Error("Ошибка при авторизации");
                }

                const data = await response.json();

                if (data.auth_token) {
                    setCookie(null, "auth_token", data.auth_token, {
                        maxAge: 60 * 60 * 24 * 60, // 7 дней
                        path: '/',
                        secure: true, // Для HTTPS
                        httpOnly: false, // Если надо читать на клиенте
                    });
                }

                return data;
            } catch (error) {
                console.error("Ошибка авторизации:", error);
                throw error;
            }
        },

        setUser(userData: UserTypes) {
            this.user = userData;
        },

        logout() {
            this.user = null;
        },
    },
});
