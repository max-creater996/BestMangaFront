interface Tag {
    id: string | number;
    name: string;
}

export interface MangaFormData {
    mangaName: string;
    mangaTitle: string;
    mangaImg: File | null;
    mangaStatus: string;
    translationStatus: string;
    mangaType: string;
    note: string;
    country: number;
    tags: string[];
}

export interface UserMangaState {
    data: any[];
    mangaForm: {
        formData: MangaFormData;
        tagsChoices: {
            id: string | number;
            name: string;
        }[];
        imagePreview: string;
        imageError: string;
        fieldErrors: Record<string, string>;
    };
    loading: boolean;
    error: string | null;
    createMangaError: string | null;
    createMangaLoading: boolean;
}
