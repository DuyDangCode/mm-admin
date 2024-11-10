import { createContext } from 'react';

const UserContext = createContext<UserContext>({
  user: null,
  setUser: (data: any) => {},
});

interface UserContext {
  user: any;
  setUser: Function;
}

export default UserContext;
