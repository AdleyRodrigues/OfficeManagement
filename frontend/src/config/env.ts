export const config = {
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 60000,
        serverTestTimeout: Number(import.meta.env.VITE_SERVER_TEST_TIMEOUT) || 60000,
        endpoints: {
            oficios: '/api/oficios',
            serverTest: '/api/test'
        }
    }
} as const; 