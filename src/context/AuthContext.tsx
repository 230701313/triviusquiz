
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser, getSession, authStateChange } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isTeacher: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isTeacher: false,
  isStudent: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: sessionData } = await getSession();
        
        if (sessionData.session) {
          const { data: userData } = await getCurrentUser();
          
          if (userData.user) {
            const { role, name } = userData.user.user_metadata;
            
            setUser({
              id: userData.user.id,
              email: userData.user.email!,
              name: name,
              role: role,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to get user session',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = authStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session?.user) {
          const { role, name } = session.user.user_metadata;
          
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: name,
            role: role,
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [toast]);

  const value = {
    user,
    loading,
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
