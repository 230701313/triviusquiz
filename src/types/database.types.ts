
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      quiz_results: {
        Row: {
          id: string
          student_id: string
          student_name: string
          difficulty: string
          score: number
          total_questions: number
          date: string
        }
        Insert: {
          id?: string
          student_id: string
          student_name: string
          difficulty: string
          score: number
          total_questions: number
          date: string
        }
        Update: {
          id?: string
          student_id?: string
          student_name?: string
          difficulty?: string
          score?: number
          total_questions?: number
          date?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
