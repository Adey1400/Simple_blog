import { createContext } from "react";
import { useContext, useState, useEffect } from "react";
import { ID } from "appwrite";
import { account } from "../appwriteConfig";
import LoadingSpinner from "../pages/Loading";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    checkUserStatus();
  }, []);
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
    console.log(error);
    throw error; 
  } finally {
    setLoading(false); 
  }
};


  const logoutUser = () => {
    account.deleteSession("current");
    setUser(null);
  };
  const registerUser = async (userInfo) => {
    setLoading(true);
    try {
      let response = await account.create(
        ID.unique(),
        userInfo.email,
        userInfo.password,
        userInfo.name
      );
      await account.createEmailPasswordSession(
        userInfo.email,
        userInfo.password
      );
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

 const checkUserStatus = async () => {
  try {
    let accountDetails = await account.get();
    setUser(accountDetails);
  } catch (error) {
    console.log("No active session:", error.message);
    setUser(null); // 🔐 Ensure user is null if not logged in
  } finally {
    setLoading(false); // ✅ Always stop loading
  }
};
  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
  };
  return (
    <AuthContext.Provider value={contextData}>
{children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
