export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: unknown) => Promise<void>;
  register: (payload: unknown) => Promise<void>;
  logout: () => Promise<void>;
}
