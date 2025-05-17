import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Record<string, Function[]> = {};
  
  connect() {
    if (this.socket) {
      return;
    }
    
    // In a real implementation, this would connect to a real server
    // For development, we'll mock the socket behavior
    
    // This is a mock implementation that doesn't actually connect to a server
    // but simulates the socket.io interface for development
    this.socket = {
      connected: true,
      
      on: (event: string, callback: Function) => {
        if (!this.listeners[event]) {
          this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
        return this;
      },
      
      off: (event: string, callback?: Function) => {
        if (callback && this.listeners[event]) {
          this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        } else if (!callback) {
          delete this.listeners[event];
        }
        return this;
      },
      
      emit: (event: string, ...args: any[]) => {
        // In a real implementation, this would send data to the server
        console.log(`[Socket Mock] Emitting event: ${event}`, args);
        return true;
      },
      
      disconnect: () => {
        console.log('[Socket Mock] Disconnected');
        this.socket = null;
      }
    } as unknown as Socket;
    
    console.log('[Socket Mock] Connected');
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  
  emit(event: string, data?: any) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    
    this.socket.emit(event, data);
  }
  
  on(event: string, callback: Function) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    
    this.socket.on(event, callback as any);
  }
  
  off(event: string, callback?: Function) {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    
    this.socket.off(event, callback as any);
  }
  
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
