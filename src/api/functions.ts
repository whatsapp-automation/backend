import { Chat, Contact, DownloadMediaResult, ListChatsParams, ListMessagesParams, Message, SendMessageResult } from "./types";
import axios from 'axios';

// Use our local proxy server instead of trying to connect directly to MCP
const PROXY_URL = "http://localhost:3003/proxy-mcp";

export async function callMcpTool<T>(toolName: string, parameters: any): Promise<T> {
    try {
        console.log(`Calling MCP tool ${toolName} via proxy...`);
        const response = await axios.post(PROXY_URL, {
            toolInput: {
                toolName,
                parameters
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log("Data from the MCP server tool call:", response.data);
        return response.data.result;
    } catch (error: any) {
        console.error("Error calling MCP tool:", error.message);
        throw error;
    }
}

export async function searchContacts(query : string = '') : Promise<Contact[]> {
    return callMcpTool<Contact[]>("search_contacts", {query});
}

export async function listMessages(params : ListMessagesParams = {}) : Promise<Message[]> {
    return callMcpTool<Message[]>("list_messages", params);
}

export async function listChats(params : ListChatsParams = {}) : Promise<Chat[]> {
    return callMcpTool<Chat[]>("list_chats", params);
}

export async function getChat(chat_jid: string, include_last_message: boolean = true): Promise<Chat> {
    return callMcpTool<Chat>('get_chat', { chat_jid, include_last_message });
  }
  
export async function getDirectChatByContact(sender_phone_number: string): Promise<Chat> {
    return callMcpTool<Chat>('get_direct_chat_by_contact', { sender_phone_number });
}

export async function getContactChats(jid: string, limit: number = 20, page: number = 0): Promise<Chat[]> {
    return callMcpTool<Chat[]>('get_contact_chats', { jid, limit, page });
}

export async function getLastInteraction(jid: string): Promise<Message> {
    return callMcpTool<Message>('get_last_interaction', { jid });
}

export async function getMessageContext(message_id: string, before: number = 5, after: number = 5): Promise<{
    target: Message;
    before: Message[];
    after: Message[];
    }> {
    return callMcpTool<{
        target: Message;
        before: Message[];
        after: Message[];
    }>('get_message_context', { message_id, before, after });
}

export async function sendMessage(recipient: string, message: string): Promise<SendMessageResult> {
    return callMcpTool<SendMessageResult>('send_message', { recipient, message });
}


export async function sendFile(recipient: string, media_path: string): Promise<SendMessageResult> {
    return callMcpTool<SendMessageResult>('send_file', { recipient, media_path });
}


export async function sendAudioMessage(recipient: string, media_path: string): Promise<SendMessageResult> {
    return callMcpTool<SendMessageResult>('send_audio_message', { recipient, media_path });
}


export async function downloadMedia(message_id: string, chat_jid: string): Promise<DownloadMediaResult> {
    return callMcpTool<DownloadMediaResult>('download_media', { message_id, chat_jid });
}
    

