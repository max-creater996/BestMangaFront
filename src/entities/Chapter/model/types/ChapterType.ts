interface ChapterType {
    id: number;
    manga: MangaTypes;
    date_time: string;
    chapter_title: string;
    chapter_number: number;
    pages: any[];
    is_last_chapter:boolean;
    is_fist_chapter:boolean;
    is_liked: boolean;
    total_likes: number;
    currentPage:number;
}
