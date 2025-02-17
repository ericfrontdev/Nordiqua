import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  initSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  initSession: async () => {
    try {
      set({ loading: true });
      
      // Récupérer la session actuelle
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        await supabase.auth.signOut();
        set({ user: null });
        throw sessionError;
      }
      
      // Si pas de session, déconnecter l'utilisateur
      if (!session?.user) {
        await supabase.auth.signOut();
        set({ user: null, loading: false });
        return;
      }

      try {
        // Récupérer les données de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Erreur lors de la récupération des données utilisateur:', userError);
          // Si l'utilisateur n'existe pas encore, on attend un peu et on réessaie
          if (userError.code === 'PGRST116') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const { data: retryData, error: retryError } = await supabase
              .from('users')
              .select('name, role')
              .eq('id', session.user.id)
              .single();

            if (retryError) {
              throw retryError;
            }

            set({
              user: {
                id: session.user.id,
                email: session.user.email!,
                name: retryData.name,
                role: retryData.role,
              },
              loading: false,
            });
            return;
          }
          throw userError;
        }

        set({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: userData.name,
            role: userData.role,
          },
          loading: false,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        await supabase.auth.signOut();
        set({ user: null, loading: false });
        return;
      }

      // Configurer l'écouteur de changements d'authentification
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            try {
              const { data: userData, error: userError } = await supabase
                .from('users')
                .select('name, role')
                .eq('id', session.user.id)
                .single();

              if (userError) throw userError;

              set({
                user: {
                  id: session.user.id,
                  email: session.user.email!,
                  name: userData.name,
                  role: userData.role,
                },
              });
            } catch (error) {
              console.error('Erreur lors de la récupération des données utilisateur:', error);
              await supabase.auth.signOut();
              set({ user: null });
            }
          } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
            await supabase.auth.signOut();
            set({ user: null });
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la session:', error);
      set({
        user: null,
        error: error instanceof Error ? error.message : 'Erreur de session',
        loading: false,
      });
    }
  },

  signUp: async (email: string, password: string, name: string) => {
    try {
      set({ loading: true, error: null });

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Erreur lors de la création du compte');

      // Attendre que le trigger crée le profil utilisateur
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: userData.name,
            role: userData.role,
          },
          loading: false,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        throw new Error('Erreur lors de la création du profil utilisateur');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription',
        loading: false,
      });
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error('Identifiants invalides');

      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', data.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            name: userData.name,
            role: userData.role,
          },
          loading: false,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        throw new Error('Erreur lors de la récupération des données utilisateur');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la connexion',
        loading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
      window.location.href = '/login';
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la déconnexion',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));