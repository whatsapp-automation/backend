import { Chat, Contact, DownloadMediaResult, ListChatsParams, ListMessagesParams, Message, SendMessageResult } from "./types";
import mcpClient from './mcp-bridge';

export async function searchContacts(query: string = ''): Promise<Contact[]> {
    try {
        console.log(`Calling MCP tool search_contacts...`);
        const contacts = await mcpClient.searchContacts(query);
        console.log("Data from the MCP server tool call:", contacts);
        return contacts;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function listMessages(params: ListMessagesParams = {}): Promise<Message[]> {
    try {
        console.log(`Calling MCP tool list_messages...`);
        const messages = await mcpClient.listMessages(params);
        console.log("Data from the MCP server tool call:", messages);
        return messages;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function listChats(params: ListChatsParams = {}): Promise<Chat[]> {
    try {
        console.log(`Calling MCP tool list_chats...`);
        const chats = await mcpClient.listChats(params);
        console.log("Data from the MCP server tool call:", chats);
        return chats;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function getChat(chat_jid: string, include_last_message: boolean = true): Promise<Chat> {
    try {
        console.log(`Calling MCP tool get_chat...`);
        const chat = await mcpClient.callTool<Chat>('get_chat', { chat_jid, include_last_message });
        return chat;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}
  
export async function getDirectChatByContact(sender_phone_number: string): Promise<Chat> {
    try {
        console.log(`Calling MCP tool get_direct_chat_by_contact...`);
        const chat = await mcpClient.callTool<Chat>('get_direct_chat_by_contact', { sender_phone_number });
        return chat;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function getContactChats(jid: string, limit: number = 20, page: number = 0): Promise<Chat[]> {
    try {
        console.log(`Calling MCP tool get_contact_chats...`);
        const chats = await mcpClient.callTool<Chat[]>('get_contact_chats', { jid, limit, page });
        return chats;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function getLastInteraction(jid: string): Promise<Message> {
    try {
        console.log(`Calling MCP tool get_last_interaction...`);
        const message = await mcpClient.callTool<Message>('get_last_interaction', { jid });
        return message;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function getMessageContext(
    message_id: string, 
    before: number = 5, 
    after: number = 5
): Promise<{
    target: Message;
    before: Message[];
    after: Message[];
}> {
    try {
        console.log(`Calling MCP tool get_message_context...`);
        const context = await mcpClient.callTool<{
            target: Message;
            before: Message[];
            after: Message[];
        }>('get_message_context', { message_id, before, after });
        return context;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function sendMessage(recipient: string, message: string): Promise<SendMessageResult> {
    try {
        console.log(`Calling MCP tool send_message...`);
        const result = await mcpClient.callTool<SendMessageResult>('send_message', { recipient, message });
        return result;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function sendFile(recipient: string, media_path: string): Promise<SendMessageResult> {
    try {
        console.log(`Calling MCP tool send_file...`);
        const result = await mcpClient.callTool<SendMessageResult>('send_file', { recipient, media_path });
        return result;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function sendAudioMessage(recipient: string, media_path: string): Promise<SendMessageResult> {
    try {
        console.log(`Calling MCP tool send_audio_message...`);
        const result = await mcpClient.callTool<SendMessageResult>('send_audio_message', { recipient, media_path });
        return result;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function downloadMedia(message_id: string, chat_jid: string): Promise<DownloadMediaResult> {
    try {
        console.log(`Calling MCP tool download_media...`);
        const result = await mcpClient.callTool<DownloadMediaResult>('download_media', { message_id, chat_jid });
        return result;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}
    

