export interface UserChapterState {
    chapters: any[] | null;
    chapter: any | null;
    loading: boolean;
    error: string | null;
    isEditMode: boolean;
    volumeChoices: Array<{
        id: number;
        name: string;
    }>;
    chapterForm: {
        chapter_title: string;
        chapter_number: string;
        pages: any[];
        volume: number;
        release: boolean;
    };
    formErrors: {
        chapter_title: string;
        chapter_number: string;
        pages: any[];
        volume: string;
        release: string;
    };
}
