
// Define user roles
export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

// Sample users with different roles
export const users: User[] = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    name: "Yönetici"
  },
  {
    username: "editor",
    password: "editor123",
    role: "editor",
    name: "Editör"
  },
  {
    username: "user",
    password: "user123",
    role: "viewer",
    name: "Kullanıcı"
  }
];

// Authentication function
export const authenticateUser = (username: string, password: string): User | null => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
};

// Check if user has permission based on their role
export const hasPermission = (role: UserRole, requiredRole: UserRole): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    "admin": 3,
    "editor": 2,
    "viewer": 1
  };
  
  return roleHierarchy[role] >= roleHierarchy[requiredRole];
};
