interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_EMAIL1_USER: string;
    readonly VITE_EMAIL1_PASS: string;
    readonly VITE_EMAIL2_USER: string;
    readonly VITE_EMAIL2_PASS: string;
    // add more if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  