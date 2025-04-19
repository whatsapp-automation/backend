export interface Contact {
    jid: string;
    name: string;
    phone_number: string;
}
  
export interface Message {
    id: string;
    chat_jid: string;
    fromMe: boolean;
    sender: string;
    timestamp: string;
    content: string;
    media_type?: string;
    media_url?: string;
}

export interface Chat {
    jid: string;
    name: string;
    is_group: boolean;
    last_message?: Message;
}

export interface MCPResponse<T> {
    result: T;
}

export interface ListMessagesParams {
    after?: string;
    before?: string;
    sender_phone_number?: string;
    chat_jid?: string;
    query?: string;
    limit?: number;
    page?: number;
    include_context?: boolean;
    context_before?: number;
    context_after?: number;
}

export interface ListChatsParams {
    query?: string;
    limit?: number;
    page?: number;
    include_last_message?: boolean;
    sort_by?: 'last_active' | 'name';
}

  // 9. Send a message
export interface SendMessageResult {
    success: boolean;
    message: string;
}

// 12. Download media
export interface DownloadMediaResult {
    success: boolean;
    message: string;
    file_path?: string;
}