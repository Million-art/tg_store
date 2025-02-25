import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    // allowedHosts: ['.loca.lt'], // Allow localtunnels subdomains
    //  allowedHosts: ['https://9d50-185-183-33-221.ngrok-free.app'], // Allow localtunnels subdomains
     allowedHosts: [
      "d2bf-185-183-33-220.ngrok-free.app",  
    ],
    
  },
});
