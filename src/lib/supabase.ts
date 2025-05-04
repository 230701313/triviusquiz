
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { QuizResult, Difficulty } from '../types';

// Use the direct Supabase URL and anonymous key instead of environment variables
const supabaseUrl = "https://rceryroeczzetpbhmnaj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJjZXJ5cm9lY3p6ZXRwYmhtbmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTY3NDksImV4cCI6MjA2MDk5Mjc0OX0.qNluc2P0UCUK3a3hhqkzuYui_a_vZtBwf4FZIweY1Q8";

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

export async function getSampleResultsByDifficulty(difficulty: Difficulty, limit: number = 10) {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('difficulty', difficulty)
    .limit(limit);
  
  return { data, error };
}
