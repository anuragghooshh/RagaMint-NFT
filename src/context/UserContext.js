import { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUser } from "@/services/firebase-services/cookies";
import useFirebaseAuth from "@/services/firebase-services/useFirebaseAuth";
import { useRouter } from "next/navigation";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logOut } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount
    const token = getToken();
    const userInfo = getUser();

    if (token && userInfo) {
      setUser(userInfo);
    }

    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <UserContext.Provider
      value={{ user, loading, setUser, logout: handleLogout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
