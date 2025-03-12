import { api } from "~/app/api/api";
import { parseCookies } from "nookies";

export const apiService = {
    async get<T = any>(url: string, headers: Record<string, string> = {}): Promise<T> {
        return this.request<T>("GET", url, null, headers);
    },

    async post<T = any>(url: string, body: any, headers: any): Promise<T> {
        return this.request<T>("POST", url, body, headers);
    },

    async put<T = any>(url: string, body: any, headers: Record<string, string> = {}): Promise<T> {
        return this.request<T>("PUT", url, body, headers);
    },

    async delete<T = any>(url: string, headers: Record<string, string> = {}): Promise<T> {
        return this.request<T>("DELETE", url, null, headers);
    },

    async request<T = any>(
        method: "GET" | "POST" | "PUT" | "DELETE",
        url: string,
        body: any = null,
        headers: Record<string, string> = {},
    ): Promise<T> {
        const cookies = parseCookies();
        const authToken = cookies.auth_token;

        const requestHeaders: Record<string, string> = {
            ...headers,
        };

        if (authToken) {
            requestHeaders.Authorization = `Token ${authToken}`;
        }

        const options: RequestInit = {
            method,
            headers: requestHeaders,
        };

        // Обработка тела запроса
        if (body) {
            if (body instanceof FormData) {
                delete requestHeaders["Content-Type"];
                options.body = body;
            } else {
                requestHeaders["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }

        try {
            const response = await fetch(`${api}/${url}`, options);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errorText}`);
            }

            return response.json();
        } catch (error: any) {
            console.error(`Error during API Request [${method}] ${url}:`, error.message);
            throw error;
        }
    },
};
