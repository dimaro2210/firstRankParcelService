import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  accountType: "Personal" | "Business";
  userId: string;
  company?: string;
  address?: string;
  postalCode?: string;
  profilePicture?: string;
  status?: "pending" | "approved" | "declined";
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfilePicture: (dataUri: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: "Personal" | "Business";
  userId: string;
  company?: string;
  address?: string;
  postalCode?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

function buildUserFromAuth(sessionUser: any, profile?: any): User {
  const meta = sessionUser?.user_metadata || {};
  return {
    firstName: profile?.first_name || meta.first_name || meta.firstName || sessionUser?.email?.split('@')[0] || 'User',
    lastName: profile?.last_name || meta.last_name || meta.lastName || '',
    email: profile?.email || sessionUser?.email || '',
    accountType: (profile?.account_type || meta.account_type || meta.accountType || 'Personal') as "Personal" | "Business",
    userId: profile?.user_id || meta.user_id || meta.userId || sessionUser?.id || '',
    company: profile?.company || meta.company,
    address: profile?.address || meta.address,
    postalCode: profile?.postal_code || meta.postal_code || meta.postalCode,
    profilePicture: profile?.profile_picture || meta.profile_picture || meta.profilePicture,
    status: profile?.status || meta.status || 'approved',
    is_admin: profile?.role === 'admin' || meta.role === 'admin' || false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  useEffect(() => {
    // 1. Initial Session Check on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = buildUserFromAuth(session.user);
        setUser(u);
        setLoading(false);

        // Optionally enrich from users table in background
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser(buildUserFromAuth(session.user, profile));
            }
          })
          .catch(() => {});
      } else {
        setUser(null);
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    // 2. Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const u = buildUserFromAuth(session.user);
        setUser(u);
        setLoading(false);

        // Fetch user profile from public.users table in background without clearing session on failure
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser(buildUserFromAuth(session.user, profile));
            }
          })
          .catch(() => {});
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrId: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      let targetEmail = emailOrId.trim();

      // If user entered a user_id without @, attempt to lookup email
      if (!targetEmail.includes('@')) {
        try {
          const { data: lookupUser } = await supabase
            .from('users')
            .select('email')
            .eq('user_id', targetEmail)
            .single();
          if (lookupUser?.email) {
            targetEmail = lookupUser.email;
          }
        } catch {
          // Continue with entered identifier
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password,
      });

      if (error || !data?.user) {
        setLoading(false);
        return { success: false, error: "Invalid credentials. Please check your email/User ID and password." };
      }

      // Build user immediately so isAuthenticated becomes true without delay
      const authUser = data.user;
      let userObj = buildUserFromAuth(authUser);

      // Check database status if available
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          userObj = buildUserFromAuth(authUser, profile);
        }
      } catch {
        // Fallback to metadata status
      }

      if (userObj.status === 'pending') {
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return { success: false, error: "Your account is currently under review. We will get back to you shortly." };
      }

      if (userObj.status === 'declined') {
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return { success: false, error: "Your account application has been declined. Please contact support." };
      }

      // Set user immediately before returning
      setUser(userObj);
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "An unexpected error occurred during login." };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            account_type: data.accountType,
            user_id: data.userId,
            company: data.company,
            address: data.address,
            postal_code: data.postalCode,
            status: "pending"
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Automatically sign out because they are pending approval
      await supabase.auth.signOut();
      setUser(null);
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: "An error occurred during registration. Please try again." };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  const updateProfilePicture = async (dataUri: string) => {
    if (!user) return;
    
    // Optimistic update
    setUser({ ...user, profilePicture: dataUri });

    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase
          .from('users')
          .update({ profile_picture: dataUri })
          .eq('id', session.session.user.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfilePicture, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
