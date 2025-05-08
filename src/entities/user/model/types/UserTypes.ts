export interface UserTypes {
    id: number;
    username: string;
    email: string;
    token: string;
    gender_choices: "мужчина" | "женщина" | null;
    avatar_img: string | null;
    background_img: string | null;
    img_frame: string | null;
    bookmarks: number[];
    last_join: string | null;
    is_writer: boolean | null;
    phone: string | null;
}
