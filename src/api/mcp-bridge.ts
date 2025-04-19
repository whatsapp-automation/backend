import { spawn } from 'child_process';
import * as path from 'path';
import { Chat, Contact, ListChatsParams, ListMessagesParams, Message, SendMessageResult } from './types';

// Path to the MCP server script
const MCP_SCRIPT_PATH = path.resolve('/app/whatsapp-mcp/whatsapp-mcp-server/main.py');
// Use the Python executable from our virtual environment
const PYTHON_PATH = '/app/venv/bin/python3';

class McpClient {
  private process: any;
  private isReady = false;
  private requestQueue: { resolve: (value: any) => void, reject: (reason: any) => void, request: any }[] = [];
  private responseCallbacks: Map<string, { resolve: (value: any) => void, reject: (reason: any) => void }> = new Map();
  private requestId = 1;

  constructor() {
    this.startMcpProcess();
  }

  private startMcpProcess() {
    console.log('Starting MCP process:', MCP_SCRIPT_PATH);
    
    this.process = spawn(PYTHON_PATH, [MCP_SCRIPT_PATH], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    this.process.stdout.on('data', (data: Buffer) => {
      const lines = data.toString().trim().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          try {
            this.handleResponse(JSON.parse(line));
          } catch (err) {
            console.error('Error parsing MCP response:', line, err);
          }
        }
      }
    });

    this.process.stderr.on('data', (data: Buffer) => {
      console.log('MCP stderr:', data.toString());
    });

    this.process.on('close', (code: number) => {
      console.log(`MCP process exited with code ${code}`);
      this.isReady = false;
      
      // Restart if process exits unexpectedly
      if (code !== 0) {
        console.log('Restarting MCP process...');
        setTimeout(() => this.startMcpProcess(), 1000);
      }
    });

    // Mark as ready after a short delay to allow process to initialize
    setTimeout(() => {
      this.isReady = true;
      this.processQueue();
    }, 1000);
  }

  private handleResponse(response: any) {
    const id = response.id;
    const callback = this.responseCallbacks.get(id);
    
    if (callback) {
      this.responseCallbacks.delete(id);
      
      if (response.error) {
        callback.reject(new Error(response.error));
      } else {
        callback.resolve(response.result);
      }
    } else {
      console.warn('Received response for unknown request:', response);
    }
  }

  private processQueue() {
    if (!this.isReady) return;
    
    while (this.requestQueue.length > 0) {
      const { resolve, reject, request } = this.requestQueue.shift()!;
      this.sendRequest(request)
        .then(resolve)
        .catch(reject);
    }
  }

  private sendRequest(request: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = String(this.requestId++);
      request.id = id;
      
      this.responseCallbacks.set(id, { resolve, reject });
      
      const requestStr = JSON.stringify(request) + '\n';
      try {
        this.process.stdin.write(requestStr);
      } catch (err) {
        this.responseCallbacks.delete(id);
        reject(err);
      }
    });
  }

  public async callTool<T>(toolName: string, parameters: any): Promise<T> {
    const request = {
      type: "function_call",
      function: toolName,
      params: parameters
    };
    
    if (!this.isReady) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ resolve, reject, request });
      });
    }
    
    return this.sendRequest(request);
  }

  // Implement specific tool methods
  public async searchContacts(query: string = ''): Promise<Contact[]> {
    return this.callTool<Contact[]>("search_contacts", { query });
  }

  public async listMessages(params: ListMessagesParams = {}): Promise<Message[]> {
    return this.callTool<Message[]>("list_messages", params);
  }

  public async listChats(params: ListChatsParams = {}): Promise<Chat[]> {
    return this.callTool<Chat[]>("list_chats", params);
  }

  public async sendMessage(recipient: string, message: string): Promise<SendMessageResult> {
    return this.callTool<SendMessageResult>("send_message", { recipient, message });
  }

  // Add other methods for the remaining WhatsApp MCP tools
}

// Create a singleton instance
const mcpClient = new McpClient();
export default mcpClient; 