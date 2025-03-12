import { defineStore } from "pinia";
import { apiService } from "~/app/services/services";

interface MangaState {
    data: any[];
    manga: MangaTypes;
    loading: boolean;
    error: string | null;
}

export const useMangaStore = defineStore("manga", {
    state: (): MangaState => ({
        data: [],
        manga: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchMangas() {
            this.loading = true;
            this.error = null;
            try {
                this.data = await apiService.get("api");
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async fetchManga(slug: string) {
            this.loading = true;
            this.error = null;
            try {
                this.manga = await apiService.get(`api/manga/${slug}`);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async addLike(id: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiService.post(`api/${id}/like/`, 0);
                console.log("B", response.status);
                return !response.status === "200";
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async addDisLike(id: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiService.post(`api/${id}/dislike/`, 0);
                return !response.status === "200";
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },
    },
});
