import type { MangaFormData } from "~/entities/ProfileManga/model/types/UserMangaState";


export const createSlug = (mangaName: string): string => {
    return mangaName
        .toLowerCase()
        // Транслитерация русских букв
        .replace(/[а-яё]/g, char => {
            const translitMap: { [key: string]: string } = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
                'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
                'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
                'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
                'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
                'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
                'э': 'e', 'ю': 'yu', 'я': 'ya'
            };
            return translitMap[char] || char;
        })
        // Заменяем все символы кроме букв и цифр на дефис
        .replace(/[^a-z0-9]+/g, '-')
        // Убираем дефисы в начале и конце
        .replace(/^-+|-+$/g, '');
};

export const createFormData = (formData: MangaFormData): FormData => {
    const formDataToSend = new FormData();
    
    formDataToSend.append('manga_name', formData.mangaName);
    formDataToSend.append('manga_title', formData.mangaTitle);
    formDataToSend.append('slug', createSlug(formData.mangaName));
    formDataToSend.append('manga_status', formData.mangaStatus);
    formDataToSend.append('translation_status', formData.translationStatus);
    formDataToSend.append('manga_type', formData.mangaType);
    formDataToSend.append('note', formData.note);
    formDataToSend.append('country', formData.country.toString());
    
    if (formData.mangaImg) {
        formDataToSend.append('manga_img', formData.mangaImg);
    }
    
    formData.tags.forEach(tag => {
        formDataToSend.append('tags', tag);
    });

    return formDataToSend;
};

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
