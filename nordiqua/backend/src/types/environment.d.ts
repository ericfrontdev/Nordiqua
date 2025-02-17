declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      JWT_SECRET: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};