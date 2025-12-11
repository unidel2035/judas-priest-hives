import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.authToken = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isReconnecting = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return;
    }

    this.authToken = token;

    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
      timeout: 20000
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
      this.isReconnecting = false;

      if (this.authToken) {
        this.socket.emit('authenticate', this.authToken);
      }

      // Notify listeners of connection recovery
      const callbacks = this.listeners.get('connection_restored') || [];
      callbacks.forEach(callback => callback());
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);

      // Notify listeners
      const callbacks = this.listeners.get('connection_lost') || [];
      callbacks.forEach(callback => callback(reason));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        const callbacks = this.listeners.get('connection_failed') || [];
        callbacks.forEach(callback => callback(error));
      } else {
        const callbacks = this.listeners.get('reconnecting') || [];
        callbacks.forEach(callback => callback(this.reconnectAttempts, this.maxReconnectAttempts));
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnection attempt', attemptNumber);
      this.isReconnecting = true;

      const callbacks = this.listeners.get('reconnecting') || [];
      callbacks.forEach(callback => callback(attemptNumber, this.maxReconnectAttempts));
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Reconnection failed after max attempts');
      const callbacks = this.listeners.get('connection_failed') || [];
      callbacks.forEach(callback => callback(new Error('Max reconnection attempts reached')));
    });

    // Forward all events to registered listeners
    this.socket.onAny((event, ...args) => {
      const callbacks = this.listeners.get(event) || [];
      callbacks.forEach(callback => callback(...args));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
    this.authToken = null;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getReconnectionStatus() {
    return {
      isReconnecting: this.isReconnecting,
      attempts: this.reconnectAttempts,
      maxAttempts: this.maxReconnectAttempts
    };
  }

  manualReconnect() {
    if (this.socket && !this.socket.connected) {
      console.log('Manual reconnection triggered');
      this.socket.connect();
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);
    if (index > -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Game-specific methods
  findMatch() {
    this.emit('find_match');
  }

  cancelSearch() {
    this.emit('cancel_search');
  }

  drawCard() {
    this.emit('draw_card');
  }

  playSideCard(cardIndex, modifier) {
    this.emit('play_side_card', { cardIndex, modifier });
  }

  stand() {
    this.emit('stand');
  }

  getState() {
    this.emit('get_state');
  }

  getStats() {
    this.emit('get_stats');
  }

  getLeaderboard() {
    this.emit('get_leaderboard');
  }
}

export default new SocketService();
