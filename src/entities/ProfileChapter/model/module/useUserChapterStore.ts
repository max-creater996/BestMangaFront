import { defineStore } from "pinia";
import type {UserChapterState} from "~/entities/ProfileChapter/model/module/types/UserChapterState";
import {apiService} from "~/app/services/services";
import { computed } from 'vue'

export const useUserChapterStore = defineStore("userChapter", {
    state: (): UserChapterState => ({
        chapters: null,
        chapter: null,
        loading: false,
        error: null,
        volumeChoices: [],
        isEditMode: false,
        chapterForm: {
            chapter_title: '',
            chapter_number: '',
            pages: [],
            volume: 0,
            release: false,
            new_orderliness: false
        },
        formErrors: {
            chapter_title: '',
            chapter_number: '',
            pages: [],
            volume: '',
            release: ''
        }
    }),
    getters: {
        buttonText: (state) => {
            if (state.loading) {
                return state.isEditMode ? 'Сохранение...' : 'Добавление...'
            }
            return state.isEditMode ? 'Сохранить изменения' : 'Добавить главу'
        }
    },
    actions: {
        resetForm() {
            this.chapterForm = {
                chapter_title: '',
                chapter_number: '',
                pages: [],
                volume: 0,
                release: false,
                new_orderliness:false
            }
            this.formErrors = {
                chapter_title: '',
                chapter_number: '',
                pages: [],
                volume: '',
                release: ''
            }
            this.isEditMode = false
        },

        setChapters(chapters: any[]) {
            this.chapters = chapters;
        },

        setChapter(chapter: any) {
            this.chapter = chapter;
            if (chapter) {
                // Find the matching volume by volume_number
                const matchingVolume = this.volumeChoices.find(
                    v => v.name === `Том ${chapter.volume}`
                );

                this.chapterForm = {
                    chapter_title: chapter.chapter_title,
                    chapter_number: String(chapter.chapter_number),
                    volume: matchingVolume ? matchingVolume.id : 0, // Use the volume ID instead of volume number
                    pages: chapter.pages.map((page: any) => ({
                        id: page.id,
                        preview: page.image,
                        page_number: page.page_number,
                        status: "initial"
                    })),
                    release: chapter.release || false,
                    new_orderliness: false
                }
            }
        },

        async createOrUpdateChapter(slug: string, chapter_number: string = '') {
            this.loading = true;
            this.error = null;
            try {
                const endpoint = this.isEditMode
                    ? `api/manga/${slug}/chapter_update/${chapter_number}`
                    : `api/manga/${slug}/chapter_add/`

                const response = this.isEditMode
                    ? await apiService.put(endpoint, {
                        chapter_title: this.chapterForm.chapter_title,
                        chapter_number: Number(this.chapterForm.chapter_number),
                        volume: Number(this.chapterForm.volume),
                        release: this.chapterForm.release
                    }, {})
                    : await apiService.post(endpoint, {
                        chapter_title: this.chapterForm.chapter_title,
                        chapter_number: Number(this.chapterForm.chapter_number),
                        volume: Number(this.chapterForm.volume)
                    }, {});

                return response;
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchChapter(slug: string, chapter_number: string) {
            this.loading = true;
            this.error = null;
            try {
                const chapter = await apiService.get(`api/manga/${slug}/${chapter_number}`);
                this.setChapter(chapter);
                this.isEditMode = true;
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
                this.chapters = await apiService.get(`api/manga_profile/${slug}/chapters/`);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async fetchVolumeChoices(slug: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiService.get(`/api/manga/${slug}/volumes/`);
                this.volumeChoices = response.map((volume: any) => ({
                    id: Number(volume.id),
                    name: `Том ${volume.volume_number}`
                }));
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async uploadChapterPage( file: File, pageNumber: number, maxRetries = 3) {
            let attempts = 0;

            const uploadWithRetry = async () => {
                try {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('page_number', String(pageNumber));

                    const response = await apiService.post(
                        `/api/manga/chapter/${this.chapter.id}/add_page`,
                        formData,{}
                    );
                    return response;
                } catch (error) {
                    attempts++;
                    if (attempts >= maxRetries) {
                        throw error;
                    }
                    // Экспоненциальная задержка перед повторной попыткой
                    const delay = Math.min(1000 * Math.pow(2, attempts), 10000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return uploadWithRetry();
                }
            };

            try {
                this.loading = true;
                return await uploadWithRetry();
            } catch (error) {
                console.error(`Failed to upload page ${pageNumber} after ${maxRetries} attempts:`, error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updatePageOrder( pageId: number, newPageNumber: number, file?: File) {
            try {
                this.loading = true;
                const formData = new FormData();
                formData.append('page_number', String(newPageNumber));
                if (file) {
                    formData.append('image', file);
                }

                const response = await apiService.put(
                    `/api/manga/chapter/${this.chapter.id}/pages/${pageId}/`,
                    formData
                );
                return response;
            } catch (error) {
                console.error('Error updating page:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deletePage(pageId: number) {
            try {
                this.loading = true;
                await apiService.delete(`/api/manga/chapter/${this.chapter.id}/pages/${pageId}/`);
            } catch (error) {
                console.error('Error deleting page:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteChapter(slug: string, chapter_number: string) {
            this.loading = true;
            this.error = null;
            try {
                await apiService.delete(`api/manga/${slug}/chapter_delete/${chapter_number}`);
                if (this.chapter && this.chapter.chapter_number === chapter_number) {
                    this.chapter = null;
                }
                await this.fetchChapters(slug);
                return 0;
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
                return false;
            } finally {
                this.loading = false;
            }
        },
        async updatePagesOrderBulk(chapterId: string, data: Array<{id: number, page_number: number}>) {
            try {
                this.loading = true;
                const response = await apiService.post(
                    `/api/manga/chapter/${chapterId}/pages`,
                    data,
                    {}
                );
                return response;
            } catch (error) {
                console.error('Error updating pages order:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    },
});
