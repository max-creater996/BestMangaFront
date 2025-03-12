interface UserTypes {
    id: number;
    name: string;
    email: string;
    token: string;
    writer:boolean
    avatar?: string; // Ссылка на аватар (опционально)
    createdAt?: string; // Дата создания аккаунта (опционально)
}

