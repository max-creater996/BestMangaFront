import { defineStore } from "pinia";
import { apiService } from "~/app/services/services";

interface ChapterState {
    chapters: any;
    chapter: ChapterTypes;
    loading: boolean;
    error: string | null;
}

export const useChapterStore = defineStore("chapter", {
    state: (): ChapterState => ({
        chapters: null,
        chapter: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchChapter(slug: string, chapter_number: string) {
            this.loading = true;
            this.error = null;
            try {
                this.chapter = await apiService.get(`api/manga/${slug}/${chapter_number}`);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async fetchChapters(slug: string) {
            this.loading = true;
            this.error = null;
            try {
                this.chapters = await apiService.get(`api/manga/${slug}/chapters/`);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async toggleLike(id: string) {
            this.loading = true;
            this.error = null;
            try {
                await apiService.post(`api/manga/chapters/${id}/like/`, null);
                if (this.chapter && this.chapter.id === id) {
                    this.chapter.is_liked = !this.chapter.is_liked;
                    // If liked, increment the count, otherwise decrement
                    this.chapter.total_likes = this.chapter.is_liked
                        ? this.chapter.total_likes + 1
                        : Math.max(0, this.chapter.total_likes - 1);
                }
                return 0;
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
                return false;
            } finally {
                this.loading = false;
            }
        }
    },
});
