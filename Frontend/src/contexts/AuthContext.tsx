
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AppwriteService } from '@/services/appwrite';
import { Models } from 'appwrite';

// Types
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImageUrl?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Mock users for testing before fully migrating to Appwrite
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin' as UserRole,
  },
  {
    id: '2',
    name: 'Student User',
    email: 'student@example.com',
    password: 'password123',
    role: 'student' as UserRole,
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const currentUser = await AppwriteService.getCurrentUser();
        
        if (currentUser) {
          // Determine role - in a real app, you might store this in Appwrite or another DB
          // For now, we'll use a simple approach matching emails from our mock data
          const mockUser = MOCK_USERS.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
          const role = mockUser ? mockUser.role : 'student';
          
          const userData: User = {
            id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            role: role,
          };
          
          setUser(userData);
          localStorage.setItem('eduFinUser', JSON.stringify(userData));
          console.log("User authenticated via Appwrite:", userData);
        } else {
          // Fall back to localStorage for backward compatibility during transition
          const storedUser = localStorage.getItem('eduFinUser');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.log("User restored from localStorage:", parsedUser);
            } catch (error) {
              console.error("Failed to parse stored user:", error);
              localStorage.removeItem('eduFinUser');
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Try to login with Appwrite
      await AppwriteService.login(email, password);
      const currentUser = await AppwriteService.getCurrentUser();
      
      if (currentUser) {
        // Find user role from mock data (in a real app, this would come from your database)
        const mockUser = MOCK_USERS.find(u => 
          u.email.toLowerCase() === email.toLowerCase()
        );
        
        const role = mockUser ? mockUser.role : 'student';
        
        // Create user object
        const userData: User = {
          id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          role: role,
        };
        
        // Save user data to state and localStorage
        setUser(userData);
        localStorage.setItem('eduFinUser', JSON.stringify(userData));
        
        toast({
          title: "Success",
          description: `You have been logged in successfully as ${role}`,
        });
        
        console.log("Login successful via Appwrite:", userData);
        return;
      }
      
      throw new Error("Failed to get user after login");
      
    } catch (error) {
      console.error('Login failed:', error);
      
      // Fallback to mock login during transition
      if (process.env.NODE_ENV === 'development') {
        // Find user in mock data
        const foundUser = MOCK_USERS.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
        );
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          
          // Save user data to localStorage
          localStorage.setItem('eduFinUser', JSON.stringify(userWithoutPassword));
          
          setUser(userWithoutPassword);
          
          toast({
            title: "Success (Dev Mode)",
            description: `You have been logged in successfully using mock data as ${userWithoutPassword.role}`,
          });
          
          console.log("Login successful (mock):", userWithoutPassword);
          return;
        }
      }
      
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      setIsLoading(true);
      
      // Create account with Appwrite
      await AppwriteService.createAccount(email, password, name);
      
      // Login automatically after registration
      const currentUser = await AppwriteService.getCurrentUser();
      
      if (currentUser) {
        const userData: User = {
          id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          role: role, // In a real app, you'd save this to a database
        };
        
        // Save user data to localStorage for now
        // In a production app, you'd store role in a database
        localStorage.setItem('eduFinUser', JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "Registration successful",
          description: "Your account has been created successfully",
        });
        
        return;
      }
      
      throw new Error("Failed to get user after registration");
      
    } catch (error) {
      // Fallback to mock registration during transition
      if (process.env.NODE_ENV === 'development') {
        // Check if user exists in mock data
        if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
          throw new Error('User with this email already exists');
        }
        
        const newUser = {
          id: String(Date.now()),
          name,
          email,
          role,
        };
        
        // Save user data to localStorage
        localStorage.setItem('eduFinUser', JSON.stringify(newUser));
        
        setUser(newUser);
        
        toast({
          title: "Registration successful (Dev Mode)",
          description: "Your account has been created successfully using mock data",
        });
        
        return;
      }
      
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Try to logout from Appwrite
      await AppwriteService.logout();
    } catch (error) {
      console.error("Appwrite logout failed, proceeding with local logout:", error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('eduFinUser');
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
