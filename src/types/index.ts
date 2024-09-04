export interface Journal {
    _id: string;
    updated_at: string;
    user_id: string;
    content: string;
    is_note: boolean;
    created_at: string;
}
