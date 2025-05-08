import type { MangaFormData } from "~/entities/ProfileManga/model/types/UserMangaState";

export interface ValidationError {
    field: string;
    message: string;
}

export const validateFormData = (formData: MangaFormData): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!formData.mangaName.trim()) {
        errors.push({
            field: 'mangaName',
            message: 'Название манги обязательно для заполнения'
        });
    }

    if (!formData.mangaTitle.trim()) {
        errors.push({
            field: 'mangaTitle',
            message: 'Заголовок манги обязателен для заполнения'
        });
    }

    if (!formData.mangaStatus) {
        errors.push({
            field: 'mangaStatus',
            message: 'Выберите статус манги'
        });
    }

    if (!formData.translationStatus) {
        errors.push({
            field: 'translationStatus',
            message: 'Выберите статус перевода'
        });
    }

    if (!formData.mangaType) {
        errors.push({
            field: 'mangaType',
            message: 'Выберите тип манги'
        });
    }

    if (!formData.country) {
        errors.push({
            field: 'country',
            message: 'Выберите страну происхождения'
        });
    }

    if (!formData.tags || formData.tags.length === 0) {
        errors.push({
            field: 'tags',
            message: 'Выберите хотя бы один тег'
        });
    }

    return errors;
}; 