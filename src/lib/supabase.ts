
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// These environment variables are set when connected through Lovable
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string, name: string, role: 'student' | 'teacher') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      }
    }
  });
  
  if (data.user && !error) {
    // Insert into the appropriate table for role-specific data
    await supabase.from(role === 'teacher' ? 'teachers' : 'students')
      .insert({
        id: data.user.id,
        name: name,
        email: email,
      });
  }

  return { data, error };
}

export async function signOut() {
  return supabase.auth.signOut();
}

export function getCurrentUser() {
  return supabase.auth.getUser();
}

export function getSession() {
  return supabase.auth.getSession();
}

export const authStateChange = (callback: (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED', session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

export async function saveQuizResult(result: Omit<QuizResult, 'id'>) {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      student_id: result.studentId,
      student_name: result.studentName,
      difficulty: result.difficulty,
      score: result.score,
      total_questions: result.totalQuestions,
      date: result.date
    })
    .select();
  
  return { data, error };
}

export async function getStudentResults(studentId: string) {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('student_id', studentId)
    .order('date', { ascending: false });
  
  return { data, error };
}

export async function getAllResults() {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .order('date', { ascending: false });
  
  return { data, error };
}
