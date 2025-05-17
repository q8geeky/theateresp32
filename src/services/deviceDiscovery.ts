import { Device } from '../types';
import socketService from './socketService';

// Mock device data for development
const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Stage Left Lights',
    ip: '192.168.1.101',
    mac: 'AA:BB:CC:DD:EE:01',
    online: true,
    lastSeen: new Date().toISOString(),
    pins: {
      'D1': { type: 'LED', label: 'Red Spot' },
      'D2': { type: 'LED', label: 'Blue Spot' },
      'D3': { type: 'RGB', label: 'RGB Strip' },
      'D5': { type: 'Relay', label: 'Fog Machine' }
    }
  },
  {
    id: 'device-2',
    name: 'Stage Right Controls',
    ip: '192.168.1.102',
    mac: 'AA:BB:CC:DD:EE:02',
    online: true,
    lastSeen: new Date().toISOString(),
    pins: {
      'D1': { type: 'Servo', label: 'Curtain Motor' },
      'D2': { type: 'LED', label: 'Exit Sign' },
      'D4': { type: 'Sensor', label: 'Motion Detector' }
    }
  },
  {
    id: 'device-3',
    name: 'Backstage Unit',
    ip: '192.168.1.103',
    mac: 'AA:BB:CC:DD:EE:03',
    online: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    pins: {
      'D1': { type: 'Relay', label: 'Main Power' },
      'D3': { type: 'LED', label: 'Status Light' }
    }
  }
];

type DeviceDiscoveryCallback = (device: Device) => void;

class DeviceDiscovery {
  private callbacks: DeviceDiscoveryCallback[] = [];
  private discoveryInterval: NodeJS.Timeout | null = null;
  private isDiscovering = false;
  
  constructor() {
    // Listen for device updates from the socket
    socketService.on('deviceUpdated', (device: Device) => {
      this.notifyCallbacks(device);
    });
  }
  
  startDiscovery() {
    if (this.isDiscovering) {
      return this;
    }
    
    this.isDiscovering = true;
    
    // In a real implementation, this would send UDP broadcast packets
    // or use mDNS to discover ESP32 devices on the local network
    
    // For development, we'll use mock data with a delay to simulate discovery
    setTimeout(() => {
      mockDevices.forEach(device => {
        this.notifyCallbacks(device);
      });
    }, 1000);
    
    // Periodically check for new devices or status changes
    this.discoveryInterval = setInterval(() => {
      // In a real implementation, this would refresh the device statuses
      // For now, we'll just toggle the online status of one device
      const randomIndex = Math.floor(Math.random() * mockDevices.length);
      const updatedDevice = { 
        ...mockDevices[randomIndex],
        online: Math.random() > 0.3, // 70% chance of being online
        lastSeen: new Date().toISOString()
      };
      
      mockDevices[randomIndex] = updatedDevice;
      this.notifyCallbacks(updatedDevice);
    }, 30000); // Every 30 seconds
    
    return this;
  }
  
  stopDiscovery() {
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
    }
    
    this.isDiscovering = false;
    return this;
  }
  
  onDeviceDiscovered(callback: DeviceDiscoveryCallback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
  
  private notifyCallbacks(device: Device) {
    this.callbacks.forEach(callback => {
      callback(device);
    });
  }
  
  // Method to get a specific device by ID
  getDeviceById(id: string): Device | undefined {
    return mockDevices.find(device => device.id === id);
  }
  
  // Method to get all discovered devices
  getAllDevices(): Device[] {
    return [...mockDevices];
  }
}

// Export a singleton instance
const deviceDiscovery = new DeviceDiscovery();
export default deviceDiscovery;
