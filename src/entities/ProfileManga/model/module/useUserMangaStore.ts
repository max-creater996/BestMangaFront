import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import {apiService} from "~/app/services/services";
import type {UserMangaState, MangaFormData} from "~/entities/ProfileManga/model/types/UserMangaState";
import { createFormData } from "~/features/MangaForm/model/functions/createMangaFormData";
import { validateFormData } from "~/features/MangaForm/model/functions/validateMangaForm";


export const useUserMangaStore = defineStore("userManga", {
    state: (): UserMangaState => ({
        data: [],
        mangaForm: {
            formData: {
                mangaName: '',
                mangaTitle: '',
                mangaImg: null,
                mangaStatus: "выпускается",
                translationStatus: "перевод идет",
                mangaType: "манга",
                note: '',
                country: 0,
                tags: []
            },
            tagsChoices: [],
            imagePreview: '',
            imageError: '',
            fieldErrors: {}
        },
        loading: false,
        error: null,
        createMangaError: null,
        createMangaLoading: false,
    }),
    actions: {
        setMangas(mangas: any[]) {
            this.data = mangas;
        },

        updateFormData<K extends keyof MangaFormData>(field: K, value: MangaFormData[K]) {
            this.mangaForm.formData[field] = value;
            // Очищаем ошибку поля при обновлении значения
            if (this.mangaForm.fieldErrors[field]) {
                delete this.mangaForm.fieldErrors[field];
            }
        },

        updateImagePreview(preview: string) {
            this.mangaForm.imagePreview = preview;
        },

        updateImageError(error: string) {
            this.mangaForm.imageError = error;
        },
        handleTagsChange(selectedTags: string | string[]) {
            this.mangaForm.formData.tags = Array.isArray(selectedTags) 
                ? selectedTags.map(tag => String(tag))
                : [String(selectedTags)];
        },

        resetForm() {
            this.mangaForm.formData = {
                mangaName: '',
                mangaTitle: '',
                mangaImg: null,
                mangaStatus: "выпускается",
                translationStatus: "перевод идет",
                mangaType: "манга",
                note: '',
                country: 0,
                tags: []
            };
            this.mangaForm.imagePreview = '';
            this.mangaForm.imageError = '';
            this.mangaForm.fieldErrors = {};
        },

        async createManga() {
            this.createMangaLoading = true;
            this.createMangaError = null;
            this.mangaForm.fieldErrors = {};

            try {
                const validationErrors = validateFormData(this.mangaForm.formData);
                if (validationErrors.length > 0) {
                    this.mangaForm.fieldErrors = validationErrors.reduce((acc, error) => {
                        acc[error.field] = error.message;
                        return acc;
                    }, {} as Record<string, string>);
                    throw new Error('Ошибка валидации формы');
                }

                const formDataToSend = createFormData(this.mangaForm.formData);
                const response = await apiService.post('api/manga/add/', formDataToSend, {});

                this.resetForm();
                return response;
            } catch (error: any) {
                // Обработка ошибок с сервера
                if (error.response?.data) {
                    // Преобразуем ошибки с сервера в формат для отображения
                    const serverErrors = error.response.data;
                    this.mangaForm.fieldErrors = Object.keys(serverErrors).reduce((acc, field) => {
                        // Преобразуем поля с сервера в поля формы
                        const formField = field === 'manga_name' ? 'mangaName' : 
                                        field === 'manga_title' ? 'mangaTitle' : 
                                        field === 'manga_status' ? 'mangaStatus' : 
                                        field === 'translation_status' ? 'translationStatus' : 
                                        field === 'manga_type' ? 'mangaType' : field;
                        
                        acc[formField] = Array.isArray(serverErrors[field]) 
                            ? serverErrors[field][0] 
                            : serverErrors[field];
                        return acc;
                    }, {} as Record<string, string>);
                }
                toast.error(error instanceof Error ? error.message : "Ошибка при создании манги")
                throw error;
            } finally {
                this.createMangaLoading = false;
            }
        },

        async fetchMangaForEdit(slug: string) {
            this.loading = true;
            this.error = null;
            try {
                const mangaData = await apiService.get(`api/manga/profile/${slug}`);
                
                // Преобразуем полученные данные в формат формы
                this.mangaForm.formData = {
                    mangaName: mangaData.manga_name || '',
                    mangaTitle: mangaData.manga_title || '',
                    mangaImg: null,
                    // Используем строковые значения напрямую
                    mangaStatus: mangaData.manga_status || '',
                    translationStatus: mangaData.translation_status || '',
                    mangaType: mangaData.manga_type || '',
                    note: mangaData.note || '',
                    country: mangaData.country || 0,
                    tags: Array.isArray(mangaData.tags) ? mangaData.tags.map(String) : []
                };
                
                // Устанавливаем превью изображения
                if (mangaData.manga_img) {
                    this.mangaForm.imagePreview = mangaData.manga_img;
                }
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Ошибка при загрузке манги";
                toast.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        // Добавляем новый метод для конвертации тегов
        convertTagsToIds(tags: string[]): string[] {
            if (!Array.isArray(tags)) return [];
            
            return tags.map(tagName => {
                const tagChoice = this.mangaForm.tagsChoices.find(
                    choice => choice.name.toLowerCase() === tagName.toLowerCase()
                );
                return tagChoice ? tagChoice.id.toString() : '';
            }).filter(id => id !== '');
        },

        // Вспомогательная функция для преобразования значений
        parseNumericValue(value: any): number {
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
                const parsedValue = parseInt(value, 10);
                return isNaN(parsedValue) ? 0 : parsedValue;
            }
            return 0;
        },

        async updateManga(slug: string) {
            this.createMangaLoading = true;
            this.createMangaError = null;
            this.mangaForm.fieldErrors = {};

            try {
                const validationErrors = validateFormData(this.mangaForm.formData);
                if (validationErrors.length > 0) {
                    this.mangaForm.fieldErrors = validationErrors.reduce((acc, error) => {
                        acc[error.field] = error.message;
                        return acc;
                    }, {} as Record<string, string>);
                    throw new Error('Ошибка валидации формы');
                }

                const formDataToSend = createFormData(this.mangaForm.formData);
                const response = await apiService.put(`api/manga/${slug}/update/`, formDataToSend, {});

                this.resetForm();
                return response;
            } catch (error: any) {
                // Обработка ошибок с сервера
                if (error.response?.data) {
                    const serverErrors = error.response.data;
                    this.mangaForm.fieldErrors = Object.keys(serverErrors).reduce((acc, field) => {
                        const formField = field === 'manga_name' ? 'mangaName' : 
                                        field === 'manga_title' ? 'mangaTitle' : 
                                        field === 'manga_status' ? 'mangaStatus' : 
                                        field === 'translation_status' ? 'translationStatus' : 
                                        field === 'manga_type' ? 'mangaType' : field;
                        
                        acc[formField] = Array.isArray(serverErrors[field]) 
                            ? serverErrors[field][0] 
                            : serverErrors[field];
                        return acc;
                    }, {} as Record<string, string>);
                }
                toast.error(error instanceof Error ? error.message : "Ошибка при обновлении манги");
                throw error;
            } finally {
                this.createMangaLoading = false;
            }
        },

        async fetchUserManga(slug: string) {
            this.loading = true;
            this.error = null;
            try {
                this.data = await apiService.get(`api/user_manga`);
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        async fetchTagsList() {
            this.loading = true;
            this.error = null;
            try {
                const tags = await apiService.get('api/tags_list');
                this.mangaForm.tagsChoices = tags.map((tag: any) => ({
                    id: String(tag.id),
                    name: tag.tags,
                }));
            } catch (error) {
                this.error = error instanceof Error ? error.message : "Unknown error";
            } finally {
                this.loading = false;
            }
        },

        findTagIds(tagNames: string[]): string[] {
            return tagNames.map(tagName => {
                const foundTag = this.mangaForm.tagsChoices.find(
                    choice => choice.name.toLowerCase() === tagName.toLowerCase()
                );
                // Возвращаем ID тега
                return foundTag ? foundTag.id.toString() : '';
            }).filter(id => id !== ''); // Удаляем пустые значения
        }
    },
});
