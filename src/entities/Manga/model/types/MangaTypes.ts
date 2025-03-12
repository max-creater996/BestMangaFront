interface MangaTypes {
    id: number;
    tags: string[];
    writer_user_id: string;
    total_likes: number;
    total_dislikes: number;
    liked: boolean;
    disliked: boolean;
    last_update: string;
    date_join: string;
    slug: string;
    manga_name: string;
    manga_title: string;
    manga_type:string;
    manga_img: string;
    manga_status: string;
    translation_status: string;
    note: string;
    country: number;
    chapters:ChapterTypes;
    likes: any[]; // Массив лайков (тип зависит от реализации)
    dislikes: any[]; // Массив дизлайков (тип зависит от реализации)
}


