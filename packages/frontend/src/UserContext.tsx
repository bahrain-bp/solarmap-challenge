import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth } from 'aws-amplify';

interface UserContextProps {
  userCustomId: number | null; // Change the type to number
  userEmail: string; // Change the type to string (assuming userEmail is always provided)
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userCustomId, setUserCustomId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string>(''); // Change the initial state to an empty string

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfo = await Auth.currentUserInfo();
        const customUserId = parseInt(userInfo.attributes['custom:userId'], 10); // Access the custom attribute as a number
        const email = userInfo.attributes.email;

        if (!isNaN(customUserId)) {
          setUserCustomId(customUserId);
        } else {
          console.error('Custom user ID is not a valid number.');
        }

        setUserEmail(email);
      } catch (error) {
        console.error('Error getting current user info:', error);
      }
    }

    fetchUserInfo();
  }, []);

  console.log('userCustomId:', userCustomId);
  console.log('type of user_id', typeof userCustomId); // Log the type of userCustomId
  console.log('userEmail:', userEmail); // Log userEmail

  return <UserContext.Provider value={{ userCustomId, userEmail }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw Error('useUser must be used within a UserProvider');
  }
  return context;
};

