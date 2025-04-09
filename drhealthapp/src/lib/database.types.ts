// lib/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string };
        Insert: { email: string };
        Update: { email?: string };
      };
      // Add other tables as needed
    };
  };
};
