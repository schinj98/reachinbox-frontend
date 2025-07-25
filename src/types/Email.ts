export interface Email {
    id: number;
    subject: string;
    description: string;     // full HTML
    preview: string;         // plain text preview
    date: string;
    from: string;
    category: string;
    profilePhoto?: string;
  }
  