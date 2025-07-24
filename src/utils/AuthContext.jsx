import { createContext, useContext, useState, useEffect } from "react";
import { ID } from "appwrite";
import { account } from "../appwriteConfig";
import LoadingSpinner from "../pages/Loading";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // Global loading for auth status
  const [user, setUser] = useState(null);       // Current logged-in user

  // Check user session on app load
  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ Register a new user
  const registerUser = async (userInfo) => {
    setLoading(true);
    try {
      // Create user
      await account.create(
        ID.unique(),
        userInfo.email,
        userInfo.password,
        userInfo.name
      );
      // Log in the user right after registration
      await account.createEmailPasswordSession(
        userInfo.email,
        userInfo.password
      );
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Log in existing user
  const loginUser = async (userInfo) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(
        userInfo.email,
        userInfo.password
      );
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Log out user
  const logoutUser = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Check if user is logged in (used on mount & elsewhere)
  const checkAuth = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log("No active session:", error.message);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Provide values to components
  const contextData = {
    user,
    loading,
    loginUser,
    logoutUser,
    registerUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

// Custom hook to access context easily
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
